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
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);

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

  const handleTransfer = () => {
    if (!selectedFavorite || !amount) {
      setError("Please select a favorite and enter amount.");
      return;
    }

    setFormData({
      accountNumber: selectedFavorite.walletNumber,
      recipient: selectedFavorite.ownerName,
      amount: parseFloat(amount),
      description,
    });
    setShowConfirmation(true);
  };

  const handleConfirmTransfer = async () => {
    try {
      setShowConfirmation(false);
      const result = await onSubmit(formData);

      if (result.success) {
        setSuccess(true);
        setAmount("");
        setDescription("");
        setSelectedFavorite(null);
      } else {
        setError(result.error || "Transfer failed.");
      }
    } catch (err) {
      setError(err.message || "Transfer failed.");
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
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md mt-2">
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

      {/* Modal Konfirmasi */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Transfer"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmTransfer}
              isLoading={isLoading}
            >
              Confirm Transfer
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">You are about to transfer:</p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Amount:</span>
              <span className="font-bold text-gray-800">
                {formatCurrency(formData?.amount)}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-500">To:</span>
              <span className="font-medium text-gray-800">
                {formData?.recipient}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Account:</span>
              <span className="font-medium text-gray-800">
                {formData?.accountNumber}
              </span>
            </div>

            {formData?.description && (
              <div className="flex justify-between">
                <span className="text-gray-500">Description:</span>
                <span className="text-gray-800">{formData.description}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 italic">
            Please verify the information above before confirming.
          </p>
        </div>
      </Modal>
    </Card>
  );
};

FavoriteTransfer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default FavoriteTransfer;