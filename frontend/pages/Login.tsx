import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      await loginWithGoogle();
      // onAuthStateChanged in AuthContext will handle backend sync and redirect
    } catch (error) {
      let errorMessage = "Google Sign-In failed";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        // Handle specific Firebase errors
        if (error.message.includes('popup-closed')) {
          errorMessage = "Sign-in popup was closed";
        } else if (error.message.includes('popup-blocked')) {
          errorMessage = "Pop-ups are blocked. Please enable them and try again";
        } else if (error.message.includes('network')) {
          errorMessage = "Network error. Please check your connection";
        }
      }
      
      setError(errorMessage);
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Add your email/password login logic here
      // Example: await loginWithEmail(email, password);
      console.log("Login attempted with:", email);
      // For now, show a message
      setError("Email/password login not yet configured");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-xl">
        
        {/* Title */}
        <h1 className="text-4xl font-extralight tracking-[0.15em] uppercase text-onyx/80 mb-16">
          Login
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailPasswordLogin}>
          {/* Email */}
          <div className="mb-10">
            <label className="block text-xs tracking-widest uppercase mb-3 text-onyx/60">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-onyx/30 py-2 focus:outline-none focus:border-gold transition"
              placeholder="your@email.com"
              disabled={isSubmitting || loading}
            />
          </div>

          {/* Password */}
          <div className="mb-12">
            <label className="block text-xs tracking-widest uppercase mb-3 text-onyx/60">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-onyx/30 py-2 focus:outline-none focus:border-gold transition"
              placeholder="••••••••"
              disabled={isSubmitting || loading}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-onyx/15 mb-10" />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-left space-y-4 text-sm text-onyx/70">
              <button 
                type="button"
                className="block hover:text-onyx transition"
                disabled={isSubmitting || loading}
              >
                Create account
              </button>
              <button 
                type="button"
                className="block hover:text-onyx transition"
                disabled={isSubmitting || loading}
              >
                I forgot my password
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                className="px-12 py-3 border border-onyx uppercase tracking-[0.25em] text-xs hover:bg-onyx hover:text-cream transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="px-12 py-3 border border-onyx uppercase tracking-[0.25em] text-xs hover:bg-onyx hover:text-cream transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || isSubmitting}
              >
                {loading ? "Signing in..." : "Sign in with Google"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
