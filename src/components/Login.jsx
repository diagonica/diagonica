import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowLeft, ShieldAlert, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://api.diagonica.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        localStorage.setItem('diagonica_token', data.token);
        
        setTimeout(() => {
          setLoading(false); // Hide popup right before navigation transition
          navigate('/dashboard');
        }, 2000); // Extended slightly to let the smooth verification display loop complete
      } else {
        setLoading(false); // Dismiss verification popup modal on rejection
        setError(data.error || 'Access denied: Invalid validation metrics.');
      }
    } catch (err) {
      setLoading(false);
      setError('Authentication server engine is currently unreachable.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800 antialiased flex flex-col justify-center items-center p-4 relative">
      
      {/* Back Link */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-bold text-[#002B49] hover:underline"
      >
        <ArrowLeft size={14} /> Portal Homepage
      </button>

      {/* Card Wrapper */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#002B49] rounded-xl flex items-center justify-center mx-auto mb-3 text-white">
            <Lock size={20} />
          </div>
          <h2 className="text-2xl font-black text-[#002B49] tracking-tight">Enterprise Login</h2>
          <p className="text-xs text-gray-400 mt-1">DIAGONICA LLP Operational Administrative Hub</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs flex items-center gap-2 mb-4">
            <ShieldAlert className="text-red-500 shrink-0" size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Username or Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User size={14} /> 
              </span>
              <input 
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Enter username or email"
                className="w-full border border-gray-300 rounded-lg p-2.5 pl-9 text-xs focus:outline-none focus:ring-1 focus:ring-[#002B49] focus:border-[#002B49]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Administrative Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={14} />
              </span>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full border border-gray-300 rounded-lg p-2.5 pl-9 text-xs focus:outline-none focus:ring-1 focus:ring-[#002B49] focus:border-[#002B49]"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full text-white font-bold p-3 rounded-lg text-xs transition bg-[#002B49] hover:bg-opacity-90 shadow-sm cursor-pointer"
          >
            Authorize Login
          </button>
        </form>
      </div>

      {/* ANIMATED VERIFICATION POPUP OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-[#020C17]/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-xs w-full p-6 text-center flex flex-col items-center gap-4 animate-scaleUp">
            
            <div className="relative flex items-center justify-center">
              {success ? (
                /* Success Animated Graphic State */
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 scale-110 transition-all duration-300">
                  <CheckCircle size={36} className="animate-bounce" />
                </div>
              ) : (
                /* Processing Animated Graphic State */
                <>
                  <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center text-[#00A88F]">
                    <ShieldCheck size={32} className="animate-pulse" />
                  </div>
                  <Loader2 className="absolute -inset-1 text-[#002B49] animate-spin w-18 h-18 stroke-[1.5]" />
                </>
              )}
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-[#002B49] tracking-tight">
                {success ? "Identity Verified" : "Verifying Credentials"}
              </h3>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                {success ? "Opening secure gateway ledger..." : "Securing authentication session handshake..."}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}