import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import { db, firebaseConfigured } from './firebase';

type Workflow = { id: string; name: string; description: string; status: 'Live' | 'Paused'; cadence: string };

const fallbackWorkflows: Workflow[] = [
  { id: 'brief', name: 'Daily founder brief', description: 'Signals, metrics and top decisions', status: 'Live', cadence: 'Every day · 8:30 AM' },
  { id: 'leads', name: 'Inbound lead follow-up', description: 'Qualify, route and draft a reply', status: 'Live', cadence: 'When a lead arrives' },
  { id: 'growth', name: 'Weekly growth review', description: 'Summarise acquisition and experiments', status: 'Live', cadence: 'Every Monday · 9:00 AM' },
  { id: 'runway', name: 'Runway watch', description: 'Flag unusual spend or cash risk', status: 'Paused', cadence: 'Every Friday · 6:00 PM' },
];

export default function App() {
  const [workflows, setWorkflows] = useState(fallbackWorkflows);
  const [approvals, setApprovals] = useState(3);
  const [connected, setConnected] = useState(firebaseConfigured);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!firebaseConfigured) return;
    getDocs(query(collection(db, 'startup_workflows'), limit(20)))
      .then((result) => {
        if (result.empty) return;
        setWorkflows(result.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Workflow, 'id'>) })));
      })
      .catch(() => setConnected(false));
  }, []);

  const liveCount = useMemo(() => workflows.filter((workflow) => workflow.status === 'Live').length, [workflows]);
  const toggleWorkflow = (id: string) => {
    setWorkflows((items) => items.map((item) => item.id === id ? { ...item, status: item.status === 'Live' ? 'Paused' : 'Live' } : item));
    setNotice('Workflow status updated');
    setTimeout(() => setNotice(''), 1800);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View><Text style={styles.kicker}>OSO · FOUNDER OS</Text><Text style={styles.title}>Good morning, Arjun.</Text><Text style={styles.subtitle}>Your startup is moving. Here’s what deserves attention today.</Text></View>
          <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
        </View>

        <View style={styles.statusCard}><View style={[styles.statusDot, connected ? styles.online : styles.offline]} /><Text style={styles.statusText}>{connected ? 'Firebase cloud connected' : 'Add Firebase config to connect cloud'}</Text><Text style={styles.statusMeta}>{liveCount} workflows live</Text></View>

        <View style={styles.metricGrid}>
          <Metric label="Monthly recurring revenue" value="₹8.42L" delta="+12.4%" />
          <Metric label="Active customers" value="184" delta="+18 this month" />
          <Metric label="Runway" value="11.6 mo" delta="Healthy" />
          <Metric label="Agent tasks" value="72" delta="+24% this week" />
        </View>

        <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Today at a glance</Text><Text style={styles.sectionSub}>Signals collected by your AI team</Text></View><Text style={styles.link}>View analytics ↗</Text></View>
        <View style={styles.signalCard}><View style={styles.signalIcon}><Text>✦</Text></View><View style={{ flex: 1 }}><Text style={styles.signalLabel}>FOUNDER BRIEF</Text><Text style={styles.signalTitle}>{approvals} decisions are waiting for you</Text><Text style={styles.signalCopy}>One customer reply and one spend review need a quick yes/no.</Text><TouchableOpacity onPress={() => setNotice('Approval queue opened')}><Text style={styles.link}>Review approvals ›</Text></TouchableOpacity></View></View>

        <View style={styles.panel}><View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Active workflows</Text><Text style={styles.sectionSub}>Your AI team is handling repeatable work.</Text></View><Text style={styles.badge}>{liveCount} live</Text></View>{workflows.map((workflow) => <View style={styles.workflow} key={workflow.id}><View style={styles.workflowIcon}><Text>⚡</Text></View><View style={styles.workflowCopy}><Text style={styles.workflowName}>{workflow.name}</Text><Text style={styles.workflowDesc}>{workflow.description}</Text><Text style={styles.workflowCadence}>{workflow.cadence}</Text></View><TouchableOpacity style={workflow.status === 'Live' ? styles.livePill : styles.pausedPill} onPress={() => toggleWorkflow(workflow.id)}><Text style={workflow.status === 'Live' ? styles.liveText : styles.pausedText}>{workflow.status}</Text></TouchableOpacity></View>)}</View>

        <View style={styles.approvalCard}><View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Needs your approval</Text><Text style={styles.sectionSub}>The agent pauses before consequential actions.</Text></View><Text style={styles.approvalCount}>{approvals}</Text></View><Approval title="Reply to Priya from Acme Labs" detail="Customer reply · 12 min ago" onDone={() => setApprovals((value) => Math.max(0, value - 1))} /><Approval title="Review ₹34,800 tool renewal" detail="Spend alert · 2 hrs ago" onDone={() => setApprovals((value) => Math.max(0, value - 1))} /></View>

        {notice ? <View style={styles.toast}><Text style={styles.toastText}>✓ {notice}</Text></View> : null}
        <Text style={styles.footer}>Founder OS · Secure actions require your approval</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({ label, value, delta }: { label: string; value: string; delta: string }) { return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricDelta}>{delta}</Text></View>; }
