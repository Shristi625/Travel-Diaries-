import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/api/v1/quotes";

// Helper to get token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllQuotes = () => {
  return axios.get(API_URL);
};

export const createQuote = (quoteData) => {
  return axios.post(API_URL, quoteData, getAuthHeaders());
};

export const deleteQuote = (quoteId) => {
  return axios.delete(`${API_URL}/${quoteId}`, getAuthHeaders());
};
