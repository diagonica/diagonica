import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Layers, Cpu, MapPin, Mail, 
  CheckCircle, ArrowRight, Menu, X, ShieldCheck, Globe 
} from 'lucide-react';

export default function Home({ navigateTo }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const firmDetails = {
    name: "DIAGONICA LLP",
    llpin: "ACV-8020",
    dateOfIncorporation: "February 25, 2026",
    status: "Active (Compliant with MCA Regulations)",
    registeredOffice: "Atabagan, Boral Garia, Kolkata, South 24 Parganas, West Bengal, India, 700084",
    email: "info@diagonica.com",
    natureOfTrade: "Online Business for Non-Food Items, Specialized Wholesale Trade & Tech Equipment Supply"
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setContactSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setContactSubmitted(false), 6000);
      } else {
        setErrorMessage(data.error || 'Server validation failed during packet delivery.');
      }
    } catch (err) {
      setErrorMessage('Network connection lost or backend API engine is currently unreachable.');
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 antialiased bg-corporate-bg">
      
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-corporate-dark text-white text-xs py-2.5 px-4 text-center font-medium tracking-wide border-b border-white/10">
        🛡️ Registered Corporate Entity Under Limited Liability Partnership Act, 2008 • Ministry of Corporate Affairs (Gov of India)
      </div>

      {/* HEADER NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Brand Logo Identity Link */}
            <a href="/" className="flex items-center space-x-3 text-left group focus:outline-none">
              <img 
                src="/logo.png" 
                alt="Diagonica Logo" 
                className="h-12 w-12 object-contain transition transform group-hover:scale-105"
                onError={(e) => { 
                  e.target.src = "Diagonica-removebg-preview.png"; 
                }}
              />
              <div>
                <span className="text-xl font-black tracking-tight block text-corporate-dark group-hover:text-corporate-accent transition">
                  {firmDetails.name}
                </span>
              </div>
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-8 font-semibold text-sm">
              <a href="#about" className="text-gray-600 hover:text-corporate-dark transition-colors duration-200">About Us</a>
              <a href="#operations" className="text-gray-600 hover:text-corporate-dark transition-colors duration-200">Operations</a>
              <a href="#governance" className="text-gray-600 hover:text-corporate-dark transition-colors duration-200">Governance</a>
              <a href="#contact" className="bg-corporate-dark text-white px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-sm text-xs font-bold tracking-wide">
                Contact Hub
              </a>
            </div>

            {/* Mobile Nav Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-corporate-accent"
                aria-label="Toggle Navigation Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-2 shadow-inner text-left animate-fadeIn">
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-50">About Us</a>
            <a href="#operations" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-50">Operations</a>
            <a href="#governance" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-50">Governance</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block text-center text-white py-2.5 rounded-md font-bold mt-4 bg-corporate-dark hover:bg-opacity-95">Contact Hub</a>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <header className="relative text-white py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-corporate-dark to-[#041A29] text-left overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide text-corporate-orange">
              <ShieldCheck size={14} />
              <span>MCA Government Enlisted</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Driving Wholesale Trade & <span className="text-corporate-accent">Digital Supply Ecosystems</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-xl font-light leading-relaxed">
              Diagonica LLP bridges corporate boundaries by blending flexible non-food item online commerce with scalable wholesale industrial distribution modules.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <a href="#operations" className="inline-flex justify-center items-center px-6 py-3.5 text-white font-bold rounded-xl transition shadow-lg bg-corporate-accent hover:bg-opacity-90">
                Explore Trade Activities
                <ArrowRight size={16} className="ml-2" />
              </a>
              <a href="#contact" className="inline-flex justify-center items-center px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition">
                Corporate Credentials
              </a>
            </div>
          </div>
          
          {/* Factsheet Card */}
          <div className="lg:col-span-5 bg-black/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-white border-b border-white/15 pb-3 flex items-center gap-2">
              <Building2 className="text-corporate-accent" size={18} /> Corporate Registry
            </h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">LLP Identity Number</span>
                <span className="font-mono font-bold text-white tracking-wide">{firmDetails.llpin}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Incorporation Date</span>
                <span className="text-white font-medium">{firmDetails.dateOfIncorporation}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Jurisdiction Office</span>
                <span className="text-white font-medium">Kolkata</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Operational Classification</span>
                <span className="text-emerald-400 font-semibold">{firmDetails.status}</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* PROFILE SECTION */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="max-w-3xl mb-16">
          <h2 className="text-xs uppercase tracking-widest font-extrabold mb-1 text-corporate-accent">Firm Overview</h2>
          <p className="text-3xl font-extrabold text-corporate-dark">Corporate Architecture</p>
          <div className="w-12 h-1 mt-3 rounded bg-corporate-orange"></div>
          <p className="mt-6 text-gray-600 leading-relaxed text-base">
            Established under the Limited Liability Partnership Act, 2008, Diagonica LLP coordinates agile trade interfaces. By blending structural corporate liability configurations with elastic modern distribution paradigms, we manage industrial requirements across physical and electronic networks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mb-4 text-corporate-dark">
              <Globe size={20} />
            </div>
            <h3 className="text-base font-bold mb-2 text-corporate-dark">Compliant Governance</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              Maintained strictly through Ministry of Corporate Affairs regulations and central registration protocols to ensure reliable enterprise operations.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mb-4 text-corporate-accent">
              <Cpu size={20} />
            </div>
            <h3 className="text-base font-bold mb-2 text-corporate-dark">Market Operations</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              Positioned to handle multi-category digital consumer trade channels and wholesale e-commerce asset allocation securely.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mb-4 text-corporate-orange">
              <Layers size={20} />
            </div>
            <h3 className="text-base font-bold mb-2 text-corporate-dark">Industrial Provisioning</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              Legally empowered to operate as trade links and wholesale equipment distributors for advanced manufacturing structures.
            </p>
          </div>
        </div>
      </section>

      {/* OPERATIONS & NIC CODES */}
      <section id="operations" className="py-20 border-t border-b border-gray-200 bg-white text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-xs uppercase tracking-widest font-extrabold mb-1 text-corporate-orange">Industrial Classifications</h2>
            <p className="text-3xl font-extrabold text-corporate-dark">Certified Business Frameworks</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-corporate-bg rounded-xl p-6 border border-gray-200 flex flex-col justify-between hover:border-corporate-dark transition-all duration-200">
              <div>
                <span className="px-2.5 py-1 text-white text-xs font-mono font-bold rounded mb-4 inline-block bg-corporate-dark">NIC CODE 46909</span>
                <h3 className="text-base font-bold mb-2 text-corporate-dark">Non-Specialized Wholesale</h3>
                <p className="text-gray-600 text-xs leading-relaxed mb-4">
                  Multi-item cross-border retail configurations and general consumer asset fulfillment pipelines across domestic virtual trading systems.
                </p>
              </div>
              <span className="text-[11px] text-gray-400 font-bold border-t border-gray-200 pt-3 block">✓ Digital Trade Vectors</span>
            </div>

            <div className="bg-corporate-bg rounded-xl p-6 border border-gray-200 flex flex-col justify-between hover:border-corporate-accent transition-all duration-200">
              <div>
                <span className="px-2.5 py-1 text-white text-xs font-mono font-bold rounded mb-4 inline-block bg-corporate-accent">NIC CODE 46595</span>
                <h3 className="text-base font-bold mb-2 text-corporate-dark">Industrial Machinery Sourcing</h3>
                <p className="text-gray-600 text-xs leading-relaxed mb-4">
                  Procurement pipelines for heavy industrial machinery layouts, coordinating engineering components for textile, woodwork, and metallurgy fields.
                </p>
              </div>
              <span className="text-[11px] text-gray-400 font-bold border-t border-gray-200 pt-3 block">✓ B2B Capital Hardware</span>
            </div>

            <div className="bg-corporate-bg rounded-xl p-6 border border-gray-200 flex flex-col justify-between hover:border-corporate-orange transition-all duration-200">
              <div>
                <span className="px-2.5 py-1 text-white text-xs font-mono font-bold rounded mb-4 inline-block bg-corporate-orange">NIC CODE 46529</span>
                <h3 className="text-base font-bold mb-2 text-corporate-dark">Electronic Infrastructure</h3>
                <p className="text-gray-600 text-xs leading-relaxed mb-4">
                  Commercial equipment supply loops for electronic assemblies, computation accessories, telecom assets, and network nodes.
                </p>
              </div>
              <span className="text-[11px] text-gray-400 font-bold border-t border-gray-200 pt-3 block">✓ Enterprise IT Assets</span>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS & GOVERNANCE */}
      <section id="governance" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-corporate-accent">Executive Oversight</h2>
            <h3 className="text-2xl font-extrabold text-corporate-dark">Designated Corporate Partners</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              Statutory oversight and regulatory execution are driven collectively by the registered board of members under formalized accountability parameters.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {[
              { name: "Dipali Chakraborty", meta: "Designated Partner (DIN: 11572705)" },
              { name: "Nilotpal Majumder", meta: "Designated Partner (DIN: 11572707)" },
              { name: "Sonali Roy", meta: "Designated Partner (DIN: 11572706)" }
            ].map((partner, index) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm hover:translate-x-1 transition-transform duration-150">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold bg-corporate-dark">
                    {partner.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">{partner.name}</h4>
                    <p className="text-xs text-gray-400">{partner.meta}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded font-bold">MCA ACTIVE</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT DESK & OFFICE METRICS */}
      <section id="contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left border-t border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Managed Contact Form Card */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold mb-1 text-corporate-dark">B2B Corporate Desk</h3>
            <p className="text-gray-400 text-xs mb-6">Forward operational logistics proposals directly to our administrative hub.</p>
            
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs mb-4">
                ⚠ {errorMessage}
              </div>
            )}

            {contactSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle className="text-emerald-500 shrink-0" size={16} />
                <span>Proposal successfully written to ledger and confirmation email dispatched.</span>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Representative Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-corporate-dark focus:border-corporate-dark" 
                    placeholder="Full Name" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-corporate-dark focus:border-corporate-dark" 
                    placeholder="business@company.com" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Procurement Specifications/Requirements</label>
                  <textarea 
                    rows="3" 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-corporate-dark focus:border-corporate-dark" 
                    placeholder="Outline contract requirements..."
                  ></textarea>
                </div>
                <button type="submit" className="w-full text-white font-bold p-3 rounded-lg text-xs transition bg-corporate-dark hover:bg-opacity-90 shadow-sm">
                  Submit Proposal
                </button>
              </form>
            )}
          </div>

          {/* Address Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h4 className="font-bold text-sm border-b pb-2 text-corporate-dark">Registered Office</h4>
              <div className="flex gap-3 items-start text-xs text-gray-600">
                <MapPin className="shrink-0 mt-0.5 text-corporate-orange" size={16} />
                <p className="leading-relaxed font-medium">{firmDetails.registeredOffice}</p>
              </div>
              <div className="flex gap-3 items-center text-xs text-gray-600 pt-2">
                <Mail className="shrink-0 text-corporate-accent" size={16} />
                <a href={`mailto:${firmDetails.email}`} className="font-mono font-bold text-gray-700 hover:underline">
                  {firmDetails.email}
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>


{/* CORPORATE FOOTER */}
      <footer className="bg-[#020C17] text-gray-500 text-[11px] py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="font-bold text-gray-300 text-xs">{firmDetails.name}</p>
            <p className="font-light mt-0.5">Incorporated in compliance with Section 12(1) of the Limited Liability Partnership Act, 2008.</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-4 font-mono text-[10px] items-center">
            {/* Real relative anchor routes redirecting cleanly to your legal sub-paths */}
                        <a 
              href="/login" 
              className="hover:text-corporate-accent hover:underline transition-colors duration-150 cursor-pointer"
            >
              Web Login
            </a>
            <span>•</span>
            <a 
              href="/terms" 
              className="hover:text-corporate-accent hover:underline transition-colors duration-150 cursor-pointer"
            >
              Terms & Conditions
            </a>
            <span>•</span>
            <a 
              href="/privacy" 
              className="hover:text-corporate-accent hover:underline transition-colors duration-150 cursor-pointer"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <span>
              IT Partner{' '}
              <a 
                href="https://rjrinfinity.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-corporate-accent hover:underline font-bold transition-all duration-150"
              >
                R J R Infinity
              </a>
            </span>
            <span>•</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}