import { NextRequest, NextResponse } from 'next/server';

/**
 * Lightweight MCP-shaped contract for the Founder OS.
 * Real connectors can be attached behind these tools without changing the UI.
 * Consequential tools intentionally return `requiresApproval: true`.
 */
const tools = [
  {
    name: 'get_startup_snapshot',
    description: 'Return current founder metrics, risks, approvals and agent activity.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'list_workflows',
    description: 'List repeatable startup workflows and their run status.',
    inputSchema: { type: 'object', properties: { status: { type: 'string' } }, additionalProperties: false },
  },
  {
    name: 'draft_workflow',
    description: 'Turn a founder request into a safe workflow draft for review.',
    inputSchema: { type: 'object', required: ['request'], properties: { request: { type: 'string' } }, additionalProperties: false },
  },
  {
    name: 'approve_action',
    description: 'Approve a consequential action after the founder has reviewed it.',
    inputSchema: { type: 'object', required: ['approvalId'], properties: { approvalId: { type: 'string' } }, additionalProperties: false },
  },
];

const snapshot = {
  metrics: { mrrInr: 842000, activeCustomers: 184, runwayMonths: 11.6, agentTasksThisWeek: 72 },
  approvals: 3,
  signals: [{ type: 'growth', title: 'Activation is up 8.6%' }, { type: 'risk', title: 'One tool renewal needs review' }],
  activity: ['Daily founder brief delivered', 'New lead qualified', 'Weekly growth review prepared'],
};

export async function GET() {
  return NextResponse.json({ name: 'founder-os', version: '0.1.0', tools });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.tool !== 'string') {
    return NextResponse.json({ error: 'Expected a JSON body with a tool name.' }, { status: 400 });
  }

  switch (body.tool) {
    case 'get_startup_snapshot':
      return NextResponse.json({ ok: true, tool: body.tool, data: snapshot });
    case 'list_workflows':
      return NextResponse.json({ ok: true, tool: body.tool, data: { workflows: ['Daily founder brief', 'Inbound lead follow-up', 'Weekly growth review', 'Runway watch'] } });
    case 'draft_workflow':
      if (typeof body.arguments?.request !== 'string' || body.arguments.request.trim().length < 8) {
        return NextResponse.json({ error: 'arguments.request must describe the workflow.' }, { status: 400 });
      }
      return NextResponse.json({ ok: true, tool: body.tool, requiresApproval: false, data: { status: 'draft', request: body.arguments.request, next: 'Review and activate from Founder OS.' } });
    case 'approve_action':
      if (!body.arguments?.approvalId) return NextResponse.json({ error: 'arguments.approvalId is required.' }, { status: 400 });
      return NextResponse.json({ ok: true, tool: body.tool, requiresApproval: true, data: { status: 'approval_required', approvalId: body.arguments.approvalId, message: 'Founder confirmation is required before execution.' } });
    default:
      return NextResponse.json({ error: `Unknown tool: ${body.tool}`, availableTools: tools.map((tool) => tool.name) }, { status: 404 });
  }
}
