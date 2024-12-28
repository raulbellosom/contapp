import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/';
const API_URL = `${BASE_API_URL}/api` || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const headerFormData = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

// Account API
export const getAccounts = async () => {
  try {
    const { data } = await api.get('/accounts');
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAccountById = async (id) => {
  try {
    const { data } = await api.get(`/accounts/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createAccount = async (account) => {
  try {
    const { data } = await api.post('/accounts', account);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateAccount = async (account) => {
  try {
    const { data } = await api.put(`/accounts/${account.id}`, account);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteAccount = async (id) => {
  try {
    const { data } = await api.delete(`/accounts/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Transaction API
export const getTransactions = async () => {
  try {
    const { data } = await api.get('/transactions');
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTransactionById = async (id) => {
  try {
    const { data } = await api.get(`/transactions/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createTransaction = async (transaction) => {
  try {
    const { data } = await api.post('/transactions', transaction);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTransaction = async (transaction) => {
  try {
    const { data } = await api.put(`/transactions/${transaction.id}`, transaction);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const { data } = await api.delete(`/transactions/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Category API
export const getCategories = async () => {
  try {
    const { data } = await api.get('/categories');
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createCategory = async (category) => {
  try {
    const { data } = await api.post('/categories', category);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCategory = async (category) => {
  try {
    const { data } = await api.put(`/categories/${category.id}`, category);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Bank API
export const getBanks = async () => {
  try {
    const { data } = await api.get('/banks');
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getBankById = async (id) => {
  try {
    const { data } = await api.get(`/banks/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createBank = async (bank) => {
  try {
    const { data } = await api.post('/banks', bank);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateBank = async (bank) => {
  try {
    const { data } = await api.put(`/banks/${bank.id}`, bank);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteBank = async (id) => {
  try {
    const { data } = await api.delete(`/banks/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Recurring Payment API
export const getRecurringPayments = async () => {
  try {
    const { data } = await api.get('/recurring-payments');
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRecurringPaymentById = async (id) => {
  try {
    const { data } = await api.get(`/recurring-payments/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createRecurringPayment = async (payment) => {
  try {
    const { data } = await api.post('/recurring-payments', payment);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateRecurringPayment = async (payment) => {
  try {
    const { data } = await api.put(`/recurring-payments/${payment.id}`, payment);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteRecurringPayment = async (id) => {
  try {
    const { data } = await api.delete(`/recurring-payments/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
