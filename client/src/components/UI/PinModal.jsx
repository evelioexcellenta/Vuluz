import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import Button from "./Button";

const PinModal = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);

  const handleChange = (value, index) => {
    const updatedPin = [...pin];
    updatedPin[index] = value;
    setPin(updatedPin);

    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleConfirm = () => {
    const pinCode = pin.join("");
    if (pinCode.length === 6) {
      onConfirm(pinCode);
      setPin(["", "", "", "", "", ""]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enter PIN">
      <div className="space-y-6">
        <div className="flex justify-center gap-3 mt-2">
          {pin.map((val, i) => (
            <input
              key={i}
              id={`pin-${i}`}
              type="password"
              inputMode="numeric"
              maxLength={1}
              className="w-12 h-12 border rounded-lg text-center text-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={val}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleBackspace(e, i)}
            />
          ))}
        </div>

        <div className="flex justify-end gap-4 border-t pt-4">
          <button
            onClick={() => {
              setPin(["", "", "", "", "", ""]);
              onClose();
            }}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded"
          >
            Confirm
          </button>
        </div>
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
