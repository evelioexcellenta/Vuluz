import { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import Card from "../UI/Card";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import Alert from "../UI/Alert";
import PinModal from "../UI/PinModal";
import { isValidAccountNumber } from "../../utils/validators";
import { formatCurrency } from "../../utils/formatters";
import { apiRequest } from "../../utils/api";
import TransferSuccessModal from "../UI/TransferSuccessModal";

const TransferForm = ({
  onSubmit,
  isLoading = false,
  maxTransferAmount = 99999999,
  minTransferAmount = 3000,
  className = "",
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [pendingData, setPendingData] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState("");
  const [recipientName, setRecipientName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      recipient: "",
      accountNumber: "",
      amount: "",
      description: "",
    },
  });

  const amountValue = watch("amount");
  const accountNumberValue = watch("accountNumber");
  const descriptionValue = watch("description");

  const handleFormSubmit = () => {
    const parsedAmount = parseFloat(amountValue);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    const transferData = {
      accountNumber: accountNumberValue,
      amount: parsedAmount,
      recipient: recipientName || "Unknown",
      description: descriptionValue,
    };

    setFormData(transferData);
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

      if (result.status == "Success") {
        setSuccessData({
          amount: finalData.amount,
          recipient: finalData.recipient,
          accountNumber: finalData.accountNumber,
        });
        setShowSuccessModal(true);
        reset();
        setRecipientName("");
      } else {
        setError(result.error || "Transfer failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleCheckAccount = async () => {
    const accountNumber = watch("accountNumber");
    if (!accountNumber) {
      setRecipientName("User not found");
      return;
    }
    try {
      const res = await apiRequest(
        `/api/wallet/owner/${Number(accountNumber)}`
      );
      setRecipientName(res.fullName || res.data?.fullName || "User not found");
      setError("");
    } catch {
      setRecipientName("");
      setError("User not found");
    }
  };

  return (
    <Card className={`animate-fade-in ${className}`}>
      <Card.Header
        title="Transfer Money"
        subtitle="Send money to another account"
      />
      <Card.Body className="font-poppins">
        {error && (
          <Alert
            type="error"
            title="Transfer Failed"
            message={error}
            onClose={() => setError("")}
          />
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="form-control">
            <label className="form-label">Account Number *</label>
            <div className="flex gap-2">
              <input
                type="number"
                className="form-input flex-1"
                {...register("accountNumber", {
                  required: "Account number is required",
                  min: { value: 100000, message: "Min 6 digits" },
                  max: { value: 999999999999, message: "Max 12 digits" },
                  validate: {
                    validAccount: (value) =>
                      isValidAccountNumber(value) || "Invalid account number",
                  },
                })}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="primary"
                onClick={handleCheckAccount}
              >
                Check
              </Button>
            </div>
            {errors.accountNumber && (
              <p className="text-sm text-red-500 mt-1">
                {errors.accountNumber.message}
              </p>
            )}
          </div>

          <Input
            label="Recipient Name"
            id="recipient"
            value={recipientName || "User not found"}
            readOnly
            disabled
          />

          <Input
            label="Amount"
            type="number"
            id="amount"
            step="0.01"
            min={minTransferAmount}
            max={maxTransferAmount}
            {...register("amount")}
            error={errors.amount?.message}
            placeholder="0.00"
            disabled={isLoading}
            required
          />

          <div className="form-control">
            <label className="form-label">Description</label>
            <textarea
              rows="3"
              className="form-input"
              placeholder="What's this transfer for?"
              {...register("description")}
              disabled={isLoading}
            ></textarea>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Continue
          </Button>
        </form>
      </Card.Body>

      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Transfer"
        footer={
          <div className="flex justify-end gap-3">
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

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onConfirm={handlePinConfirm}
        isLoading={isLoading}
      />

      {successData && (
        <TransferSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          amount={formatCurrency(successData.amount)}
          recipientName={successData.recipient}
          accountNumber={successData.accountNumber}
        />
      )}
    </Card>
  );
};

TransferForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  maxTransferAmount: PropTypes.number,
  minTransferAmount: PropTypes.number,
  className: PropTypes.string,
};

export default TransferForm;
