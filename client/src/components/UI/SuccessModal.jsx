import Modal from './Modal';
import Button from './Button';
import PropTypes from 'prop-types';

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
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="bg-green-100 p-4 rounded-full">
          <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="text-gray-700">
          <p className="text-lg font-semibold">Top Up Successful</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg w-full max-w-xs">
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Amount:</span>
            <span className="font-bold text-gray-800">{amount}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Payment Method:</span>
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
