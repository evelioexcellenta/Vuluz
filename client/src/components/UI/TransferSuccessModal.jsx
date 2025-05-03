import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import Button from "./Button";
import { CheckCircle } from "lucide-react";

const TransferSuccessModal = ({
  isOpen,
  onClose,
  amount = "",
  recipientName = "",
  accountNumber = "",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transfer Success">
      <div className="p-4 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Transfer Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Your money has been successfully transferred.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="text-center mb-2">
            <div className="text-sm text-gray-500">Amount</div>
            <div className="text-2xl font-bold text-primary-600">{amount}</div>
          </div>

          <div className="space-y-2">
            <div>
              <div className="text-sm text-gray-500">Recipient</div>
              <div className="font-medium">{recipientName}</div>
            </div>
            {accountNumber && (
              <div>
                <div className="text-sm text-gray-500">Account Number</div>
                <div>{accountNumber}</div>
              </div>
            )}
          </div>
        </div>

        <Button variant="primary" fullWidth onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
};

TransferSuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  amount: PropTypes.string,
  recipientName: PropTypes.string,
  accountNumber: PropTypes.string,
};

export default TransferSuccessModal;
