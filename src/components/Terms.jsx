import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';

export default function Terms({ navigateTo }) {
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800 antialiased text-left flex flex-col justify-between">
      {/* Header Banner */}
      <div className="bg-[#002B49] text-white py-12 px-4 sm:px-6 lg:px-8 text-center relative">
        <button 
          onClick={() => navigate('/')}
          className="absolute left-4 sm:left-8 top-12 flex items-center gap-2 text-xs font-bold hover:underline bg-white/10 px-3 py-1.5 rounded-lg transition cursor-pointer"
          style={{ color: '#00A88F' }}
        >
          <ArrowLeft size={14} /> Back to Home
        </button>
        <Scale className="mx-auto mb-3 text-corporate-accent" size={36} style={{ color: '#00A88F' }} />
        <h1 className="text-3xl font-extrabold tracking-tight">Terms & Conditions</h1>
        <p className="text-sm text-gray-400 mt-1">DIAGONICA LLP • Last Updated: May 2026</p>
      </div>

      {/* Content Canvas */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-8 text-sm leading-relaxed text-gray-600">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#002B49] flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#FF7A00] rounded-full inline-block"></span>
              1. Legal Framework & Enforcement
            </h2>
            <p>
              This document constitutes a binding operational agreement for <strong>DIAGONICA LLP</strong> (LLPIN: ACV-8020). By interacting with our trading interfaces, custom lead capture desks, or procurement pipelines, you assent fully to these terms executed pursuant to Section 23(4) of the Limited Liability Partnership Act, 2008.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#002B49] flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#FF7A00] rounded-full inline-block"></span>
              2. Trade Enlistment & Scope of Operations
            </h2>
            <p>
              Our enterprise framework coordinates wholesale pipelines and online commerce channels for non-food items under National Industrial Classifications (NIC 46909, 46595, and 46529).
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Corporate activities are strictly bound by Certificate of Enlistment metrics assigned under the rules of the Kolkata Municipal Corporation Act, 1980.</li>
              <li>Procurement queries or custom infrastructure allocations initialized through our B2B desk form an intentional declaration of corporate interest and do not automatically mandate legal contract delivery.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#002B49] flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#FF7A00] rounded-full inline-block"></span>
              3. Indemnity & Liability Constraints
            </h2>
            <p>
              Any corporate entity or representative interacting with our systems shall indemnify and keep DIAGONICA LLP fully indemnified against all claims, damages, suites, actions, or legal proceedings resulting from third-party distribution disruptions or malformed data submissions. Partner liability constraints remain rigidly aligned with the official schedules approved by the Ministry of Corporate Affairs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#002B49] flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#FF7A00] rounded-full inline-block"></span>
              4. Regional Signboard Compliance
            </h2>
            <p>
              In obedience to regional legislative mandates enforced within the jurisdiction of Kolkata, West Bengal, all branding structures, signboards, or local digital display touchpoints reflect strict multi-lingual language compliance configurations containing separate, explicit Bengali textual identifiers.
            </p>
          </section>
          {/* CORPORATE FOOTER */}
      

          {/* <div className="border-t pt-6 flex justify-between items-center text-xs text-gray-400">
            <span>Jurisdiction: Kolkata, West Bengal, India</span>
            <button 
              onClick={() => navigateTo('home')}
              className="text-[#00A88F] font-bold hover:underline"
            >
              Return to Main Portal
            </button>

          </div> */}

        </div>
        
      </main>
      <footer className="bg-[#020C17] text-gray-500 text-[11px] py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="font-bold text-gray-300 text-xs">{firmDetails.name}</p>
            <p className="font-light mt-0.5">Incorporated in compliance with Section 12(1) of the Limited Liability Partnership Act, 2008.</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-4 font-mono text-[10px] items-center">
            {/* Real relative anchor routes redirecting cleanly to your legal sub-paths */}
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