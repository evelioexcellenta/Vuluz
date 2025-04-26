import PropTypes from "prop-types";
import Modal from "./Modal";
import Button from "./Button";

const TransferSuccessModal = ({ isOpen, onClose, amount, recipientName, accountNumber }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer Successful"
      footer={
        <div className="flex justify-center">
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Success icon */}
        <div className="bg-green-100 rounded-full p-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Message */}
        <h2 className="text-lg font-semibold text-gray-800">Transfer Successful</h2>

        {/* Details */}
        <div className="bg-gray-100 p-4 rounded-lg w-full text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Amount:</span>
            <span className="font-bold text-gray-800">{amount}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">To:</span>
            <span className="font-medium text-gray-800">{recipientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Account:</span>
            <span className="font-medium text-gray-800">{accountNumber}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

TransferSuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  amount: PropTypes.string.isRequired,
  recipientName: PropTypes.string.isRequired,
  accountNumber: PropTypes.string.isRequired,
};

export default TransferSuccessModal;
