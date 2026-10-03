'use client';

import './founder.css';

import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileText,
  Flag,
  Gauge,
  Inbox,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Rocket,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react';

const nav = [
  { label: 'Command center', icon: LayoutDashboard },
  { label: 'Workflows', icon: Zap },
  { label: 'Approvals', icon: ShieldCheck, count: 3 },
  { label: 'Customers', icon: Users },
  { label: 'Growth', icon: BarChart3 },
  { label: 'Finance', icon: CircleDollarSign },
];

const initialWorkflows = [
  { id: 1, name: 'Daily founder brief', description: 'Signals, metrics and top decisions', cadence: 'Every day · 8:30 AM', status: 'Live', icon: Gauge, color: 'violet' },
  { id: 2, name: 'Inbound lead follow-up', description: 'Qualify, route and draft a reply', cadence: 'When a lead arrives', status: 'Live', icon: MessageSquareText, color: 'blue' },
  { id: 3, name: 'Weekly growth review', description: 'Summarise acquisition and experiments', cadence: 'Every Monday · 9:00 AM', status: 'Live', icon: Target, color: 'orange' },
  { id: 4, name: 'Runway watch', description: 'Flag unusual spend or cash risk', cadence: 'Every Friday · 6:00 PM', status: 'Paused', icon: CircleDollarSign, color: 'green' },
];

const initialApprovals = [
  { id: 1, kind: 'Customer reply', title: 'Reply to Priya from Acme Labs', detail: '“Can we see a demo for our 12-person team next week?”', source: 'Inbound lead follow-up', time: '12 min ago', tone: 'blue' },
  { id: 2, kind: 'Marketing draft', title: 'LinkedIn launch post', detail: 'A concise founder-led post about the new workspace...', source: 'Content engine', time: '1 hr ago', tone: 'violet' },
  { id: 3, kind: 'Spend alert', title: 'Review $420 tool renewal', detail: 'Figma · renews in 3 days · 18% higher than last term', source: 'Runway watch', time: '2 hrs ago', tone: 'orange' },
];

const feed = [
  { icon: Check, title: 'Daily founder brief delivered', detail: '3 signals · 2 decisions · 1 risk', time: '8:31 AM', color: 'green' },
  { icon: MessageSquareText, title: 'New lead qualified', detail: 'Priya · Acme Labs · 12 seats', time: '8:04 AM', color: 'blue' },
  { icon: FileText, title: 'Weekly growth review prepared', detail: '4 experiments · 2 winners · 1 follow-up', time: 'Yesterday', color: 'violet' },
  { icon: Flag, title: 'Runway watch found a renewal', detail: 'Figma · $420 · review recommended', time: 'Yesterday', color: 'orange' },
];

