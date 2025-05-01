import PropTypes from "prop-types";
import Modal from "./Modal";
import { CheckCircle } from "lucide-react";
import Button from "./Button";

const TransferSuccessModal = ({
  isOpen,
  onClose,
  amount,
  recipientName,
  accountNumber,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center space-y-2 px-6 py-8">
        <div className="flex justify-center">
          <div className="bg-green-100 rounded-full p-2">
            <CheckCircle size={48} className="text-green-500" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900">
          Transfer Successful!
        </h2>
        <p className="text-sm text-gray-600">The funds have been transferred.</p>

        <div className="bg-gray-100 text-sm text-left p-4 rounded-xl space-y-2 mt-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold text-gray-900">{amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">To:</span>
            <span className="text-gray-900">{recipientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Account:</span>
            <span className="text-gray-900">{accountNumber}</span>
          </div>
        </div>

        <div className="pt-6">
          <Button onClick={onClose} fullWidth variant="primary">
            Confirm
          </Button>
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
  accountNumber: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default TransferSuccessModal;