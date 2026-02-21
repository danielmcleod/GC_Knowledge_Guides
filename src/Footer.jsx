import React from 'react';

const MONO = "'JetBrains Mono', monospace";
const SANS = "'IBM Plex Sans', sans-serif";

const Footer = ({ title }) => (
  <footer className="py-8 text-center px-4" style={{ borderTop: '1px solid var(--border)' }}>
    <div className="text-xs" style={{ color: 'var(--t3)', fontFamily: MONO }}>{title}</div>
    <div className="text-[10px] mt-1" style={{ color: 'var(--bg4)' }}>Built with React + Tailwind CSS + lucide-react</div>
    <p className="text-[10px] max-w-2xl mx-auto mt-4 leading-relaxed" style={{ color: 'var(--t3)', fontFamily: SANS }}>
      This site is for educational purposes only. It is not affiliated with, endorsed by, or connected to Genesys in any capacity.
      This content is not intended for certification preparation and should not be used as such.
      This is not an official Genesys resource and is not a replacement for any information, documentation, or products provided by Genesys.
    </p>
  </footer>
);

export default Footer;
