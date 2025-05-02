import { useState, useEffect } from "react";
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
  maxTransferAmount = 100000000,
  minTransferAmount = 10000,
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
  const [isLoadingRecipient, setIsLoadingRecipient] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    setError: setFormError,
    clearErrors,
  } = useForm({
    defaultValues: {
      accountNumber: "",
      amount: "",
      description: "",
    },
    mode: "onChange",
  });

  const accountNumberValue = watch("accountNumber");
  const amountValue = watch("amount");
  const descriptionValue = watch("description");

  // Validate account number when it changes
  useEffect(() => {
    if (accountNumberValue && accountNumberValue.length > 5) {
      lookupAccountDetails(accountNumberValue);
    } else {
      setRecipientName("");
    }
  }, [accountNumberValue]);

  // Function to lookup account details (similar to FavoriteManager's handleCheck)
  const lookupAccountDetails = async (accountNumber) => {
    // Clear previous errors
    clearErrors("accountNumber");

    // Validate account number format first
    if (!accountNumber || accountNumber === "") {
      setFormError("accountNumber", {
        type: "required",
        message: "Account number is required",
      });
      return;
    }

    // Check if account number is a valid number and > 0
    const numericValue = parseInt(accountNumber, 10);
    if (isNaN(numericValue) || numericValue <= 0) {
      setFormError("accountNumber", {
        type: "min",
        message: "Account number cannot be below zero",
      });
      return;
    }

    try {
      setIsLoadingRecipient(true);

      // Call the actual API (same endpoint as used in FavoriteManager)
      const res = await apiRequest(
        `/api/wallet/owner/${Number(accountNumber)}`
      );
      const name = res.fullName || res.data?.fullName;

      if (name) {
        setRecipientName(name);
        clearErrors("accountNumber");
      } else {
        setRecipientName("");
        setFormError("accountNumber", {
          type: "notFound",
          message: "Account number not found",
        });
      }
    } catch (err) {
      setRecipientName("");
      setFormError("accountNumber", {
        type: "api",
        message: "Error verifying account",
      });
    } finally {
      setIsLoadingRecipient(false);
    }
  };

  const onFormSubmit = (data) => {
    // Validate amount
    const amount = parseFloat(data.amount);

    if (isNaN(amount)) {
      setFormError("amount", {
        type: "required",
        message: "Amount is required",
      });
      return;
    }

    if (amount < minTransferAmount) {
      setFormError("amount", {
        type: "min",
        message: `Minimum amount is Rp ${minTransferAmount.toLocaleString()}`,
      });
      return;
    }

    if (amount > maxTransferAmount) {
      setFormError("amount", {
        type: "max",
        message: `Maximum amount is Rp ${maxTransferAmount.toLocaleString()}`,
      });
      return;
    }

    // Check if recipient name was found
    if (!recipientName) {
      setFormError("accountNumber", {
        type: "invalid",
        message: "Please enter a valid account number",
      });
      return;
    }

    // Prepare form data for confirmation
    setFormData({
      accountNumber: data.accountNumber,
      recipient: recipientName,
      amount: amount,
      description: data.description,
    });

    // Show confirmation modal
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
        // Ensure all required data for the success modal is properly set
        setSuccessData({
          amount: formatCurrency(finalData.amount),
          recipientName: finalData.recipient || "",
          accountNumber: finalData.accountNumber || "",
        });
        setShowSuccessModal(true);
        reset(); // Reset form
        setRecipientName("");
      } else {
        setError(result?.error || "Transfer failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Transfer failed. Please try again.");
    }
  };

  // Custom onChange handler for amount field to restrict input to numbers only
  const handleAmountChange = (e) => {
    const value = e.target.value;

    // Allow only numbers
    if (!/^[0-9]*$/.test(value) && value !== "") {
      return;
    }

    setValue("amount", value);

    // Clear error if value is valid
    if (
      parseFloat(value) >= minTransferAmount &&
      parseFloat(value) <= maxTransferAmount
    ) {
      clearErrors("amount");
    }
  };

  // Custom onChange handler for account number
  const handleAccountNumberChange = (e) => {
    const value = e.target.value;

    // Allow only numbers
    if (!/^[0-9]*$/.test(value) && value !== "") {
      return;
    }

    setValue("accountNumber", value);
  };

  return (
    <Card className={className}>
      <Card.Header
        title="Transfer Money"
        subtitle="Send money to another account"
      />
      <Card.Body>
        {error && (
          <Alert
            type="error"
            title="Error"
            message={error}
            onClose={() => setError("")}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="form-control">
            <label htmlFor="accountNumber" className="form-label">
              Account Number<span className="text-red-500">*</span>
            </label>
            <input
              id="accountNumber"
              type="text"
              className={`form-input ${
                errors.accountNumber ? "border-red-500" : ""
              }`}
              value={accountNumberValue}
              onChange={handleAccountNumberChange}
              placeholder="Enter account number"
              inputMode="numeric"
              pattern="[0-9]*"
            />
            {errors.accountNumber && (
              <div className="text-red-500 text-sm mt-1">
                {errors.accountNumber.message}
              </div>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="recipientName" className="form-label">
              Recipient Name<span className="text-red-500">*</span>
            </label>
            <input
              id="recipientName"
              type="text"
              className="form-input bg-gray-50"
              value={recipientName}
              readOnly
              placeholder={
                isLoadingRecipient
                  ? "Loading..."
                  : "Recipient name will appear here"
              }
            />
          </div>

          <div className="form-control">
            <label htmlFor="amount" className="form-label">
              Amount<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                Rp
              </span>
              <input
                id="amount"
                type="text"
                className={`form-input pl-10 ${
                  errors.amount ? "border-red-500" : ""
                }`}
                value={amountValue}
                onChange={handleAmountChange}
                placeholder="150,000"
                // Disable the up/down buttons
                onWheel={(e) => e.target.blur()}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            {errors.amount && (
              <div className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              Minimum: Rp {minTransferAmount.toLocaleString()}, Maximum: Rp{" "}
              {maxTransferAmount.toLocaleString()}
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              id="description"
              type="text"
              className="form-input"
              value={descriptionValue}
              onChange={(e) => setValue("description", e.target.value)}
              placeholder="What's this transfer for?"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Send Money
          </Button>
        </form>
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
        amount={successData?.amount || ""}
        recipientName={successData?.recipientName || ""}
        accountNumber={successData?.accountNumber || ""}
      />
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
