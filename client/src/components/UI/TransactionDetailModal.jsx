import Modal from "../UI/Modal";
import Button from "../UI/Button";
import { formatCurrency, formatDate } from "../../utils/formatters";
import PropTypes from "prop-types";

const TransactionDetailModal = ({ transaction, isOpen, onClose }) => {
  const handlePrint = () => {
    const printContents = document.getElementById("printableArea").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  if (!transaction) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Details"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            Print
          </Button>
        </div>
      }
    >
      <div id="printableArea" className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">{transaction.description}</h2>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className={transaction.type === "TOP_UP" || transaction.type === "TRANSFER_IN" ? "text-accent-600 font-bold" : "text-error-600 font-bold"}>
              {transaction.type === "TOP_UP" || transaction.type === "TRANSFER_IN" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Account:</span>
            <span className="font-medium text-gray-800">{transaction.account}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span className="text-gray-800">{formatDate(transaction.date)}</span>
          </div>
          <div className="flex justify-between">
            <span>Transaction ID:</span>
            <span className="text-gray-800">{transaction.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-green-600 font-semibold">Completed</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

TransactionDetailModal.propTypes = {
  transaction: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TransactionDetailModal;
