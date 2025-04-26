import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import PropTypes from 'prop-types';

const PinModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setPin(''); // reset pin saat modal ditutup
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(value);
  };

  const handleSubmit = () => {
    if (pin.length === 6) {
      onConfirm(pin);
    } else {
      alert('PIN must be 6 digits');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enter PIN"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : (
              'Confirm'
            )}
          </Button>
        </div>
      }
    >
      <div className="flex justify-center mb-4">
        <input
          type="password"
          value={pin}
          onChange={handleChange}
          maxLength={6}
          className="text-center border border-gray-300 rounded-md p-2 text-lg tracking-widest"
          placeholder="••••••"
          disabled={isLoading}
        />
      </div>
    </Modal>
  );
};

PinModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default PinModal;
