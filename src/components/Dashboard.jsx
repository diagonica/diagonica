import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, LogOut, Mail, Calendar, ShieldAlert, FileText, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // Track which card is updating runtime state

  const token = localStorage.getItem('diagonica_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProposals = async () => {
      try {
        const response = await fetch('https://api.diagonica.com/api/proposals', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setProposals(data.proposals || []);
        } else {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('diagonica_token');
            navigate('/login');
          }
          setError(data.error || 'Failed to extract database records.');
        }
      } catch (err) {
        setError('Unable to connect to the backend API engine.');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [navigate, token]);

  // LIVE HANDLER FOR IN-PLACE STATUS MODIFICATIONS
  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    setError('');

    try {
      const response = await fetch(`https://api.diagonica.com/api/proposals/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Optimistically update the local state array matrix instantly
        setProposals(prevProposals => 
          prevProposals.map(item => 
            item.id === id ? { ...item, status: data.updatedProposal.status } : item
          )
        );
      } else {
        setError(data.error || 'Failed to update proposal status tracking.');
      }
    } catch (err) {
      setError('Network communication break: Unable to save status to backend ledger.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('diagonica_token');
    navigate('/login');
  };

  // Dynamic style mapping helper for the status drop-downs
  const getStatusStyles = (status) => {
    const cleanStatus = (status || 'evaluating').toLowerCase().trim();
    switch (cleanStatus) {
      case 'approved':
      case 'accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500';
      case 'rejected':
      case 'declined':
        return 'bg-red-50 text-red-700 border-red-200 focus:ring-red-500';
      case 'in-progress':
      case 'reviewing':
        return 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500';
      default:
        return 'bg-orange-50 text-orange-700 border-orange-200 focus:ring-orange-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-mono tracking-wider text-gray-500">
        Authenticating session & pulling active ledger lines...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800 antialiased text-left flex flex-col justify-between">
      <div>
        {/* Top Header Navbar */}
        <nav className="bg-[#002B49] text-white px-6 py-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <Database className="text-[#00A88F]" size={20} />
            <div>
              <h1 className="text-sm font-black tracking-tight">DIAGONICA LLP</h1>
              <p className="text-[10px] text-gray-400 font-mono">Central Submissions Ledger</p>
            </div>
          </div>
          
          {/* BUTTON WRAP MATRIX GROUP */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/griphill', { state: { fromCentralDashboard: true } })}
              className="text-xs bg-[#00A88F] text-white hover:bg-opacity-90 px-3 py-2 rounded-lg transition font-bold shadow-sm cursor-pointer"
            >
              View Griphill Ledger
            </button>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs bg-white/10 hover:bg-red-950/40 px-3 py-2 rounded-lg transition font-semibold cursor-pointer"
            >
              <LogOut size={14} /> Clear Session
            </button>
          </div>
        </nav>

        {/* Workspace Canvas Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs flex items-center gap-2 mb-6 animate-fadeIn">
              <ShieldAlert className="text-red-500 shrink-0" size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-[#002B49]">B2B Procurement Proposals</h2>
            <p className="text-xs text-gray-400 mt-0.5">Total inbound records tracked: {proposals.length}</p>
          </div>

          {proposals.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center text-gray-400 text-xs shadow-sm">
              No business proposals found inside the database ledger.
            </div>
          ) : (
            /* COMPACT LIST VIEW TABLE CONTAINER */
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-200 text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">
                      <th className="py-4 px-6">Partner Info</th>
                      <th className="py-4 px-6">Email Coordinate</th>
                      <th className="py-4 px-6">Procurement Specifications</th>
                      <th className="py-4 px-6">Workflow Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {proposals.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition duration-150 text-xs">
                        
                        {/* 1. Partner Profile Columns */}
                        <td className="py-4 px-6 align-top whitespace-nowrap">
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 leading-tight">
                              {item.representative_name || 'Anonymous Partner'}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-mono tracking-tight mt-0.5">
                              REF ID: #DG-{item.id}
                            </p>
                            {item.submission_timestamp && (
                              <div className="flex items-center gap-1 text-[9px] text-gray-400 font-mono mt-1.5">
                                <Calendar size={10} />
                                <span>{new Date(item.submission_timestamp).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 2. Communication Endpoint Data */}
                        <td className="py-4 px-6 align-top whitespace-nowrap">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail size={13} className="text-gray-400 shrink-0" />
                            <span className="font-mono select-all text-gray-700">{item.email_address}</span>
                          </div>
                        </td>

                        {/* 3. Text Descriptions / Specifications */}
                        <td className="py-4 px-6 align-top max-w-md">
                          <div className="flex gap-2 items-start text-gray-600 bg-gray-50/50 border border-gray-100 p-2.5 rounded-xl">
                            <FileText size={13} className="text-gray-400 shrink-0 mt-0.5" />
                            <p className="whitespace-pre-line text-gray-700 leading-relaxed font-sans line-clamp-3 hover:line-clamp-none">
                              {item.specifications}
                            </p>
                          </div>
                        </td>

                        {/* 4. Action Status Change Dropdowns */}
                        <td className="py-4 px-6 align-top whitespace-nowrap">
                          <div>
                            {updatingId === item.id ? (
                              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono py-1">
                                <RefreshCw size={10} className="animate-spin text-[#00A88F]" /> Saving...
                              </div>
                            ) : (
                              <select
                                value={item.status || 'evaluating'}
                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border cursor-pointer outline-none transition focus:ring-1 capitalize ${getStatusStyles(item.status)}`}
                              >
                                <option value="evaluating">Evaluating</option>
                                <option value="reviewing">Reviewing</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* STICKY FOOTER */}
      <footer className="bg-[#020C17] text-gray-500 text-[11px] py-6 border-t border-white/5 w-full mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p className="font-light">DIAGONICA LLP Operational Admin Panel Console.</p>
          <p className="font-mono text-[10px]">© {new Date().getFullYear()} • Secure Connection Active</p>
        </div>
      </footer>
    </div>
  );
}