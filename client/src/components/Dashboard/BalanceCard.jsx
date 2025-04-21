import { useState } from "react";
import PropTypes from "prop-types";
import Card from "../UI/Card";
import useBalance from "../../hooks/useBalance";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const BalanceCard = ({ className = "" }) => {
  const [hideBalance, setHideBalance] = useState(false);
  const { formattedBalance, balance, balanceChangePercent, isLoading } =
    useBalance();

  // Toggle balance visibility
  const toggleBalance = () => {
    setHideBalance(!hideBalance);
  };

  return (
    <Card className={`animate-fade-in ${className}` }>
      <Card.Body className="flex flex-col space-y-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="flex items-center justify-between ">
          <h2 className="text-lg font-semibold text-white">
            Current Balance
          </h2>
          <button
            onClick={toggleBalance}
            className="text-white hover:text-gray-400 focus:outline-none"
            aria-label={hideBalance ? "Show balance" : "Hide balance"}
          >
            {hideBalance ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="h-8 w-48 animate-pulse bg-gray-200 rounded-md"></div>
        ) : (
          <div className="flex items-center space-x-2">
            <h3 className="text-3xl font-bold text-white">
              {hideBalance ? "••••••" : formattedBalance}
            </h3>
          </div>
        )}

        {!isLoading && (
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm ${
                Number(balanceChangePercent) >= 0
                  ? "text-accent-300"
                  : "text-error-300"
              }`}
            >
              {balanceChangePercent}%
              {Number(balanceChangePercent) >= 0 ? " increase" : " decrease"}
            </span>
            <span className="text-sm text-white">this month</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 ">
          <Link to={ROUTES.TRANSFER} className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 ">
            Transfer
          </Link>
          <Link to={ROUTES.TOP_UP} className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 ">
            Top Up
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

BalanceCard.propTypes = {
  className: PropTypes.string,
};

export default BalanceCard;
