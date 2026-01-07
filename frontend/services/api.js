// Adjust the BASE_URL to match your backend (e.g., http://localhost:5000)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const sendChatMessage = async (message, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch response');
  }

  return response.json();
};