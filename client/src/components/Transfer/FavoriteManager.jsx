import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "../UI/Modal";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { apiRequest } from "../../utils/api";
import { Trash2, UserCircle } from "lucide-react";

const FavoriteManager = ({ isOpen, onClose, onSelect }) => {
  const [favorites, setFavorites] = useState([]);
  const [walletNumber, setWalletNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) fetchFavorites();
  }, [isOpen]);

  const fetchFavorites = async () => {
    try {
      const res = await apiRequest("/api/getfavorites");
      setFavorites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheck = async () => {
    try {
      console.log("wall number : "+walletNumber);
      
      const res = await apiRequest(`/api/wallet/owner/${walletNumber}`);
      setRecipientName(res.fullName);
      setError("");
    } catch (err) {
      setRecipientName("");
      setError("Wallet not found");
    }
  };

  const handleAddFavorite = async () => {
    try {
      await apiRequest("/api/favorite", {
        method: "POST",
        body: JSON.stringify({ walletNumber }),
      });
      fetchFavorites();
      setWalletNumber("");
      setRecipientName("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (walletNumber) => {
    await apiRequest(`/api/favorite/delete?walletNumber=${walletNumber}`, {
      method: "DELETE",
    });
    fetchFavorites();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Favorite Recipients">
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-xl">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Add Favorite</h2>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <Input
                value={walletNumber}
                onChange={(e) => setWalletNumber(e.target.value)}
                placeholder="Input Account Number"
                className="w-full"
              />
              <div className="mt-2 text-sm font-medium text-gray-700 min-h-[1.5rem]">
                {recipientName || "Favorite Recipient"}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="primary" className="w-24" onClick={handleCheck}>
                Check
              </Button>
              <Button
                variant="danger"
                className="w-24"
                onClick={handleAddFavorite}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-2">
            Favorite List
          </h2>
          {favorites.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              You don't have any favorites
            </p>
          ) : (
            <div className="space-y-3">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="flex items-center bg-gray-100 p-3 rounded-xl justify-between"
                >
                  <div className="flex items-center gap-3">
                    <UserCircle size={28} className="text-purple-500" />
                    <div className="text-sm text-gray-700">
                      <div className="font-medium">{fav.ownerName}</div>
                      <div className="text-xs">{fav.walletNumber}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-center">
                  <Button size="sm" variant="outline" onClick={() => onSelect(fav)}>
                    Select
                  </Button>
                  <button
                    onClick={() => handleDelete(fav.walletNumber)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

FavoriteManager.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default FavoriteManager;