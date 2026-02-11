import React, { useState } from 'react';
import {
  PhoneOutgoing, MessageSquare, Headphones, BarChart3, Shield,
  Workflow, Sun, Moon, ArrowRight, BookOpen, Layers, Lock, Clock
} from 'lucide-react';
import GenesysOutboundGuide from '../GenesysOutboundGuide.jsx';
import GenesysRoutingGuide from '../GenesysRoutingGuide.jsx';
import GenesysWFMGuide from '../GenesysWFMGuide.jsx';
import GenesysAnalyticsGuide from '../GenesysAnalyticsGuide.jsx';
import GenesysQualityGuide from '../GenesysQualityGuide.jsx';
import GenesysSecurityGuide from '../GenesysSecurityGuide.jsx';

const MONO = "'JetBrains Mono', monospace";
const SANS = "'IBM Plex Sans', sans-serif";

const GUIDES = [
  {
    id: 'routing',
    title: 'Inbound Routing & ACD',
    subtitle: 'Queues, skills-based routing, Architect flows, and priority handling',
    icon: Workflow,
    color: '#3B82F6',
    status: 'available',
    tiers: 3,
    sections: 21,
    topics: ['ACD Queues', 'Skills-Based Routing', 'Architect Flows', 'Priority Labels', 'Bullseye Routing'],
  },
  {
    id: 'outbound',
    title: 'Outbound Dialing',
    subtitle: 'Campaign engine, dialing modes, compliance, and automation',
    icon: PhoneOutgoing,
    color: '#F97316',
    status: 'available',
    tiers: 3,
    sections: 22,
    topics: ['Dialing Modes', 'Contact Lists', 'DNC Compliance', 'Predictive Algorithm', 'AMD Detection', 'Campaign Rules'],
  },
  {
    id: 'wfm',
    title: 'Workforce Management',
    subtitle: 'Forecasting, scheduling, adherence, and intraday management',
    icon: Clock,
    color: '#8B5CF6',
    status: 'available',
    tiers: 3,
    sections: 21,
    topics: ['Forecasting', 'Scheduling', 'Real-Time Adherence', 'Intraday Management', 'Time-Off Requests'],
  },
  {
    id: 'analytics',
    title: 'Analytics & Reporting',
    subtitle: 'Dashboards, views, data exports, and performance metrics',
    icon: BarChart3,
    color: '#10B981',
    status: 'available',
    tiers: 3,
    sections: 21,
    topics: ['Performance Views', 'Custom Dashboards', 'Data Export', 'Conversation Detail', 'Real-Time Metrics'],
  },
  {
    id: 'quality',
    title: 'Quality Management',
    subtitle: 'Evaluation forms, calibration, coaching, and speech analytics',
    icon: Headphones,
    color: '#EC4899',
    status: 'available',
    tiers: 3,
    sections: 21,
    topics: ['Evaluation Forms', 'Quality Policies', 'Calibration', 'Agent Coaching', 'Speech Analytics'],
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    subtitle: 'Roles, permissions, PCI, GDPR, and audit logging',
    icon: Shield,
    color: '#EF4444',
    status: 'available',
    tiers: 3,
    sections: 21,
    topics: ['Roles & Permissions', 'OAuth & SSO', 'PCI Compliance', 'GDPR / HIPAA', 'Audit Logging'],
  },
];

const THEME_VARS = {
  dark: {
    '--bg1': '#0B0F1A', '--bg2': '#111827', '--bg3': '#1F2937', '--bg4': '#374151',
    '--t1': '#F9FAFB', '--t2': '#9CA3AF', '--t3': '#6B7280',
    '--border': '#1F2937', '--bg1-alpha': '#0B0F1Aee',
  },
  light: {
    '--bg1': '#F8FAFC', '--bg2': '#FFFFFF', '--bg3': '#F1F5F9', '--bg4': '#E2E8F0',
    '--t1': '#0F172A', '--t2': '#475569', '--t3': '#64748B',
    '--border': '#E2E8F0', '--bg1-alpha': '#F8FAFCee',
  },
};

