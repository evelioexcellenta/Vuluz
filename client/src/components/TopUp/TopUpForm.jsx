import { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import Card from "../UI/Card";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import Alert from "../UI/Alert";
import { isValidAmount, isAmountInRange } from "../../utils/validators";
import { formatCurrency } from "../../utils/formatters";
import { APP_CONFIG } from "../../constants/config";
import PinModal from "../UI/PinModal";
import SuccessModal from "../UI/SuccessModal";

const TopUpForm = ({
  onSubmit,
  isLoading = false,
  maxTopUpAmount = 99999999,
  minTopUpAmount = 5,
  className = "",
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: {
      amount: "",
      paymentMethod: APP_CONFIG.PAYMENT_METHODS[0].id,
      description: "",
    },
  });

  const amountValue = watch("amount");
  const methodValue = watch("paymentMethod");

  const getMethodName = (methodId) => {
    const method = APP_CONFIG.PAYMENT_METHODS.find((m) => m.id === methodId);
    return method ? method.name : methodId;
  };

  const handleFormSubmit = (data) => {
    setFormData(data);
    setShowConfirmation(true);
  };

  const handlePinConfirm = async (pin) => {
    try {
      setShowPinModal(false);
      const finalData = { ...pendingData, pin };
      const result = await onSubmit(finalData);

      if (result.success) {
        setShowSuccessModal(true);
        reset();
      } else {
        setError(result.error || "Top-up failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <Card className={`animate-fade-in ${className}`}>
      <Card.Header title="Add Money" subtitle="Top up your account balance" />
      <Card.Body>

        {success && (
          <Alert type="success" title="Top-Up Successful" onClose={() => setSuccess(false)} autoClose />
        )}
        {error && (
          <Alert type="error" title="Top-Up Failed" message={error} onClose={() => setError("")} />
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-4">

            {/* Preset Buttons */}
            <div className="form-control">
              <label className="form-label">Suggested Amounts</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[10000, 25000, 50000, 100000, 250000, 500000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 text-sm font-medium"
                    onClick={() => setValue("amount", amount)}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <Input
              label="Amount"
              type="number"
              id="amount"
              step="1"
              min={minTopUpAmount}
              max={maxTopUpAmount}
              {...register("amount", {
                valueAsNumber: true, // ✅ FIX amount jadi number
                required: "Amount is required",
                validate: {
                  validAmount: (value) =>
                    isValidAmount(value) || "Please enter a valid amount",
                  minAmount: (value) =>
                    isAmountInRange(value, minTopUpAmount, maxTopUpAmount) ||
                    `Amount must be between ${formatCurrency(minTopUpAmount)} and ${formatCurrency(maxTopUpAmount)}`,
                },
              })}
              error={errors.amount?.message}
              placeholder="0"
              disabled={isLoading}
              required
            />

            {/* Payment Method Select */}
            <div className="form-control">
              <label className="form-label">Payment Method</label>
              <select
                className="form-input"
                {...register("paymentMethod", { required: "Payment method is required" })}
                disabled={isLoading}
              >
                {APP_CONFIG.PAYMENT_METHODS.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
              {errors.paymentMethod && (
                <p className="form-error">{errors.paymentMethod.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-input"
                {...register("description")}
                rows="2"
                placeholder="Add a note for your records"
                disabled={isLoading}
              />
            </div>

          </div>

          <div className="mt-6">
            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              Continue
            </Button>
          </div>
        </form>
      </Card.Body>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Top-Up"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowConfirmation(false);
                setPendingData(formData);
                setShowPinModal(true);
              }}
              isLoading={isLoading}
            >
              Confirm Top-Up
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">You are about to add:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Amount:</span>
              <span className="font-bold text-gray-800">
                {formatCurrency(formData?.amount || 0)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Method:</span>
              <span className="font-medium text-gray-800">
                {getMethodName(formData?.paymentMethod)}
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
            By confirming, you agree to the terms and conditions for this payment method.
          </p>
        </div>
      </Modal>

      {/* Pin Modal */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onConfirm={handlePinConfirm}
        isLoading={isLoading}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        amount={formatCurrency(formData?.amount || 0)}
        paymentMethod={getMethodName(formData?.paymentMethod)}
      />
    </Card>
  );
};

TopUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  maxTopUpAmount: PropTypes.number,
  minTopUpAmount: PropTypes.number,
  className: PropTypes.string,
};

export default TopUpForm;
