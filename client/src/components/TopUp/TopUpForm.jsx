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

  // Form validation with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      amount: "",
      paymentMethod: APP_CONFIG.PAYMENT_METHODS[0].id,
      description: "",
    },
  });

  // Watch values for confirmation display
  const amountValue = watch("amount");
  const methodValue = watch("paymentMethod");

  // Get payment method name from ID
  const getMethodName = (methodId) => {
    const method = APP_CONFIG.PAYMENT_METHODS.find((m) => m.id === methodId);
    return method ? method.name : methodId;
  };

  // Handle form validation and open confirmation modal
  const handleFormSubmit = (data) => {
    setFormData(data);
    setShowConfirmation(true);
  };

  // Handle actual form submission after confirmation
  const handleConfirmTopUp = async () => {
    try {
      setShowConfirmation(false);

      const result = await onSubmit(formData);

      if (result.success) {
        setSuccess(true);
        reset();
      } else {
        if(result.error == "JWT token expired"){
          setError("Please Relogin")
        }else setError("Top-up failed. Please try again.");
      }
    } catch (err) {
      setError(err.message|| "An unexpected error occurred.");
    }
  };

  // success alert 
  const handleDismissSuccess = () => {
    setSuccess(false);
  };

  const handleDismissError = () => {
    setError("");
  };

  return (
    <Card className={`animate-fade-in ${className}`}>
      <Card.Header title="Add Money" subtitle="Top up your account balance" />
      <Card.Body>
        {success && (
          <Alert
            type="success"
            title="Top-Up Successful"
            message="Your account has been credited successfully."
            onClose={handleDismissSuccess}
            autoClose={true}
            className="mb-4"
          />
        )}

        {error && (
          <Alert
            type="error"
            title="Top-Up Failed"
            message={error}
            onClose={handleDismissError}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-4">
            {/* Preset Amounts */}
            <div className="form-control">
              <label className="form-label">Suggested Amounts</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[10000, 25000, 50000, 100000, 250000, 500000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 text-sm font-medium"
                    onClick={() => {
                      reset({ ...watch(), amount: amount.toString() });
                    }}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <Input
              label="Amount"
              type="number"
              id="amount"
              step="0.01"
              min={minTopUpAmount}
              max={maxTopUpAmount}
              {...register("amount", {
                required: "Amount is required",
                validate: {
                  validAmount: (value) =>
                    isValidAmount(value) || "Please enter a valid amount",
                  minAmount: (value) =>
                    isAmountInRange(value, minTopUpAmount, maxTopUpAmount) ||
                    `Amount must be between ${formatCurrency(
                      minTopUpAmount
                    )} and ${formatCurrency(maxTopUpAmount)}`,
                },
              })}
              error={errors.amount?.message}
              placeholder="0.00"
              disabled={isLoading}
              required
            />

            {/* Payment Method */}
            <div className="form-control">
              <label htmlFor="method" className="form-label">
                Payment Method
              </label>
              <select
                id="method"
                className="form-input"
                {...register("paymentMethod", {
                  required: "Payment method is required",
                })}
                disabled={isLoading}
              >
                {APP_CONFIG.PAYMENT_METHODS.map((paymentMethod) => (
                  <option key={paymentMethod.id} value={paymentMethod.id}>
                    {paymentMethod.name}
                  </option>
                ))}
              </select>
              {errors.paymentMethod && (
                <p className="form-error">{errors.paymentMethod.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="form-control">
              <label htmlFor="description" className="form-label">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows="2"
                className="form-input"
                placeholder="Add a note for your records"
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
        title="Confirm Top-Up"
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
              onClick={handleConfirmTopUp}
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
                {formatCurrency(amountValue)}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Method:</span>
              <span className="font-medium text-gray-800">
                {getMethodName(methodValue)}
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
            By confirming, you agree to the terms and conditions for this
            payment method.
          </p>
        </div>
      </Modal>
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