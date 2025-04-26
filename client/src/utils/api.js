import { APP_CONFIG } from "../constants/config";

/**
 * Base API handler for making HTTP requests
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} Response data or error
 */
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${APP_CONFIG.API_BASE_URL}${endpoint}`;

    // Default headers
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  login: (credentials) =>
    apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  logout: () => apiRequest("/auth/logout", { method: "POST" }),

  getProfile: () => apiRequest("/api/profile"),
};

// Transaction API calls
export const transactionAPI = {
  getBalance: () => apiRequest("/api/balance"),

  getHistory: (params = {}) => {
    // Convert params to URL search params
    const searchParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (
        params[key] !== null &&
        params[key] !== undefined &&
        params[key] !== ""
      ) {
        searchParams.append(key, params[key]);
      }
    });

    return apiRequest(`/api/history?${searchParams.toString()}`);
  },

  getTransactionById: (id) => apiRequest(`/transactions/${id}`),

  transfer: (transferData) =>
    apiRequest("/api/transfer", {
      method: "POST",
      body: JSON.stringify(transferData),
    }),

  topUp: (topUpData) =>
    apiRequest("/api/topup", {
      method: "POST",
      body: JSON.stringify(topUpData),
    }),

  getSummary: () => apiRequest("/api/summary"),
};

export const mockAPI = {
  // Mock user data
  user: {
    id: "usr_123456",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },

  // Mock transaction data
  balance: 2540.75,

  transactions: [
    {
      id: "tx_1001",
      type: "TRANSFER_IN",
      amount: 750.0,
      date: new Date("2023-11-20T14:30:00"),
      description: "Payment from Sarah",
      account: "Sarah Smith",
      accountId: "acc_sarah01",
    },
    {
      id: "tx_1002",
      type: "TRANSFER_OUT",
      amount: 125.5,
      date: new Date("2023-11-18T09:15:00"),
      description: "Grocery shopping",
      account: "Michael Johnson",
      accountId: "acc_michael02",
    },
    {
      id: "tx_1003",
      type: "TOP_UP",
      amount: 1000.0,
      date: new Date("2023-11-15T11:45:00"),
      description: "Monthly salary",
      account: "Bank Transfer",
      accountId: null,
    },
    {
      id: "tx_1004",
      type: "PAYMENT",
      amount: 49.99,
      date: new Date("2023-11-12T16:20:00"),
      description: "Netflix subscription",
      account: "Netflix Inc.",
      accountId: "acc_netflix",
    },
    {
      id: "tx_1005",
      type: "TRANSFER_OUT",
      amount: 200.0,
      date: new Date("2023-11-10T13:50:00"),
      description: "Rent payment",
      account: "Landlord",
      accountId: "acc_landlord",
    },
    {
      id: "tx_1006",
      type: "REFUND",
      amount: 35.25,
      date: new Date("2023-11-05T10:30:00"),
      description: "Return of faulty item",
      account: "Amazon",
      accountId: "acc_amazon",
    },
    {
      id: "tx_1007",
      type: "TRANSFER_IN",
      amount: 150.0,
      date: new Date("2023-11-03T15:45:00"),
      description: "Reimbursement",
      account: "Work Expense",
      accountId: "acc_work",
    },
    {
      id: "tx_1008",
      type: "PAYMENT",
      amount: 65.3,
      date: new Date("2023-10-30T18:10:00"),
      description: "Dinner",
      account: "Restaurant",
      accountId: "acc_restaurant",
    },
    {
      id: "tx_1009",
      type: "TRANSFER_OUT",
      amount: 300.0,
      date: new Date("2023-10-25T09:40:00"),
      description: "Car repair",
      account: "Auto Shop",
      accountId: "acc_autoshop",
    },
    {
      id: "tx_1010",
      type: "TOP_UP",
      amount: 500.0,
      date: new Date("2023-10-20T14:20:00"),
      description: "Bonus payment",
      account: "Bank Transfer",
      accountId: null,
    },
  ],

  // Monthly summary for dashboard
  summary: {
    monthlyTopUps: 1500.0,
    monthlyTransfersOut: 625.5,
    monthlyExpenses: 115.29,
    totalBalance: 2540.75,
    previousMonthBalance: 1781.54,
    balanceChange: 759.21,
    weeklyData: [2100, 2200, 2350, 2275, 2400, 2510, 2540.75],
    monthlyData: [
      1500,
      1625,
      1700,
      1800,
      1900,
      2000,
      2150,
      2300,
      2450,
      2540.75,
      null,
      null,
    ],
  },
};
