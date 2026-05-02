## 2026-05-02 Task: initialization

Issue log initialized for transaction UI/UX fixes.

## 2026-05-02 F4 QA attempt

- Blocked: dev server could not stay reachable for Playwright. Multiple `pnpm @bajes/web dev --hostname 0.0.0.0 --port 3000/3001` runs showed "Ready" but port 3000/3001 was not listening after the tool timeout; direct `Invoke-WebRequest http://localhost:3000/transactions` timed out.
- Killed all node and chrome processes, retried server start with pnpm and node binaries; port 3000 still not listening persistently.
- Playwright calls `browser_navigate http://localhost:3000/transactions` (180s) timed out twice; `browser_run_code_unsafe` to goto 127.0.0.1:3000/transactions failed with "Browser is already in use... use --isolated" after first timeout; later navigate attempts still timed out. Chrome launch logs showed repeated `DEPRECATED_ENDPOINT` and network service crash messages before exit code 255.
- Without a reachable app instance, could not verify nav spacing, subtitle date+time, modal padding, or BAJES-themed calendar/time defaults.

## 2026-05-02 Task: QA T1-T4

- Blocked: Playwright MCP calls (browser_tabs, browser_run_code_unsafe) time out consistently. Attempts: freed port 3000, restarted Next dev server, killed all chrome.exe processes, retried multiple calls. Result: timeouts and process exits with DEPRECATED_ENDPOINT warnings; cannot open /transactions to perform QA.

## 2026-05-02 F4 QA retry

- Dev server now reachable: `pnpm --filter @bajes/web dev --hostname 0.0.0.0 --port 3000` running under PID 5096; `netstat -ano | findstr 5096` shows LISTENING on 0.0.0.0:3000.
- HTTP checks: `curl -I http://localhost:3000/transactions` returns `307 Temporary Redirect` to `/login?redirect=%2Ftransactions`; `curl -I http://localhost:3000/login` returns `200 OK`.
- Playwright MCP still failing: `browser_tabs` new/list both `MCP error -32001: Request timed out`; unable to open page for the four F4 visual checks.
- Without a functioning Playwright session, nav/title spacing, subtitle date+time, modal padding, and BAJES calendar+time input cannot be observed yet.
