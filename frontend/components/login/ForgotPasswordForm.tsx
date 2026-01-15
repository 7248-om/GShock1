import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'; // Direct import for simplicity

type Step = 'REQUEST' | 'SUCCESS';

const ForgotPasswordForm: React.FC = () => {
  const [step, setStep] = useState<Step>('REQUEST');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const auth = getAuth();
      // This sends the standard Firebase Password Reset Link
      await sendPasswordResetEmail(auth, email);
      setStep('SUCCESS');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError("No account found with this email.");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'REQUEST':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-[#4E342E] mb-6 font-medium text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
            <h2 className="text-[32px] font-display text-[#4E342E] font-bold mb-4 tracking-tight">Recover Account</h2>
            <p className="text-gray-500 mb-8 font-medium">Enter your email and we'll send a reset link to your inbox.</p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleResetRequest}>
              <div className="group">
                <div className="relative flex items-center bg-[#FFF5E1] rounded-2xl border border-transparent group-focus-within:border-[#EC9706] group-focus-within:bg-white transition-all duration-200">
                  <div className="pl-5 text-[#4E342E]/40">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full py-5 px-4 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 font-medium"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#EC9706] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#B57B24] transition-all transform active:scale-[0.98] flex justify-center items-center"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
              </button>
            </form>
          </div>
        );

      case 'SUCCESS':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center flex flex-col items-center py-8">
            <div className="w-20 h-20 bg-[#FFF5E1] rounded-full flex items-center justify-center mb-8">
              <CheckCircle2 className="w-12 h-12 text-[#EC9706]" />
            </div>
            <h2 className="text-[32px] font-display text-[#4E342E] font-bold mb-4 tracking-tight">Check your Inbox</h2>
            <p className="text-gray-500 mb-10 font-medium">We've sent a password reset link to <br/><span className="text-[#4E342E] font-bold">{email}</span></p>
            
            <Link 
              to="/login"
              className="w-full bg-[#EC9706] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#B57B24] transition-all transform active:scale-[0.98] block text-center"
            >
              Back to Sign In
            </Link>
            
            <button 
              onClick={() => setStep('REQUEST')}
              className="mt-6 text-sm text-gray-400 hover:text-gray-600 font-medium"
            >
              Didn't receive it? Try again
            </button>
          </div>
        );
    }
  };

  return renderStep();
};

export default ForgotPasswordForm;