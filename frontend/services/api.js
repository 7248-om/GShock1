// frontend/services/api.js
const BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:10000';

export const sendChatMessage = async (message, token = null, history = []) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: headers,
    // Sending message AND history
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch response');
  }

  return response.json();
};