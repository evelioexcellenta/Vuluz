import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { apiRequest } from '../../utils/api';
import { Trash2 } from 'lucide-react';

const FavoriteManager = ({ isOpen, onClose, onSelect }) => {
  const [favorites, setFavorites] = useState([]);
  const [walletNumber, setWalletNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) fetchFavorites();
  }, [isOpen]);

  const fetchFavorites = async () => {
    try {
      const res = await apiRequest('/api/getfavorites');
      setFavorites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheck = async () => {
    try {
      const res = await apiRequest(`/api/wallet/owner/${walletNumber}`); // Adjust if needed
      setRecipientName(res.fullName);
      setError('');
    } catch (err) {
      setRecipientName('');
      setError('Wallet not found');
    }
  };

  const handleAddFavorite = async () => {
    try {
      await apiRequest('/api/favorite', {
        method: 'POST',
        body: JSON.stringify({ walletNumber })
      });
      fetchFavorites();
      setWalletNumber('');
      setRecipientName('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (walletNumber) => {
    await apiRequest(`/api/favorite/delete?walletNumber=${walletNumber}`, {
      method: 'DELETE'
    });
    fetchFavorites();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Favorite Recipients">
      <div className="space-y-4">
        <div className="bg-red-100 p-4 rounded-lg">
          <h2 className="font-semibold text-gray-800">Add Favorite</h2>
          <div className="flex gap-2 mt-2">
            <Input
              value={walletNumber}
              onChange={(e) => setWalletNumber(e.target.value)}
              placeholder="Input Account number"
              className="flex-1"
            />
            <Button variant="outline" onClick={handleCheck}>Check</Button>
          </div>
          {recipientName && (
            <div className="mt-2 text-center font-semibold">{recipientName}</div>
          )}
          <Button className="mt-2" variant="danger" onClick={handleAddFavorite}>Add</Button>
        </div>

        <h2 className="font-semibold text-gray-800 mt-4">Favorite List</h2>
        <div className="space-y-2">
          {favorites.map(fav => (
            <div key={fav.id} className="bg-sky-100 px-4 py-2 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-semibold">{fav.ownerName}</div>
                <div className="text-xs text-gray-500">{fav.walletNumber}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => onSelect(fav)}>
                  Select
                </Button>
                <button
                  onClick={() => handleDelete(fav.walletNumber)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

FavoriteManager.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default FavoriteManager;