export default function FounderCommandCenter() {
  const [activeNav, setActiveNav] = useState('Command center');
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [query, setQuery] = useState('');
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [toast, setToast] = useState('');

  const filteredWorkflows = useMemo(() => workflows.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())), [workflows, query]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  function toggleWorkflow(id: number) {
    setWorkflows((items) => items.map((item) => item.id === id ? { ...item, status: item.status === 'Live' ? 'Paused' : 'Live' } : item));
    notify('Workflow status updated');
  }

  function resolveApproval(id: number, action: 'approve' | 'dismiss') {
    setApprovals((items) => items.filter((item) => item.id !== id));
    notify(action === 'approve' ? 'Approved — the agent will carry it out.' : 'Approval dismissed');
  }

  return (
    <main className="founder-shell">
      <aside className="founder-sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><Sparkles size={18} /></div>
          <div><strong>OSO</strong><span>Founder OS</span></div>
        </div>
        <div className="workspace-switcher"><div className="workspace-avatar">N</div><div><strong>Noradbolus</strong><span>Startup workspace</span></div><ChevronRight size={15} /></div>
        <nav className="founder-nav">
          <p className="nav-label">WORKSPACE</p>
          {nav.map(({ label, icon: Icon, count }) => <button key={label} className={activeNav === label ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav(label)}><Icon size={17} /><span>{label}</span>{count && <em>{approvals.length}</em>}</button>)}
          <p className="nav-label nav-label-gap">SYSTEM</p>
          <button className="nav-item" onClick={() => notify('Integrations are ready to connect')}><Bot size={17} /><span>AI team</span><span className="status-dot" /></button>
          <button className="nav-item" onClick={() => notify('Settings panel coming next')}><Settings2 size={17} /><span>Settings</span></button>
        </nav>
        <div className="sidebar-bottom"><div className="agent-status"><span className="status-dot" /><div><strong>Agent is online</strong><span>Watching your business</span></div></div><div className="sidebar-user"><div className="user-avatar">A</div><div><strong>Founder</strong><span>Admin</span></div><MoreHorizontal size={17} /></div></div>
      </aside>

      <section className="founder-content">
        <header className="topbar"><div className="mobile-brand"><Menu size={20} /><strong>Founder OS</strong></div><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{activeNav}</strong></div><div className="topbar-actions"><div className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search workflows..." /></div><button className="icon-button" onClick={() => notify('You are all caught up')}><Bell size={18} /><i /></button><div className="user-avatar small">A</div></div></header>
        <div className="content-inner">
          <div className="hero-row"><div><p className="eyebrow"><span className="status-dot" /> TUESDAY, SEPTEMBER 29, 2026</p><h1>Good morning, Arjun.</h1><p className="hero-subtitle">Your startup is moving. Here’s what deserves your attention today.</p></div><button className="primary-button" onClick={() => setShowWorkflowModal(true)}><Plus size={17} /> New workflow</button></div>

          <section className="metric-grid">
            <Metric label="Monthly recurring revenue" value="₹8.42L" delta="+12.4%" caption="vs. last month" icon={CircleDollarSign} color="violet" />
            <Metric label="Active customers" value="184" delta="+18" caption="this month" icon={Users} color="blue" />
            <Metric label="Runway" value="11.6 mo" delta="Healthy" caption="based on current burn" icon={Rocket} color="orange" />
            <Metric label="Agent tasks completed" value="72" delta="+24%" caption="this week" icon={Zap} color="green" />
          </section>

          <div className="section-heading"><div><h2>Today at a glance</h2><p>Signals collected by your AI team</p></div><button className="text-button" onClick={() => notify('Opening full analytics')}>View analytics <ArrowUpRight size={15} /></button></div>
          <section className="glance-grid"><div className="signal-card highlight"><div className="signal-icon violet"><Sparkles size={18} /></div><div className="signal-copy"><span>FOUNDER BRIEF</span><h3>2 decisions are waiting for you</h3><p>One customer reply and one spend review need a quick yes/no.</p><button onClick={() => setActiveNav('Approvals')}>Review approvals <ChevronRight size={14} /></button></div><div className="signal-art"><span /><span /><span /><span /><span /></div></div><div className="signal-card"><div className="signal-icon green"><TrendingUpIcon /></div><div className="signal-copy"><span>GROWTH SIGNAL</span><h3>Activation is up 8.6%</h3><p>Onboarding experiment B is outperforming the control.</p><button onClick={() => notify('Experiment report opened')}>See experiment <ChevronRight size={14} /></button></div></div></section>

          <div className="lower-grid"><section className="panel workflow-panel"><div className="panel-heading"><div><h2>Active workflows</h2><p>Your AI team is handling the repeatable work.</p></div><button className="icon-button subtle" onClick={() => setShowWorkflowModal(true)}><Plus size={18} /></button></div><div className="workflow-list">{filteredWorkflows.map((item) => { const Icon = item.icon; return <div className="workflow-row" key={item.id}><div className={`workflow-icon ${item.color}`}><Icon size={17} /></div><div className="workflow-info"><strong>{item.name}</strong><span>{item.description}</span><small><Clock3 size={12} /> {item.cadence}</small></div><span className={item.status === 'Live' ? 'live-pill' : 'paused-pill'}>{item.status}</span><button className="play-button" onClick={() => toggleWorkflow(item.id)} aria-label={`Toggle ${item.name}`}>{item.status === 'Live' ? <Pause size={14} /> : <Play size={14} />}</button></div> })}</div><button className="panel-footer-button" onClick={() => setActiveNav('Workflows')}>Manage all workflows <ArrowUpRight size={15} /></button></section>
            <section className="panel approval-panel"><div className="panel-heading"><div><h2>Needs your approval <span className="count-badge">{approvals.length}</span></h2><p>The agent pauses before consequential actions.</p></div><ShieldCheck className="approval-shield" size={22} /></div>{approvals.length === 0 ? <div className="empty-state"><Check size={22} /><strong>All clear</strong><span>No decisions waiting for you.</span></div> : <div className="approval-list">{approvals.map((item) => <div className="approval-row" key={item.id}><div className={`approval-type ${item.tone}`}>{item.kind === 'Customer reply' ? <MessageSquareText size={15} /> : item.kind === 'Spend alert' ? <CircleDollarSign size={15} /> : <FileText size={15} />}</div><div className="approval-info"><strong>{item.title}</strong><span>{item.detail}</span><small>{item.source} · {item.time}</small></div><div className="approval-actions"><button className="approve-button" onClick={() => resolveApproval(item.id, 'approve')}><Check size={14} /></button><button className="dismiss-button" onClick={() => resolveApproval(item.id, 'dismiss')}><X size={14} /></button></div></div>)}</div>}</section></div>

          <section className="panel activity-panel"><div className="panel-heading"><div><h2>Agent activity</h2><p>A quiet log of what is getting done in the background.</p></div><button className="text-button" onClick={() => notify('Activity log exported')}>Export log <ArrowUpRight size={15} /></button></div><div className="activity-list">{feed.map(({ icon: Icon, title, detail, time, color }) => <div className="activity-item" key={title}><div className={`activity-icon ${color}`}><Icon size={15} /></div><div><strong>{title}</strong><span>{detail}</span></div><time>{time}</time></div>)}</div></section>
        </div>
      </section>
      {showWorkflowModal && <div className="modal-backdrop" onClick={() => setShowWorkflowModal(false)}><div className="workflow-modal" onClick={(e) => e.stopPropagation()}><div className="modal-top"><div className="signal-icon violet"><Zap size={18} /></div><button className="icon-button subtle" onClick={() => setShowWorkflowModal(false)}><X size={18} /></button></div><h2>Build a workflow</h2><p>Tell your AI team what repeatable work you want off your plate.</p><div className="prompt-box"><Bot size={17} /><span>e.g. “Every Friday, summarise new leads and draft follow-ups.”</span></div><button className="primary-button full" onClick={() => { setShowWorkflowModal(false); notify('Workflow draft created'); }}>Create workflow draft <ArrowUpRight size={16} /></button></div></div>}
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </main>
  );
}

function Metric({ label, value, delta, caption, icon: Icon, color }: { label: string; value: string; delta: string; caption: string; icon: typeof Gauge; color: string }) { return <div className="metric-card"><div className={`metric-icon ${color}`}><Icon size={17} /></div><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><div><b className={color === 'orange' ? 'neutral' : ''}>{delta}</b><span>{caption}</span></div></div> }
function TrendingUpIcon() { return <BarChart3 size={18} /> }