function Approval({ title, detail, onDone }: { title: string; detail: string; onDone: () => void }) { return <View style={styles.approval}><View style={styles.approvalIcon}><Text>✓</Text></View><View style={{ flex: 1 }}><Text style={styles.workflowName}>{title}</Text><Text style={styles.workflowDesc}>{detail}</Text></View><TouchableOpacity style={styles.approve} onPress={onDone}><Text style={styles.approveText}>Approve</Text></TouchableOpacity></View>; }

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#f7f8fb' }, container: { padding: 20, paddingBottom: 36 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }, kicker: { color: '#6d5dfc', fontSize: 10, fontWeight: '800', letterSpacing: 1.3, marginBottom: 7 }, title: { color: '#172033', fontSize: 28, fontWeight: '800', letterSpacing: -1 }, subtitle: { color: '#8991a2', fontSize: 12, marginTop: 7, maxWidth: 300, lineHeight: 18 }, avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0dcce', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#805f48', fontWeight: '800' }, statusCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e9ebf1', padding: 13, marginBottom: 13 }, statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 }, online: { backgroundColor: '#39b977' }, offline: { backgroundColor: '#f0a23b' }, statusText: { color: '#4a5568', fontSize: 11, fontWeight: '700' }, statusMeta: { color: '#9aa1b1', fontSize: 10, marginLeft: 'auto' }, metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 25 }, metric: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e9ebf1', padding: 13, width: '48.5%', minHeight: 105 }, metricLabel: { color: '#8991a2', fontSize: 10, lineHeight: 14 }, metricValue: { color: '#172033', fontSize: 21, fontWeight: '800', marginTop: 8 }, metricDelta: { color: '#36a86e', fontSize: 10, fontWeight: '700', marginTop: 5 }, sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }, sectionTitle: { color: '#172033', fontSize: 15, fontWeight: '800' }, sectionSub: { color: '#9aa1b1', fontSize: 10, marginTop: 4 }, link: { color: '#6d5dfc', fontSize: 10, fontWeight: '800' }, signalCard: { backgroundColor: '#fff', borderRadius: 13, borderWidth: 1, borderColor: '#e9ebf1', padding: 17, flexDirection: 'row', gap: 13, marginBottom: 23 }, signalIcon: { width: 31, height: 31, borderRadius: 9, backgroundColor: '#efedff', alignItems: 'center', justifyContent: 'center' }, signalLabel: { color: '#9a9ead', fontSize: 9, fontWeight: '800', letterSpacing: 1 }, signalTitle: { color: '#172033', fontSize: 16, fontWeight: '800', marginTop: 8 }, signalCopy: { color: '#8991a2', fontSize: 11, lineHeight: 16, marginVertical: 7 }, panel: { backgroundColor: '#fff', borderRadius: 13, borderWidth: 1, borderColor: '#e9ebf1', padding: 17, marginBottom: 13 }, badge: { color: '#6d5dfc', backgroundColor: '#efedff', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 7, fontSize: 10, fontWeight: '800' }, workflow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: 1, borderTopColor: '#f0f1f4', paddingVertical: 12 }, workflowIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#efedff', alignItems: 'center', justifyContent: 'center' }, workflowCopy: { flex: 1 }, workflowName: { color: '#273145', fontSize: 11, fontWeight: '800' }, workflowDesc: { color: '#969eae', fontSize: 10, marginTop: 3 }, workflowCadence: { color: '#a9afba', fontSize: 9, marginTop: 5 }, livePill: { backgroundColor: '#ecf9f1', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6 }, pausedPill: { backgroundColor: '#f0f1f4', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6 }, liveText: { color: '#32a36b', fontSize: 9, fontWeight: '800' }, pausedText: { color: '#959cac', fontSize: 9, fontWeight: '800' }, approvalCard: { backgroundColor: '#fff', borderRadius: 13, borderWidth: 1, borderColor: '#e9ebf1', padding: 17, marginBottom: 24 }, approvalCount: { color: '#6d5dfc', backgroundColor: '#efedff', width: 23, height: 23, borderRadius: 12, textAlign: 'center', paddingTop: 5, fontSize: 10, fontWeight: '800' }, approval: { flexDirection: 'row', alignItems: 'center', gap: 9, borderTopWidth: 1, borderTopColor: '#f0f1f4', paddingVertical: 12 }, approvalIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#e8f7ee', alignItems: 'center', justifyContent: 'center' }, approve: { backgroundColor: '#6d5dfc', borderRadius: 7, paddingHorizontal: 9, paddingVertical: 7 }, approveText: { color: '#fff', fontSize: 9, fontWeight: '800' }, toast: { backgroundColor: '#20283a', borderRadius: 9, padding: 12, marginBottom: 15 }, toastText: { color: '#fff', fontSize: 11, fontWeight: '700' }, footer: { color: '#adb3bf', fontSize: 10, textAlign: 'center', marginTop: 2 } });