const App = () => {
  const [activeGuide, setActiveGuide] = useState(null);
  const [isDark, setIsDark] = useState(true);

  const tv = isDark ? THEME_VARS.dark : THEME_VARS.light;

  // If a guide is selected, render it
  const guideProps = { onBack: () => setActiveGuide(null), isDark, setIsDark };
  if (activeGuide === 'outbound') return <GenesysOutboundGuide {...guideProps} />;
  if (activeGuide === 'routing') return <GenesysRoutingGuide {...guideProps} />;
  if (activeGuide === 'wfm') return <GenesysWFMGuide {...guideProps} />;
  if (activeGuide === 'analytics') return <GenesysAnalyticsGuide {...guideProps} />;
  if (activeGuide === 'quality') return <GenesysQualityGuide {...guideProps} />;
  if (activeGuide === 'security') return <GenesysSecurityGuide {...guideProps} />;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ ...tv, backgroundColor: 'var(--bg1)', color: 'var(--t1)', fontFamily: SANS }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        body { background-color: ${isDark ? '#0B0F1A' : '#F8FAFC'}; transition: background-color 0.3s ease; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'var(--bg1-alpha)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Layers size={20} style={{ color: '#F97316' }} />
            <span className="font-bold text-sm" style={{ fontFamily: MONO, color: '#F97316' }}>GENESYS CLOUD KNOWLEDGE</span>
          </div>
          <button onClick={() => setIsDark(!isDark)} className="p-1.5 rounded cursor-pointer transition-colors" style={{ color: 'var(--t3)' }} aria-label="Toggle theme">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="py-16 md:py-24 text-center px-4" style={{ background: `linear-gradient(180deg, var(--bg2) 0%, var(--bg1) 100%)` }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6" style={{ backgroundColor: '#F9731622', color: '#F97316', fontFamily: MONO }}>
          <BookOpen size={14} />
          Interactive Knowledge Guides
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: MONO }}>
          Genesys Cloud <span style={{ color: '#F97316' }}>CX</span>
        </h1>
        <p className="text-sm md:text-lg max-w-2xl mx-auto mb-2" style={{ color: 'var(--t2)', fontFamily: SANS }}>
          Deep-dive knowledge guides for every major Genesys Cloud module.
          From zero to expert, with interactive diagrams and progressive disclosure.
        </p>
        <p className="text-xs" style={{ color: 'var(--t3)' }}>
          Select a guide below to begin learning.
        </p>
      </div>

      {/* Guide Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20 -mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GUIDES.map(g => {
            const Icon = g.icon;
            const available = g.status === 'available';
            return (
              <button
                key={g.id}
                onClick={() => available && setActiveGuide(g.id)}
                disabled={!available}
                className={`text-left rounded-xl p-6 transition-all duration-300 group ${available ? 'cursor-pointer hover:-translate-y-1' : 'cursor-not-allowed opacity-60'}`}
                style={{
                  backgroundColor: 'var(--bg2)',
                  border: `1px solid var(--border)`,
                  ...(available ? {} : {}),
                }}
                onMouseEnter={e => { if (available) { e.currentTarget.style.borderColor = g.color; e.currentTarget.style.boxShadow = `0 4px 20px ${g.color}15`; } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: g.color + '15' }}>
                    <Icon size={20} style={{ color: g.color }} />
                  </div>
                  {available ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#10B98122', color: '#10B981', fontFamily: MONO }}>AVAILABLE</span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1" style={{ backgroundColor: 'var(--bg3)', color: 'var(--t3)', fontFamily: MONO }}>
                      <Lock size={10} /> COMING SOON
                    </span>
                  )}
                </div>

                {/* Title & subtitle */}
                <h2 className="text-base font-bold mb-1" style={{ fontFamily: MONO, color: 'var(--t1)' }}>{g.title}</h2>
                <p className="text-xs mb-4" style={{ color: 'var(--t2)', fontFamily: SANS, lineHeight: 1.6 }}>{g.subtitle}</p>

                {/* Stats */}
                {available && (
                  <div className="flex gap-3 mb-4 text-[10px]" style={{ fontFamily: MONO, color: 'var(--t3)' }}>
                    <span>{g.tiers} Tiers</span>
                    <span>•</span>
                    <span>{g.sections} Sections</span>
                  </div>
                )}

                {/* Topic tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {g.topics.slice(0, 4).map((t, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg3)', color: 'var(--t3)', fontFamily: SANS }}>{t}</span>
                  ))}
                  {g.topics.length > 4 && (
                    <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg3)', color: 'var(--t3)' }}>+{g.topics.length - 4} more</span>
                  )}
                </div>

                {/* CTA */}
                {available && (
                  <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: g.color, fontFamily: MONO }}>
                    Open Guide <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="text-xs" style={{ color: 'var(--t3)', fontFamily: MONO }}>Genesys Cloud CX — Interactive Knowledge Guides</div>
        <div className="text-[10px] mt-1" style={{ color: 'var(--bg4)' }}>Built with React + Tailwind CSS + lucide-react</div>
      </footer>
    </div>
  );
};

export default App;
