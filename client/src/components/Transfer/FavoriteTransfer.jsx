// import { useState } from 'react';
// import PropTypes from 'prop-types';
// import { useForm } from 'react-hook-form';
// import Card from '../UI/Card';
// import Input from '../UI/Input';
// import Button from '../UI/Button';
// import Modal from '../UI/Modal';
// import Alert from '../UI/Alert';
// import { isValidAmount, isAmountInRange } from '../../utils/validators';
// import { formatCurrency } from '../../utils/formatters';

// const FavoriteTransfer = ({
//   onSubmit,
//   isLoading = false,
//   maxTransferAmount = 10000,
//   minTransferAmount = 1,
//   className = ''
// }) => {
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [selectedFavorite, setSelectedFavorite] = useState(null);
//   const [formData, setFormData] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState('');

//   // Sample favorites data - replace with actual data from your context/API
//   const favorites = [
//     {
//       id: '1',
//       name: 'Sarah Johnson',
//       accountNumber: '1234567890',
//       bankName: 'Chase Bank',
//       nickname: 'Sarah'
//     },
//     {
//       id: '2',
//       name: 'Michael Smith',
//       accountNumber: '0987654321',
//       bankName: 'Bank of America',
//       nickname: 'Mike'
//     }
//   ];

//   // Form validation
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch
//   } = useForm({
//     defaultValues: {
//       amount: '',
//       description: ''
//     }
//   });

//   // Watch amount for confirmation display
//   const amountValue = watch('amount');

//   // Handle favorite selection
//   const handleSelectFavorite = (favorite) => {
//     setSelectedFavorite(favorite);
//   };

//   // Handle form submission
//   const handleFormSubmit = (data) => {
//     if (!selectedFavorite) {
//       setError('Please select a recipient');
//       return;
//     }

//     setFormData({
//       ...data,
//       recipient: selectedFavorite.name,
//       accountNumber: selectedFavorite.accountNumber
//     });
//     setShowConfirmation(true);
//   };

//   // Handle transfer confirmation
//   const handleConfirmTransfer = async () => {
//     try {
//       setShowConfirmation(false);
//       const result = await onSubmit(formData);

//       if (result.success) {
//         setSuccess(true);
//         reset();
//         setSelectedFavorite(null);
//       } else {
//         setError(result.error || 'Transfer failed. Please try again.');
//       }
//     } catch (err) {
//       setError(err.message || 'An unexpected error occurred.');
//     }
//   };

//   return (
//     <Card className={`animate-fade-in ${className}`}>
//       <Card.Header title="Transfer to Favorites" />
//       <Card.Body>
//         {success && (
//           <Alert
//             type="success"
//             title="Transfer Successful"
//             message="Your money has been sent successfully."
//             onClose={() => setSuccess(false)}
//             autoClose={true}
//             className="mb-4"
//           />
//         )}

//         {error && (
//           <Alert
//             type="error"
//             title="Transfer Failed"
//             message={error}
//             onClose={() => setError('')}
//             className="mb-4"
//           />
//         )}

//         {/* Favorites List */}
//         <div className="mb-6">
//           <label className="form-label">Select Recipient</label>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {favorites.map(favorite => (
//               <button
//                 key={favorite.id}
//                 onClick={() => handleSelectFavorite(favorite)}
//                 className={`
//                   p-3 rounded-lg text-left transition-all
//                   ${selectedFavorite?.id === favorite.id
//                     ? 'bg-primary-50 border-2 border-primary-500'
//                     : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
//                   }
//                 `}
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
//                     {favorite.name.charAt(0)}
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-800">
//                       {favorite.name}
//                       {favorite.nickname && (
//                         <span className="text-sm text-gray-500 ml-1">
//                           ({favorite.nickname})
//                         </span>
//                       )}
//                     </h4>
//                     <p className="text-sm text-gray-500">
//                       {favorite.bankName} • {favorite.accountNumber}
//                     </p>
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Transfer Form */}
//         <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
//           <Input
//             label="Amount"
//             type="number"
//             step="0.01"
//             min={minTransferAmount}
//             max={maxTransferAmount}
//             {...register('amount', {
//               required: 'Amount is required',
//               validate: {
//                 validAmount: (value) => isValidAmount(value) || 'Please enter a valid amount',
//                 minAmount: (value) => isAmountInRange(value, minTransferAmount, maxTransferAmount) ||
//                   `Amount must be between ${formatCurrency(minTransferAmount)} and ${formatCurrency(maxTransferAmount)}`
//               }
//             })}
//             error={errors.amount?.message}
//             placeholder="0.00"
//             disabled={isLoading}
//             required
//           />

//           <div className="form-control">
//             <label htmlFor="description" className="form-label">Description</label>
//             <textarea
//               id="description"
//               rows="3"
//               className="form-input"
//               placeholder="What's this transfer for?"
//               {...register('description')}
//               disabled={isLoading}
//             ></textarea>
//           </div>

//           <Button
//             type="submit"
//             variant="primary"
//             fullWidth
//             isLoading={isLoading}
//             disabled={!selectedFavorite}
//           >
//             Continue
//           </Button>
//         </form>
//       </Card.Body>

