import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Trash2, Settings, Plus } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

interface User {
  _id: string;
  email: string;
  name: string;
}

interface UserSuggestion {
  userId: string;
  products: Product[];
  type: 'manual' | 'auto';
  createdAt: string;
}

const THEME = {
  espresso: '#3E2723',
  bronze: '#966328',
  gold: '#D99A46',
  cream: '#FFFCF2',
  white: '#FFFFFF'
};

const SuggestionManagement: React.FC = () => {
  const { token } = useAuth();
  const [tab, setTab] = useState<'default' | 'users' | 'settings'>('default');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [defaultSuggestions, setDefaultSuggestions] = useState<Product[]>([]);
  const [selectedDefaultProducts, setSelectedDefaultProducts] = useState<string[]>([]);
  const [userSuggestions, setUserSuggestions] = useState<UserSuggestion[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>(''); // Current selected user
  const [selectedUserProducts, setSelectedUserProducts] = useState<string[]>([]); // Products for selected user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [autoEnabled, setAutoEnabled] = useState(true);
  const [autoType, setAutoType] = useState<'orderHistory' | 'searchHistory' | 'related' | 'hybrid'>('hybrid');
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, usersRes, defaultRes, userSuggsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/products`),
        axios.get(`${API_BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/suggestions/admin/defaults`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/suggestions/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setAllProducts(productsRes.data || []);
      setAllUsers(usersRes.data || []);
      setDefaultSuggestions(defaultRes.data.suggestions || []);
      setAutoEnabled(defaultRes.data.settings.enableAutoSuggestions);
      setAutoType(defaultRes.data.settings.autoSuggestionType);
      setSelectedDefaultProducts((defaultRes.data.suggestions || []).map((p: Product) => p._id));
      setUserSuggestions(userSuggsRes.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDefaultProduct = (productId: string) => {
    setSelectedDefaultProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else if (prev.length < 3) {
        return [...prev, productId];
      }
      return prev;
    });
  };

  const handleSaveDefaults = async () => {
    if (selectedDefaultProducts.length !== 3) {
      setError('Exactly 3 products must be selected');
      return;
    }

    try {
      await axios.patch(
        `${API_BASE_URL}/suggestions/admin/defaults`,
        { productIds: selectedDefaultProducts },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Default suggestions updated!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving:', err);
      setError('Failed to save suggestions');
    }
  };

  // Handle user selection in dropdown
  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
    // Find existing suggestions for this user
    const existingUserSugg = userSuggestions.find(us => us.userId === userId);
    if (existingUserSugg) {
      setSelectedUserProducts(existingUserSugg.products.map(p => p._id));
    } else {
      setSelectedUserProducts([]);
    }
  };

  // Toggle product selection for user
  const handleToggleUserProduct = (productId: string) => {
    setSelectedUserProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else if (prev.length < 3) {
        return [...prev, productId];
      }
      return prev;
    });
  };

  // Save user-specific suggestions
  const handleSaveUserSuggestions = async () => {
    if (!selectedUser) {
      setError('Please select a user');
      return;
    }

    if (selectedUserProducts.length !== 3) {
      setError('Exactly 3 products must be selected for the user');
      return;
    }

    try {
      await axios.patch(
        `${API_BASE_URL}/suggestions/admin/users/${selectedUser}`,
        { productIds: selectedUserProducts },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Suggestions saved for user!`);
      fetchData();
      setSelectedUser('');
      setSelectedUserProducts([]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving user suggestions:', err);
      setError('Failed to save user suggestions');
    }
  };

  // Remove user-specific suggestions
  const handleRemoveUserSuggestions = async (userId: string) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/suggestions/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('User suggestions removed!');
      fetchData();
      setSelectedUser('');
      setSelectedUserProducts([]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error removing:', err);
      setError('Failed to remove user suggestions');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await axios.patch(
        `${API_BASE_URL}/suggestions/admin/settings`,
        { enableAutoSuggestions: autoEnabled, autoSuggestionType: autoType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Settings updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    }
  };

  if (loading) {
    return <div className="p-8 text-center" style={{ color: THEME.espresso }}>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3E2723] mb-2">Suggestion Management</h1>
        <p className="text-gray-600">Manage product suggestions shown to users</p>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-8 border-b" style={{ borderColor: `${THEME.gold}40` }}>
        {(['default', 'users', 'settings'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-6 py-3 font-semibold uppercase text-sm tracking-widest transition-all border-b-2"
            style={{
              borderColor: tab === t ? THEME.gold : 'transparent',
              color: tab === t ? THEME.gold : THEME.bronze,
            }}
          >
            {t === 'default' && 'Default'}
            {t === 'users' && 'User-Specific'}
            {t === 'settings' && 'Settings'}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
          {success}
        </div>
      )}

      {/* DEFAULT SUGGESTIONS TAB */}
      {tab === 'default' && (
        <div>
          <h2 className="text-xl font-bold mb-6" style={{ color: THEME.espresso }}>
            Default Suggestions (All Users)
          </h2>
          <p className="mb-6 text-sm" style={{ color: THEME.bronze }}>
            Select exactly 3 products to show to all users by default or when they have no order/search history
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {allProducts.map((product) => (
              <div
                key={product._id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedDefaultProducts.includes(product._id)
                    ? 'ring-2'
                    : ''
                }`}
                style={{
                  borderColor: selectedDefaultProducts.includes(product._id) ? THEME.gold : `${THEME.gold}40`,
                  backgroundColor: selectedDefaultProducts.includes(product._id) ? `${THEME.gold}10` : THEME.white,
                  ringColor: THEME.gold,
                }}
                onClick={() => handleToggleDefaultProduct(product._id)}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h3 className="font-bold truncate" style={{ color: THEME.espresso }}>
                  {product.name}
                </h3>
                <p className="text-sm" style={{ color: THEME.bronze }}>
                  ₹{product.price}
                </p>
                <p className="text-xs uppercase tracking-widest mt-2" style={{ color: THEME.gold }}>
                  {product.category}
                </p>
                {selectedDefaultProducts.includes(product._id) && (
                  <div className="mt-2 text-xs font-bold text-green-600">✓ Selected</div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveDefaults}
            disabled={selectedDefaultProducts.length !== 3}
            className="w-full py-3 font-bold uppercase tracking-widest rounded text-white transition-all"
            style={{
              backgroundColor: selectedDefaultProducts.length === 3 ? THEME.espresso : THEME.bronze,
              opacity: selectedDefaultProducts.length === 3 ? 1 : 0.5,
            }}
            onMouseEnter={(e) => {
              if (selectedDefaultProducts.length === 3) {
                e.currentTarget.style.backgroundColor = THEME.bronze;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedDefaultProducts.length === 3) {
                e.currentTarget.style.backgroundColor = THEME.espresso;
              }
            }}
          >
            Save Default Suggestions ({selectedDefaultProducts.length}/3)
          </button>
        </div>
      )}

      {/* USER-SPECIFIC SUGGESTIONS TAB */}
      {tab === 'users' && (
        <div>
          <h2 className="text-xl font-bold mb-6" style={{ color: THEME.espresso }}>
            User-Specific Suggestions
          </h2>
          <p className="mb-6 text-sm" style={{ color: THEME.bronze }}>
            Assign custom suggestions to specific users (overrides auto-suggestions)
          </p>

          {/* User Dropdown */}
          <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: THEME.white, border: `2px solid ${THEME.gold}40` }}>
            <label className="block font-bold mb-3" style={{ color: THEME.espresso }}>
              Select User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => handleUserSelect(e.target.value)}
              className="w-full p-3 border rounded-lg"
              style={{ borderColor: THEME.gold, color: THEME.espresso }}
            >
              <option value="">-- Choose a user --</option>
              {allUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name || user.email} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Product Selection for Selected User */}
          {selectedUser && (
            <>
              <h3 className="text-lg font-bold mb-4" style={{ color: THEME.espresso }}>
                Choose 3 Products for Selected User
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {allProducts.map((product) => (
                  <div
                    key={product._id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedUserProducts.includes(product._id)
                        ? 'ring-2'
                        : ''
                    }`}
                    style={{
                      borderColor: selectedUserProducts.includes(product._id) ? THEME.gold : `${THEME.gold}40`,
                      backgroundColor: selectedUserProducts.includes(product._id) ? `${THEME.gold}10` : THEME.white,
                      ringColor: THEME.gold,
                    }}
                    onClick={() => handleToggleUserProduct(product._id)}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <h3 className="font-bold truncate" style={{ color: THEME.espresso }}>
                      {product.name}
                    </h3>
                    <p className="text-sm" style={{ color: THEME.bronze }}>
                      ₹{product.price}
                    </p>
                    {selectedUserProducts.includes(product._id) && (
                      <div className="mt-2 text-xs font-bold text-green-600">✓ Selected</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveUserSuggestions}
                  disabled={selectedUserProducts.length !== 3}
                  className="flex-1 py-3 font-bold uppercase tracking-widest rounded text-white transition-all"
                  style={{
                    backgroundColor: selectedUserProducts.length === 3 ? THEME.espresso : THEME.bronze,
                    opacity: selectedUserProducts.length === 3 ? 1 : 0.5,
                  }}
                  onMouseEnter={(e) => {
                    if (selectedUserProducts.length === 3) {
                      e.currentTarget.style.backgroundColor = THEME.bronze;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedUserProducts.length === 3) {
                      e.currentTarget.style.backgroundColor = THEME.espresso;
                    }
                  }}
                >
                  Save User Suggestions ({selectedUserProducts.length}/3)
                </button>
                <button
                  onClick={() => handleRemoveUserSuggestions(selectedUser)}
                  className="px-6 py-3 font-bold uppercase tracking-widest rounded text-white transition-all"
                  style={{ backgroundColor: '#dc2626' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
                >
                  Remove Override
                </button>
              </div>
            </>
          )}

          {/* Existing User Suggestions */}
          {userSuggestions.length > 0 && (
            <>
              <h3 className="text-lg font-bold mt-12 mb-4" style={{ color: THEME.espresso }}>
                Currently Assigned Users
              </h3>
              <div className="space-y-4">
                {userSuggestions.map((userSugg) => (
                  <div
                    key={userSugg.userId}
                    className="p-6 rounded-lg border-2"
                    style={{ borderColor: `${THEME.gold}40`, backgroundColor: THEME.white }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold" style={{ color: THEME.espresso }}>
                          {allUsers.find(u => u._id === userSugg.userId)?.email || userSugg.userId}
                        </h3>
                        <p className="text-xs" style={{ color: THEME.bronze }}>
                          Type: {userSugg.type} | Last Updated: {new Date(userSugg.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveUserSuggestions(userSugg.userId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {userSugg.products.map((product) => (
                        <div key={product._id} className="text-center">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-20 object-cover rounded mb-1"
                          />
                          <p className="text-xs font-semibold truncate" style={{ color: THEME.espresso }}>
                            {product.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* SETTINGS TAB */}
      {tab === 'settings' && (
        <div>
          <h2 className="text-xl font-bold mb-6" style={{ color: THEME.espresso }}>
            AI Suggestion Settings
          </h2>

          <div className="space-y-6 max-w-2xl">
            {/* ENABLE AUTO SUGGESTIONS */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: THEME.white, border: `2px solid ${THEME.gold}40` }}>
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold" style={{ color: THEME.espresso }}>
                  Enable Auto Suggestions
                </label>
                <button
                  onClick={() => setAutoEnabled(!autoEnabled)}
                  className="relative w-14 h-8 rounded-full transition-colors"
                  style={{
                    backgroundColor: autoEnabled ? THEME.gold : THEME.bronze,
                  }}
                >
                  <div
                    className="absolute top-1 left-1 w-6 h-6 rounded-full transition-transform"
                    style={{
                      backgroundColor: THEME.white,
                      transform: autoEnabled ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>
              <p className="text-sm" style={{ color: THEME.bronze }}>
                When enabled, users see smart suggestions based on their behavior (order history, searches, etc.)
              </p>
            </div>

            {/* AUTO SUGGESTION TYPE */}
            {autoEnabled && (
              <div className="p-6 rounded-lg" style={{ backgroundColor: THEME.white, border: `2px solid ${THEME.gold}40` }}>
                <label className="block font-bold mb-4" style={{ color: THEME.espresso }}>
                  Suggestion Algorithm
                </label>
                <div className="space-y-3">
                  {(['orderHistory', 'related', 'hybrid'] as const).map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="autoType"
                        value={type}
                        checked={autoType === type}
                        onChange={(e) => setAutoType(e.target.value as typeof type)}
                        className="w-4 h-4"
                      />
                      <span style={{ color: THEME.espresso }}>
                        {type === 'orderHistory' && 'Order History - Based on past purchases'}
                        {type === 'related' && 'Related Products - Complementary items'}
                        {type === 'hybrid' && 'Hybrid (Recommended) - Combine all approaches'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleSaveSettings}
              className="w-full py-3 font-bold uppercase tracking-widest rounded text-white transition-all"
              style={{ backgroundColor: THEME.espresso }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = THEME.bronze)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = THEME.espresso)}
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestionManagement;
