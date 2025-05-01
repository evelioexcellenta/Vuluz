import AppLayout from '../../components/Layout/AppLayout';
import TopUpForm from '../../components/TopUp/TopUpForm';
import useTransactions from '../../hooks/useTransactions';
import { useState, useEffect } from 'react';

const TopUp = () => {
  const { createTopUp, isLoading } = useTransactions();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [pin, setPin] = useState(['', '', '', '', '', '']);

  useEffect(() => {
    if (showPinModal || isSuccess) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPinModal, isSuccess]);

  const handleTopUp = async (topUpData) => {
    setAmount(topUpData.amount);
    setPaymentMethod(topUpData.paymentMethod);
    setShowPinModal(true);
    setPin(['', '', '', '', '', '']);
  };

  const handleConfirmPin = async () => {
    const pinCode = pin.join('');
    if (pinCode.length < 6) return;

    try {
      const result = await createTopUp({ amount, paymentMethod, pin: pinCode });
      if (result && result.success) {
        setIsSuccess(true);
        setShowPinModal(false);
        setPin(['', '', '', '', '', '']);
      } else {
        alert("Top-up failed. Please check your details.");
      }
    } catch (error) {
      alert("Top-up error occurred.");
      console.error(error);
    }
  };

  const handleCancelPinModal = () => {
    setShowPinModal(false);
    setPin(['', '', '', '', '', '']);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccess(false);
  };

  const handlePinChange = (value, index) => {
    const updatedPin = [...pin];
    updatedPin[index] = value;
    setPin(updatedPin);

    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto font-poppins">
        <h1 className="text-2xl font-bold text-gray-800">Add Money</h1>

        <TopUpForm onSubmit={handleTopUp} isLoading={isLoading} />

        {/* PIN Modal */}
        {showPinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Enter PIN</h2>
                <button onClick={handleCancelPinModal}>
                  <svg className="w-6 h-6 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex justify-center gap-3 my-6">
                {pin.map((val, i) => (
                  <input
                    key={i}
                    id={`pin-${i}`}
                    type="password"
                    maxLength={1}
                    className="w-12 h-12 border rounded-lg text-center text-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={val}
                    onChange={(e) => handlePinChange(e.target.value, i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !val && i > 0) {
                        const prevInput = document.getElementById(`pin-${i - 1}`);
                        if (prevInput) prevInput.focus();
                      }
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-end gap-4 border-t pt-4">
                <button
                  onClick={handleCancelPinModal}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPin}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {isSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center font-poppins shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800">Top Up Successful!</h2>
              <p className="text-gray-600 mb-6">Your account has been credited.</p>

              <div className="bg-gray-100 p-4 rounded text-left mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Amount:</span>
                  <span className="text-gray-700">Rp {Number(amount).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Payment Method:</span>
                  <span className="text-gray-700">{paymentMethod}</span>
                </div>
              </div>

              <button
                onClick={handleCloseSuccessModal}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default TopUp;
