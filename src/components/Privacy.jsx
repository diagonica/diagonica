import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const navigate = useNavigate();
  
  const firmDetails = {
    name: "DIAGONICA LLP",
    llpin: "ACV-8020",
    dateOfIncorporation: "February 25, 2026",
    status: "Active (Compliant with MCA Regulations)",
    registeredOffice: "Atabagan, Boral Garia, Kolkata, South 24 Parganas, West Bengal, India, 700084",
    email: "info@diagonica.com",
    natureOfTrade: "Online Business for Non-Food Items, Specialized Wholesale Trade & Tech Equipment Supply"
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800 antialiased text-left">
      {/* Header Banner */}
      <div className="bg-[#002B49] text-white py-12 px-4 sm:px-6 lg:px-8 text-center relative">
        <button 
          onClick={() => navigate('/')}
          className="absolute left-4 sm:left-8 top-12 flex items-center gap-2 text-xs font-bold hover:underline bg-white/10 px-3 py-1.5 rounded-lg transition cursor-pointer"
          style={{ color: '#00A88F' }}
        >
          <ArrowLeft size={14} /> Back to Home
        </button>
        <ShieldCheck className="mx-auto mb-3" size={36} style={{ color: '#00A88F' }} />
        <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mt-1">DIAGONICA LLP • Last Updated: May 2026</p>
      </div>

      {/* Content Canvas */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-8 text-sm leading-relaxed text-gray-600">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#002B49] flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#00A88F] rounded-full inline-block"></span>
              1. Information Capture Profile
            </h2>
            <p>
              When a corporate representative utilizes our **B2B Corporate Desk** interface, our systems collect structured professional data, including full representative names, verified business email addresses, and detailed project specification logs. This data is handled in strict compliance with transparency parameters outlined by the Ministry of Corporate Affairs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#002B49] flex items-center gap-2">
              {/* FIXED CSS CLASS BELOW */}
              <span className="w-1.5 h-5 bg-[#00A88F] rounded-full inline-block"></span>
              2. Data Storage & System Security
            </h2>
            <p>
              Submitted credentials and request packets are securely processed and written straight into an isolated, protected **PostgreSQL database repository** on our backend server engine. We maintain rigorous physical and logical access controls over our data pools to block unauthorized tracking, leak parameters, or server modifications.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#002B49] flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#00A88F] rounded-full inline-block"></span>
              3. Processing Intentions
            </h2>
            <p>
              Data items are processed automatically for specific corporate evaluation tasks:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>To evaluate partnership applications against our National Industrial Classification scopes.</li>
              <li>To dispatch transactional acknowledgment receipts and tracking summaries via secure outbound network streams.</li>
              <li>To satisfy regional municipal governance audits inside Ward No.111.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#002B49] flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#00A88F] rounded-full inline-block"></span>
              4. Third-Party Disclosures
            </h2>
            <p>
              DIAGONICA LLP does not barter, sell, or disclose stored enterprise information profiles to external retail platforms. Your metrics are shared exclusively with our designated board members, specialized corporate liaisons, and verified technology partners (including our provider <a 
                  href="https://rjrinfinity.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#00A88F] font-bold hover:underline transition-all"
                >
                  R J R Infinity
                </a>) solely to process business requests.
            </p>
          </section>

          <div className="border-t pt-6 flex justify-between items-center text-xs text-gray-400">
            <span>Corporate Identity: ACV-8020</span>
            <button 
              onClick={() => navigate('/')}
              className="text-[#00A88F] font-bold hover:underline bg-transparent border-none cursor-pointer"
            >
              Return to Main Portal
            </button>
          </div>

        </div>
      </main>

      {/* CORPORATE FOOTER */}
      <footer className="bg-[#020C17] text-gray-500 text-[11px] py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="font-bold text-gray-300 text-xs">{firmDetails.name}</p>
            <p className="font-light mt-0.5">Incorporated in compliance with Section 12(1) of the Limited Liability Partnership Act, 2008.</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-4 font-mono text-[10px] items-center">
            <a 
              href="/terms" 
              className="hover:text-[#00A88F] hover:underline transition-colors duration-150 cursor-pointer"
            >
              Terms & Conditions
            </a>
            <span>•</span>
            <a 
              href="/privacy" 
              className="hover:text-[#00A88F] hover:underline transition-colors duration-150 cursor-pointer"
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
                className="text-[#00A88F] hover:underline font-bold transition-all duration-150"
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