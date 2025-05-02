import { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import Card from "../UI/Card";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import Alert from "../UI/Alert";
import PinModal from "../UI/PinModal";
import { isValidAccountNumber } from "../../utils/validators";
import { formatCurrency } from "../../utils/formatters";
import { apiRequest } from "../../utils/api";
import TransferSuccessModal from "../UI/TransferSuccessModal";

const TransferForm = ({
  onSubmit,
  isLoading = false,
  maxTransferAmount = 99999999,
  minTransferAmount = 3000,
  className = "",
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [pendingData, setPendingData] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState("");
  const [recipientName, setRecipientName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      recipient: "",
      accountNumber: "",
      amount: "",
      description: "",
    },
  });

  const amountValue = watch("amount");
  const accountNumberValue = watch("accountNumber");
  const descriptionValue = watch("description");

  // ...rest of component unchanged
};

TransferForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  maxTransferAmount: PropTypes.number,
  minTransferAmount: PropTypes.number,
  className: PropTypes.string,
};

export default TransferForm;
