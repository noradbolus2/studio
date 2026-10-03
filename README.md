# OSO App

This is a NextJS starter for the OSO App.

To get started, take a look at src/app/page.tsx.

## Founder OS

The startup automation command center is available at `/founder-command-center`.
It is a focused founder workspace for metrics, repeatable workflows, approvals,
and agent activity. The integration-ready API surface is available at
`/api/startup-agent`:

- `GET` returns the available startup-agent tools.
- `POST` accepts `get_startup_snapshot`, `list_workflows`, `draft_workflow`, and
  `approve_action` tool requests.

Consequential actions intentionally return `requiresApproval: true`; connect
provider MCPs (CRM, email, calendar, payments) behind this contract as they are
enabled rather than granting the agent unrestricted execution.

## Android app

The Expo Android companion lives in `mobile/`. It reads Firebase client config
from environment variables and is built as an installable APK through the
GitHub Actions workflow `.github/workflows/android-apk.yml`. See
`mobile/README.md` for the Firebase and GitHub secret names. Never commit
Firebase service-account keys or other server-side secrets.
