import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword, // Added
  createUserWithEmailAndPassword, // Added
  updateProfile // Added
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import axios from 'axios';

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null; // backend user
  firebaseUser: FirebaseUser | null;
  token: string | null; // backend JWT
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  // NEW: Added types for email/password
  login: (email: string, password: string) => Promise<void>; 
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchBackendUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Backend base URL
const API_BASE_URL = typeof import.meta !== 'undefined' && import.meta.env 
  ? (import.meta.env as Record<string, string>).VITE_BACKEND_API_URL || '/api'
  : '/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken')); 
  const [loading, setLoading] = useState(true);

  // --- Backend Sync Logic (Unchanged) ---
  const syncWithBackend = async (idToken: string) => {
    try {
      console.log('🔄 Syncing with backend. API_BASE_URL:', API_BASE_URL);
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        idToken,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('📥 Backend response:', response.data);

      const { user: backendUser, token: backendToken } = response.data;

      if (!backendUser || !backendToken) {
        throw new Error('Invalid response from backend: missing user or token');
      }

      console.log('✅ Backend sync successful. User:', backendUser);
      setUser(backendUser);
      setToken(backendToken);
      localStorage.setItem('authToken', backendToken);
    } catch (error) {
      console.error('❌ Failed to sync auth with backend:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Backend error message:', error.message);
      }
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      throw error;
    }
  };

  const fetchBackendUser = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch backend user:', error);
      setUser(null);
    }
  };

  // --- Auth State Listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userCredential) => {
      setFirebaseUser(userCredential);

      if (userCredential) {
        try {
          const idToken = await userCredential.getIdToken();
          await syncWithBackend(idToken);
        } catch (error) {
          console.error('❌ Failed to sync with backend after Firebase auth:', error);
          setUser(null);
          setToken(null);
          localStorage.removeItem('authToken');
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Auth Actions ---

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!result.user) throw new Error('No user returned from Google sign-in');
    } catch (error: any) {
      console.error('❌ Google login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // NEW: Email Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔵 Starting Email Login...');
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase Email Login successful');
      // onAuthStateChanged will handle the backend sync automatically
    } catch (error: any) {
      console.error('❌ Email Login failed:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // NEW: Email Registration
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      console.log('🔵 Starting Registration...');
      
      // 1. Create User in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update the "Display Name" in Firebase immediately
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
        
        // 3. Force token refresh to ensure backend sees the new name (optional but recommended)
        await userCredential.user.getIdToken(true);
      }

      console.log('✅ Registration successful for:', email);
      // onAuthStateChanged will trigger and sync with backend
    } catch (error: any) {
      console.error('❌ Registration failed:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        firebaseUser, 
        token, 
        loading, 
        loginWithGoogle, 
        login,     // Exported
        register,  // Exported
        logout, 
        fetchBackendUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}