//       {/* Confirmation Modal */}
//       <Modal
//         isOpen={showConfirmation}
//         onClose={() => setShowConfirmation(false)}
//         title="Confirm Transfer"
//         footer={
//           <div className="flex justify-end space-x-3">
//             <Button
//               variant="outline"
//               onClick={() => setShowConfirmation(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="primary"
//               onClick={handleConfirmTransfer}
//               isLoading={isLoading}
//             >
//               Confirm Transfer
//             </Button>
//           </div>
//         }
//       >
//         <div className="space-y-4">
//           <p className="text-gray-600">
//             You are about to transfer:
//           </p>

//           <div className="bg-gray-50 p-4 rounded-lg">
//             <div className="flex justify-between mb-2">
//               <span className="text-gray-500">Amount:</span>
//               <span className="font-bold text-gray-800">{formatCurrency(amountValue)}</span>
//             </div>

//             <div className="flex justify-between mb-2">
//               <span className="text-gray-500">To:</span>
//               <span className="font-medium text-gray-800">{selectedFavorite?.name}</span>
//             </div>

//             <div className="flex justify-between mb-2">
//               <span className="text-gray-500">Account:</span>
//               <span className="font-medium text-gray-800">{selectedFavorite?.accountNumber}</span>
//             </div>

//             {formData?.description && (
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Description:</span>
//                 <span className="text-gray-800">{formData.description}</span>
//               </div>
//             )}
//           </div>

//           <p className="text-sm text-gray-500 italic">
//             Please verify the information above before confirming.
//           </p>
//         </div>
//       </Modal>
//     </Card>
//   );
// };

// FavoriteTransfer.propTypes = {
//   onSubmit: PropTypes.func.isRequired,
//   isLoading: PropTypes.bool,
//   maxTransferAmount: PropTypes.number,
//   minTransferAmount: PropTypes.number,
//   className: PropTypes.string
// };

// export default FavoriteTransfer;

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "../UI/Card";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import Alert from "../UI/Alert";
import { apiRequest } from "../../utils/api";
import { formatCurrency } from "../../utils/formatters";
import FavoriteManager from "./FavoriteManager";

const FavoriteTransfer = ({ onSubmit, isLoading = false }) => {
  const [favorites, setFavorites] = useState([]);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await apiRequest("/api/getfavorites");
      setFavorites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransfer = async () => {
    if (!selectedFavorite || !amount) return;

    const result = await onSubmit({
      toWalletNumber: selectedFavorite.walletNumber,
      amount: parseFloat(amount),
      notes: description,
    });

    if (result.success) {
      setSuccess(true);
      setAmount("");
      setDescription("");
      setSelectedFavorite(null);
    } else {
      setError(result.error || "Transfer failed.");
    }
  };

  const handleAddFavorite = async () => {
    try {
      await apiRequest("/api/favorite", {
        method: "POST",
        body: JSON.stringify({ walletNumber: newAccountNumber }),
      });
      setShowAddModal(false);
      setNewAccountNumber("");
      setNewAccountName("");
      fetchFavorites();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteFavorite = async (walletNumber) => {
    try {
      await apiRequest(`/api/favorite/delete?walletNumber=${walletNumber}`, {
        method: "DELETE",
      });
      fetchFavorites();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card>
      <Card.Header title="Transfer via Favorite" />
      <Card.Body className="space-y-4">
        {success && (
          <Alert
            type="success"
            title="Success"
            message="Transfer complete."
            onClose={() => setSuccess(false)}
          />
        )}
        {error && (
          <Alert
            type="error"
            title="Error"
            message={error}
            onClose={() => setError("")}
          />
        )}

        <div>
          <label className="form-label">Select Favorite Recipient</label>
          <Button
            onClick={() => setShowFavoritesPopup(true)}
            variant="primary"
          >
            Show Favorite
          </Button>

          <FavoriteManager
            isOpen={showFavoritesPopup}
            onClose={() => setShowFavoritesPopup(false)}
            onSelect={(fav) => {
              setSelectedFavorite(fav);
              setShowFavoritesPopup(false);
            }}
          />

          {selectedFavorite && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="text-sm text-gray-700 font-medium">
                {selectedFavorite.ownerName}
              </div>
              <div className="text-xs text-gray-500">
                {selectedFavorite.walletNumber}
              </div>
            </div>
          )}
        </div>

        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />

        <div className="form-control">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            rows="3"
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional notes"
          ></textarea>
        </div>

        <Button
          fullWidth
          variant="primary"
          isLoading={isLoading}
          onClick={handleTransfer}
        >
          Send Money
        </Button>
      </Card.Body>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Favorite Recipient"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddFavorite}>
              Confirm
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Wallet Number"
            type="text"
            value={newAccountNumber}
            onChange={(e) => setNewAccountNumber(e.target.value)}
            placeholder="Enter wallet number"
          />
          {/* You could use live preview or API fetch here */}
          <p className="text-sm text-gray-600 italic">
            Recipient name will be fetched automatically after input.
          </p>
        </div>
      </Modal>
    </Card>
  );
};

FavoriteTransfer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default FavoriteTransfer;
