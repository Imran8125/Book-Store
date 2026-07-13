import React from 'react';
import { FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-sm py-12 mt-auto text-slate-400">
      <div className="container mx-auto px-4 flex flex-col items-center">
        {/* Decorative divider */}
        <div className="w-16 h-1 bg-indigo-500 rounded-full mb-8"></div>
        
        <p className="italic text-center text-slate-300 max-w-xl text-lg font-light leading-relaxed mb-6">
          "Embark on a literary journey with our book haven – where every page turns into an adventure!"
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800">
            <FiPhone className="text-indigo-400" />
            <span>Call Us: 127-865-586-67</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800">
            <FiMail className="text-indigo-400" />
            <span>support@bookhaven.com</span>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 border-t border-slate-900 pt-6 w-full max-w-2xl">
          Copyright &copy; {new Date().getFullYear()} BookHaven. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;