import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { COUNTRIES } from './constants';
import { useAuth } from '../../context/AuthContext'; // Import Context

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  // Ensure 'register' is destructured from your AuthContext
  const { register } = useAuth(); 

  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [agreed, setAgreed] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError("You must agree to the Terms & Conditions");
      return;
    }

    setLoading(true);

    try {
      // 1. Call the register function from AuthContext
      await register(formData.email, formData.password, formData.fullName);
      
      // 2. Redirect to Login with Success Message
      navigate('/login', { 
        state: { successMessage: 'Account created successfully! Please log in.' } 
      });
      
    } catch (err: any) {
      // Handle Firebase errors (e.g., email already in use)
      let msg = "Failed to create account";
      if (err.code === 'auth/email-already-in-use') msg = "That email is already registered.";
      else if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
      else if (err.message) msg = err.message;
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <h2 className="text-[40px] font-display text-[#4E342E] font-bold mb-10 tracking-tight">Become a Member</h2>
      
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSignup}>
        {/* Email */}
        <div className="group">
          <div className="relative flex items-center bg-[#FFF5E1] rounded-2xl border border-transparent group-focus-within:border-[#EC9706] group-focus-within:bg-white transition-all duration-200">
            <div className="pl-5 text-[#4E342E]/40">
              <Mail className="w-5 h-5" />
            </div>
            <input 
              name="email"
              type="email" 
              required
              placeholder="Email"
              onChange={handleChange}
              className="w-full py-5 px-4 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 font-medium"
            />
          </div>
        </div>

        {/* Password */}
        <div className="group">
          <div className="relative flex items-center bg-[#FFF5E1] rounded-2xl border border-transparent group-focus-within:border-[#EC9706] group-focus-within:bg-white transition-all duration-200">
            <div className="pl-5 text-[#4E342E]/40">
              <Lock className="w-5 h-5" />
            </div>
            <input 
              name="password"
              type={showPassword ? 'text' : 'password'} 
              required
              placeholder="Password"
              onChange={handleChange}
              className="w-full py-5 px-4 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 font-medium"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pr-5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Name */}
        <div className="group">
          <div className="relative flex items-center bg-[#FFF5E1] rounded-2xl border border-transparent group-focus-within:border-[#EC9706] group-focus-within:bg-white transition-all duration-200">
            <div className="pl-5 text-[#4E342E]/40">
              <User className="w-5 h-5" />
            </div>
            <input 
              name="fullName"
              type="text" 
              required
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full py-5 px-4 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 font-medium"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="group">
          <div className="relative flex items-center bg-[#FFF5E1] rounded-2xl border border-transparent group-focus-within:border-[#EC9706] group-focus-within:bg-white transition-all duration-200">
            <div className="pl-5 flex items-center gap-1.5 min-w-[80px] text-gray-600 font-medium border-r border-orange-100 mr-2">
              <ChevronDown className="w-4 h-4" />
              <span>{selectedCountry.dialCode}</span>
            </div>
            <input 
              name="phone"
              type="tel" 
              placeholder="Mobile Number"
              onChange={handleChange}
              className="w-full py-5 px-4 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 font-medium"
            />
          </div>
        </div>

        {/* T&C */}
        <div className="pt-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-1">
              <input 
                type="checkbox" 
                className="peer hidden" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <div className="w-5 h-5 border-2 border-orange-100 rounded-md bg-white peer-checked:bg-[#EC9706] peer-checked:border-[#EC9706] transition-all" />
              <svg className="absolute inset-0 w-3 h-3 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[13px] leading-snug text-gray-500 font-medium">
              I'm ready to enjoy the perks and I agree with <a href="#" className="text-[#EC9706] hover:underline">Roast Rules</a> and <a href="#" className="text-[#EC9706] hover:underline">Bean Privacy</a>
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-6 flex flex-col items-center">
          <button 
            type="submit"
            disabled={!agreed || loading}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
              agreed && !loading
              ? "bg-[#EC9706] text-white hover:bg-[#B57B24] opacity-100" 
              : "bg-[#FFF5E1] text-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Create Account"}
          </button>
          
          <p className="text-sm text-gray-600 mt-6 font-medium">
            Already a regular? <Link to="/login" className="text-[#EC9706] font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;