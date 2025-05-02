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
import PinModal from "../UI/PinModal";
import TransferSuccessModal from "../UI/TransferSuccessModal";

const FavoriteTransfer = ({ onSubmit, isLoading = false }) => {
  const [favorites, setFavorites] = useState([]);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);
  const [error, setError] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState(null);
  const [pendingData, setPendingData] = useState(null);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await apiRequest("/api/getfavorites");
      setFavorites(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const validateAmount = (value) => {
    const numValue = parseFloat(value);

    if (!value) {
      return "Amount is required";
    }

    if (numValue < 0) {
      return "Amount cannot be below zero";
    }

    if (numValue > 100000000) {
      return "Maximum amount is 100,000,000";
    }

    return ""; // No error
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;

    // Allow only numbers and decimal point
    if (!/^[0-9]*$/.test(value) && value !== "") {
      return;
    }

    setAmount(value);
    setError(validateAmount(value));
  };

  const handleTransfer = () => {
    if (!selectedFavorite) {
      setError("Please select a favorite recipient");
      return;
    }

    const amountError = validateAmount(amount);
    if (amountError) {
      setError(amountError);
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

  const handleConfirmTransfer = () => {
    setPendingData(formData);
    setShowConfirmation(false);
    setShowPinModal(true);
  };

  const handlePinConfirm = async (pin) => {
    try {
      setShowPinModal(false);
      const finalData = { ...pendingData, pin };
      const result = await onSubmit(finalData);
      if (result?.success) {
        setSuccessData({
          amount: finalData.amount,
          recipient: finalData.recipient,
          accountNumber:
            finalData.accountNumber || selectedFavorite.walletNumber,
        });
        setShowSuccessModal(true);
        setAmount("");
        setDescription("");
        setSelectedFavorite(null);
      } else {
        setError(result?.error || "Transfer failed.");
      }
    } catch (err) {
      setError(err.message || "Transfer failed.");
    }
  };

  return (
    <Card>
      <Card.Header
        title="Transfer via Favorite"
        subtitle="Send Money to Your Favorite Recipient Quickly"
      />
      <Card.Body className="space-y-4">
        {error && (
          <Alert
            type="error"
            title="Error"
            message={error}
            onClose={() => setError("")}
          />
        )}

        <div>
          <label htmlFor="favorite-amount" className="form-label">
            Select Favorite Recipient
          </label>
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

        <div className="form-control">
          <label htmlFor="favorite-amount" className="form-label">
            Amount
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              Rp
            </span>
            <input
              id="favorite-amount"
              name="amount"
              type="text"
              className="form-input pl-10"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              min="0"
              max="100000000"
              required
              // Disable the up/down buttons
              onWheel={(e) => e.target.blur()}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>
          {error && error.includes("Amount") && (
            <div className="text-red-500 text-sm mt-1">{error}</div>
          )}
        </div>

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
          />
        </div>

        <Button
          fullWidth
          variant="primary"
          isLoading={isLoading}
          onClick={handleTransfer}
          disabled={!selectedFavorite || !amount || error}
        >
          Send Money
        </Button>
      </Card.Body>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Transfer"
      >
        <div className="p-4">
          <div className="text-center mb-4">
            <div className="text-lg font-medium">Transfer Details</div>
            <div className="text-3xl font-bold text-primary-600 my-2">
              {formatCurrency(formData?.amount || 0)}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">To</span>
              <span className="font-medium">{formData?.recipient}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account</span>
              <span>{formData?.accountNumber}</span>
            </div>
            {formData?.description && (
              <div className="flex justify-between">
                <span className="text-gray-600">Description</span>
                <span>{formData?.description}</span>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" fullWidth onClick={handleConfirmTransfer}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {/* PIN Modal */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onConfirm={handlePinConfirm}
      />

      {/* Success Modal */}
      <TransferSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        amount={formatCurrency(successData?.amount || 0)}
        recipientName={successData?.recipient || ""}
        accountNumber={successData?.accountNumber || ""}
      />
    </Card>
  );
};

FavoriteTransfer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default FavoriteTransfer;
