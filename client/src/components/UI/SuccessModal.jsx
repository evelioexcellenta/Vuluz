import Modal from "./Modal";
import Button from "./Button";
import PropTypes from "prop-types";
import { formatCurrency } from "../../utils/formatters"; // kalau mau formatCurrency juga dipakai disini

const SuccessModal = ({ isOpen, onClose, amount, paymentMethod }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Top-Up Successful"
      footer={
        <div className="flex justify-center">
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center space-y-6 text-center">
        {/* Success Icon */}
        <div className="bg-green-100 p-4 rounded-full">
          <svg
            className="h-12 w-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Top Up Successful!
          </h2>
          <p className="text-gray-600 text-sm">
            Your account has been credited.
          </p>
        </div>

        {/* Transaction Details */}
        <div className="bg-gray-50 p-4 rounded-lg w-full max-w-xs space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount:</span>
            <span className="font-bold text-gray-800">{amount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment Method:</span>
            <span className="font-medium text-gray-800">{paymentMethod}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

SuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  amount: PropTypes.string.isRequired,
  paymentMethod: PropTypes.string.isRequired,
};

export default SuccessModal;
