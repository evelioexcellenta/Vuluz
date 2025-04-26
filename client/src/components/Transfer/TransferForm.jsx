import { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import Card from "../UI/Card";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import Alert from "../UI/Alert";
import {
  isValidAccountNumber,
  isValidAmount,
  isAmountInRange,
} from "../../utils/validators";
import { formatCurrency } from "../../utils/formatters";
import { apiRequest } from "../../utils/api";

const TransferForm = ({
  onSubmit,
  isLoading = false,
  maxTransferAmount = 99999999,
  minTransferAmount = 3000,
  className = "",
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [recipientName, setRecipientName] = useState("");

  // Form validation with react-hook-form
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

  // Watch amount for confirmation display
  const amountValue = watch("amount");

  // Handle form validation and open confirmation modal
  const handleFormSubmit = (data) => {
    setFormData({
      ...data,
      recipient: recipientName,
    });
    setShowConfirmation(true);
  };

  // Handle actual form submission after confirmation
  const handleConfirmTransfer = async () => {
    try {
      setShowConfirmation(false);
      const result = await onSubmit(formData);

      if (result.success) {
        setSuccess(true);
        reset();
      } else {
        setError(result.error || "Transfer failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  // Close success alert and clear state
  const handleDismissSuccess = () => {
    setSuccess(false);
  };

  // Close error alert and clear state
  const handleDismissError = () => {
    setError("");
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
      // Coba semua kemungkinan struktur
      if (res.fullName) {
        setRecipientName(res.fullName);
      } else if (res.data && res.data.fullName) {
        setRecipientName(res.data.fullName);
      } else {
        setRecipientName("User not found");
      }

      setError("");
    } catch (err) {
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
      <Card.Body>
        {success && (
          <Alert
            type="success"
            title="Transfer Successful"
            message="Your money has been sent successfully."
            onClose={handleDismissSuccess}
            autoClose={true}
            className="mb-4"
          />
        )}

        {error && (
          <Alert
            type="error"
            title="Transfer Failed"
            message={error}
            onClose={handleDismissError}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Account Number */}
          <div className="form-control">
            <label htmlFor="accountNumber" className="form-label">
              Account Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                id="accountNumber"
                placeholder="e.g. 123456"
                className="form-input flex-1"
                {...register("accountNumber", {
                  required: "Account number is required",
                  min: { value: 100000, message: "Minimum 6 digits" },
                  max: { value: 999999999999, message: "Maximum 12 digits" },
                  validate: {
                    validAccount: (value) =>
                      isValidAccountNumber(value) ||
                      "Please enter a valid account number",
                  },
                })}
                disabled={isLoading}
              />
              <Button
                type="button"
                className="h-full"
                variant="primary"
                onClick={handleCheckAccount}
              >
                Check
              </Button>
            </div>
            <p className="form-helper">Enter the 6-12 digit account number</p>
            {errors.accountNumber && (
              <p className="text-sm text-red-500 mt-1">
                {errors.accountNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            {/* Recipient Name */}
            <Input
              label="Recipient Name"
              type="text"
              id="recipient"
              value={recipientName || "User not found"}
              readOnly
              disabled
            />

            {/* Amount */}
            <Input
              label="Amount"
              type="number"
              id="amount"
              step="0.01"
              min={minTransferAmount}
              max={maxTransferAmount}
              {...register("amount", {
                required: "Amount is required",
                validate: {
                  validAmount: (value) =>
                    isValidAmount(value) || "Please enter a valid amount",
                  minAmount: (value) =>
                    isAmountInRange(
                      value,
                      minTransferAmount,
                      maxTransferAmount
                    ) ||
                    `Amount must be between ${formatCurrency(
                      minTransferAmount
                    )} and ${formatCurrency(maxTransferAmount)}`,
                },
              })}
              error={errors.amount?.message}
              placeholder="0.00"
              disabled={isLoading}
              required
            />

            {/* Description */}
            <div className="form-control">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                rows="3"
                className="form-input"
                placeholder="What's this transfer for?"
                {...register("description")}
                disabled={isLoading}
              ></textarea>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Continue
            </Button>
          </div>
        </form>
      </Card.Body>

      {/* Confirmation Modal */}
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
                {formatCurrency(amountValue)}
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

TransferForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  maxTransferAmount: PropTypes.number,
  minTransferAmount: PropTypes.number,
  className: PropTypes.string,
};

export default TransferForm;
