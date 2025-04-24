import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "../UI/Card";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import Alert from "../UI/Alert";
import { apiRequest } from "../../utils/api";
import { formatCurrency } from "../../utils/formatters";
import FavoriteManager from "./FavoriteManager";

const FavoriteTransfer = ({ onSubmit, isLoading = false }) => {
  const [favorites, setFavorites] = useState([]);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await apiRequest("/api/getfavorites");
      setFavorites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransfer = async () => {
    if (!selectedFavorite || !amount) return;

    const result = await onSubmit({
      toWalletNumber: selectedFavorite.walletNumber,
      amount: parseFloat(amount),
      notes: description,
    });

    if (result.success) {
      setSuccess(true);
      setAmount("");
      setDescription("");
      setSelectedFavorite(null);
    } else {
      setError(result.error || "Transfer failed.");
    }
  };

  return (
    <Card>
      <Card.Header title="Transfer via Favorite" />
      <Card.Body className="space-y-4">
        {success && (
          <Alert
            type="success"
            title="Success"
            message="Transfer complete."
            onClose={() => setSuccess(false)}
          />
        )}
        {error && (
          <Alert
            type="error"
            title="Error"
            message={error}
            onClose={() => setError("")}
          />
        )}

        <div>
          <label className="form-label">Select Favorite Recipient</label>
          <Button onClick={() => setShowFavoritesPopup(true)} variant="primary">
            Show Favorite
          </Button>

          <FavoriteManager
            isOpen={showFavoritesPopup}
            onClose={() => setShowFavoritesPopup(false)}
            onSelect={(fav) => {
              setSelectedFavorite(fav);
              setShowFavoritesPopup(false);
            }}
          />

          {selectedFavorite && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="text-sm text-gray-700 font-medium">
                {selectedFavorite.ownerName}
              </div>
              <div className="text-xs text-gray-500">
                {selectedFavorite.walletNumber}
              </div>
            </div>
          )}
        </div>

        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />

        <div className="form-control">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            rows="3"
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional notes"
          ></textarea>
        </div>

        <Button
          fullWidth
          variant="primary"
          isLoading={isLoading}
          onClick={handleTransfer}
        >
          Send Money
        </Button>
      </Card.Body>

    </Card>
  );
};

FavoriteTransfer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default FavoriteTransfer;
