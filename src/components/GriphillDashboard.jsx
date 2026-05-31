import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, ShieldAlert, BarChart2, Phone, MapPin, Calendar, User, Save, RefreshCw } from 'lucide-react';

export default function GriphillDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [griphillData, setGriphillData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [localRemarks, setLocalRemarks] = useState({}); // Stores temporary input values typed by admin

  const token = localStorage.getItem('diagonica_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (!location.state || !location.state.fromCentralDashboard) {
      navigate('/dashboard');
      return;
    }

    const fetchGriphillRecords = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/griphill', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setGriphillData(data.records || []);
          
          // Pre-populate our local remarks input state matrix
          const remarksMap = {};
          data.records.forEach(item => {
            remarksMap[item.id] = item.remarks || '';
          });
          setLocalRemarks(remarksMap);
        } else {
          setError(data.error || 'Failed to extract Griphill data records.');
        }
      } catch (err) {
        setError('Unable to communicate with the backend endpoint engine.');
      } finally {
        setLoading(false);
      }
    };

    fetchGriphillRecords();
  }, [navigate, token, location.state]);

  // HANDLER FOR IN-PLACE UPDATES (STATUS & REMARKS UNIFIED)
  const handleSaveUpdate = async (id, targetStatus) => {
    setUpdatingId(id);
    setError('');
    const remarksText = localRemarks[id] || '';

    try {
      const response = await fetch(`http://localhost:5000/api/griphill/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: targetStatus, remarks: remarksText })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setGriphillData(prev => 
          prev.map(item => 
            item.id === id ? { ...item, status: data.updatedRecord.status, remarks: data.updatedRecord.remarks } : item
          )
        );
      } else {
        setError(data.error || 'Failed to update ledger values.');
      }
    } catch (err) {
      setError('Communication break: Unable to save modifications to backend.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemarksChange = (id, text) => {
    setLocalRemarks(prev => ({ ...prev, [id]: text }));
  };

  const getStatusStyles = (status) => {
    const clean = (status || 'Pending').toLowerCase().trim();
    switch (clean) {
      case 'accepted':
        return 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200 focus:ring-purple-500';
      case 'received':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200 focus:ring-red-500';
      default: // Pending
        return 'bg-orange-50 text-orange-700 border-orange-200 focus:ring-orange-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-mono tracking-wider text-gray-500">
        Authorizing internal secure pipeline & fetching Griphill assets...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800 antialiased text-left flex flex-col justify-between">
      <div>
        {/* Top Navbar */}
        <nav className="bg-[#1E293B] text-white px-6 py-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <BarChart2 className="text-[#00A88F]" size={20} />
            <div>
              <h1 className="text-sm font-black tracking-tight">GRIPHILL MANAGEMENT</h1>
              <p className="text-[10px] text-gray-400 font-mono">Isolated Sub-Dataset</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition font-semibold cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to proposals
          </button>
        </nav>

        {/* Content Canvas */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs flex items-center gap-2 mb-6">
              <ShieldAlert className="text-red-500 shrink-0" size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-[#1E293B]">Grand Draw Registrations</h2>
            <p className="text-xs text-gray-400 mt-0.5">Total live entries caught in database ledger: {griphillData.length}</p>
          </div>

          {griphillData.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center text-gray-400 text-xs shadow-sm">
              No matching records discovered within the Griphill schema profile.
            </div>
          ) : (
            /* LIST VIEW TABLE START */
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-200 text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">
                      <th className="py-4 px-6">Applicant Info</th>
                      <th className="py-4 px-6">Contact Details</th>
                      <th className="py-4 px-6">Delivery Address</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Administrative Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {griphillData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition duration-150 text-xs">
                        
                        {/* 1. Applicant Info column */}
                        <td className="py-4 px-6 align-top max-w-[200px]">
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[#00A88F] shrink-0 mt-0.5">
                              <User size={14} />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-gray-900 leading-tight">
                                {item.representative_name || 'Anonymous Applicant'}
                              </h4>
                              <p className="text-[9px] text-gray-400 font-mono tracking-wider mt-0.5">
                                REF: #GH-{item.id}
                              </p>
                              {item.submission_timestamp && (
                                <div className="flex items-center gap-1 text-[9px] text-gray-400 font-mono mt-1">
                                  <Calendar size={10} />
                                  <span>{new Date(item.submission_timestamp).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. Contact Details column */}
                        <td className="py-4 px-6 align-top whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail size={13} className="text-gray-400 shrink-0" />
                              <span className="font-mono select-all text-gray-700">{item.email_address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={13} className="text-gray-400 shrink-0" />
                              <span className="font-mono select-all text-gray-700">{item.phone_number}</span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Delivery Address column */}
                        <td className="py-4 px-6 align-top max-w-[250px]">
                          <div className="flex gap-2 items-start text-gray-600">
                            <MapPin size={13} className="text-gray-400 shrink-0 mt-0.5" />
                            <p className="text-gray-700 font-sans leading-relaxed line-clamp-3 hover:line-clamp-none whitespace-pre-line">
                              {item.shipping_address}
                            </p>
                          </div>
                        </td>

                        {/* 4. Status Column */}
                        <td className="py-4 px-6 align-top whitespace-nowrap">
                          <div>
                            {updatingId === item.id ? (
                              <div className="flex items-center text-[10px] text-gray-400 font-mono py-1">
                                <RefreshCw size={10} className="animate-spin text-[#00A88F] mr-1" /> Syncing...
                              </div>
                            ) : (
                              <select
                                value={item.status || 'Pending'}
                                onChange={(e) => handleSaveUpdate(item.id, e.target.value)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border cursor-pointer outline-none transition focus:ring-1 capitalize ${getStatusStyles(item.status)}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Received">Received</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            )}
                          </div>
                        </td>

                        {/* 5. Remarks column */}
                        <td className="py-4 px-6 align-top min-w-[220px]">
                          <div className="flex items-center gap-2">
                            <input 
                              type="text"
                              value={localRemarks[item.id] ?? ''}
                              onChange={(e) => handleRemarksChange(item.id, e.target.value)}
                              placeholder="Add notes..."
                              className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#1E293B] text-gray-700"
                            />
                            <button
                              onClick={() => handleSaveUpdate(item.id, item.status || 'Pending')}
                              disabled={updatingId === item.id}
                              title="Save Remarks"
                              className="p-2 bg-[#1E293B] text-white hover:bg-opacity-90 rounded-lg transition disabled:opacity-40 cursor-pointer shrink-0"
                            >
                              <Save size={13} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            /* LIST VIEW TABLE END */
          )}
        </main>
      </div>

      {/* Sticky Footer */}
      <footer className="bg-[#020C17] text-gray-500 text-[11px] py-6 border-t border-white/5 w-full mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p className="font-light">DIAGONICA LLP • Isolated Operational Dashboard Terminal.</p>
          <p className="font-mono text-[10px]">© {new Date().getFullYear()} • Secure Connection Active</p>
        </div>
      </footer>
    </div>
  );
}