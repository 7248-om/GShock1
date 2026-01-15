import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Destructure login function from context (Ensure 'login' is exposed in your AuthContext)
  // If your context names it 'loginWithEmail', change 'login' to 'loginWithEmail' below.
  const { user, loginWithGoogle, login, loading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Handle Redirect & Success Messages
  useEffect(() => {
    // If user is already logged in, redirect home
    if (user) {
      navigate('/'); 
    }

    // Check for success message from Signup page
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clear state so message doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [user, navigate, location]);

  // 2. Google Handler
  const handleGoogleSignIn = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (error: any) {
      let errorMessage = "Google Sign-In failed";
      if (error instanceof Error) {
        if (error.message.includes('popup-closed')) errorMessage = "Sign-in popup was closed";
        else if (error.message.includes('popup-blocked')) errorMessage = "Pop-ups are blocked.";
        else errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };

  // 3. Email/Password Handler
  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    setSuccessMessage(""); // Clear old success messages on new attempt
    setIsSubmitting(true);

    try {
      if (login) {
        // ACTUAL BACKEND CONNECTION
        await login(email, password);
      } else {
        // Fallback if context isn't ready yet (for testing UI)
        console.warn("Login function not found in AuthContext");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
        // throw new Error("Backend connection missing. Check AuthContext.");
      }
      // Navigation is handled by the useEffect watching 'user'
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = loading || isSubmitting;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center max-w-md w-full mx-auto">
      <h2 className="text-[40px] font-display text-[#4E342E] font-bold mb-8 tracking-tight">Welcome Back</h2>
      
      {/* Success Popup (From Signup) */}
      {successMessage && (
        <div className="w-full mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3 text-green-800 text-sm animate-in zoom-in-95 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="w-full mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form className="space-y-6 w-full" onSubmit={handleEmailPasswordLogin}>
        {/* Email Input */}
        <div className="group">
          <div className="relative flex items-center bg-[#FFF5E1] rounded-2xl border border-transparent group-focus-within:border-[#EC9706] group-focus-within:bg-white transition-all duration-200">
            <div className="pl-5 text-[#4E342E]/40">
              <Mail className="w-5 h-5" />
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              disabled={isBusy}
              className="w-full py-5 px-4 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 font-medium disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="group">
          <div className="relative flex items-center bg-[#FFF5E1] rounded-2xl border border-transparent group-focus-within:border-[#EC9706] group-focus-within:bg-white transition-all duration-200">
            <div className="pl-5 text-[#4E342E]/40">
              <Lock className="w-5 h-5" />
            </div>
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={isBusy}
              className="w-full py-5 px-4 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 font-medium disabled:opacity-50"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pr-5 text-gray-400 hover:text-gray-600 focus:outline-none"
              disabled={isBusy}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="mt-3 text-right">
            {/* FIXED LINK: Added /login prefix */}
            <Link to="/login/forgot-password" className="text-sm text-[#EC9706] font-semibold hover:underline">Forgot your password?</Link>
          </div>
        </div>

        <div className="pt-4 flex flex-col items-center gap-4">
          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isBusy}
            className="w-full bg-[#EC9706] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#B57B24] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? "Logging in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="relative w-full py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isBusy}
            className="w-full bg-[#D1B360] border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold text-lg shadow-sm hover:bg-[#B09851] transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
               <span>Signing in...</span>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </>
            )}
          </button>

          <p className="text-sm text-gray-600 mt-2 font-medium">
            New to the cafe? 
            {/* FIXED LINK: Added /login prefix */}
            <Link to="/login/signup" className="text-[#EC9706] font-bold hover:underline ml-1">Join Us</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;