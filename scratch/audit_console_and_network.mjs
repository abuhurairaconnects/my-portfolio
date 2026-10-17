import { spawn } from 'child_process';
import fs from 'fs';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function auditBrowser() {
  console.log('Starting Headless Chrome for Deep Console & Network Audit...');
  const chrome = spawn('google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,950',
    'about:blank',
  ]);

  await sleep(1500);

  const errors = [];
  const networkFailures = [];
  const warnings = [];

  try {
    const listRes = await fetch('http://127.0.0.1:9223/json');
    const targets = await listRes.json();
    const pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) throw new Error('No target page');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.method === 'Console.messageAdded') {
        const m = msg.params.message;
        if (m.level === 'error') {
          errors.push({ type: 'ConsoleError', text: m.text, url: m.url, line: m.line });
        } else if (m.level === 'warning') {
          warnings.push({ type: 'ConsoleWarning', text: m.text });
        }
      }

      if (msg.method === 'Runtime.exceptionThrown') {
        errors.push({
          type: 'UncaughtException',
          details: msg.params.exceptionDetails?.text || 'Exception',
          desc: msg.params.exceptionDetails?.exception?.description || '',
        });
      }

      if (msg.method === 'Network.responseReceived') {
        const resp = msg.params.response;
        if (resp.status >= 400) {
          networkFailures.push({ url: resp.url, status: resp.status, statusText: resp.statusText });
        }
      }

      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };

    await new Promise((resolve) => (ws.onopen = resolve));

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Console.enable');
    await send('Network.enable');

    const routes = [
      '/',
      '/about',
      '/services',
      '/projects',
      '/contact',
      '/hire',
      '/admin',
    ];

    for (const route of routes) {
      console.log(`Auditing route: http://localhost:3000${route}...`);
      await send('Page.navigate', { url: `http://localhost:3000${route}` });
      await sleep(2000);

      // Check if page rendered content or blank
      const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
          return {
            title: document.title,
            bodyLength: document.body.innerText.length,
            hasContent: document.body.innerText.length > 50,
            first50Chars: document.body.innerText.slice(0, 50).replace(/\\n/g, ' ')
          };
        })()`,
        returnByValue: true,
      });
      console.log(`  -> Render Check:`, evalRes.result?.value);
    }

    console.log('\n--- AUDIT RESULTS ---');
    console.log('Total Console Errors:', errors.length);
    if (errors.length > 0) {
      console.log('Errors:', JSON.stringify(errors, null, 2));
    }

    console.log('Total Network Failures (>=400):', networkFailures.length);
    if (networkFailures.length > 0) {
      console.log('Network Failures:', JSON.stringify(networkFailures, null, 2));
    }

    console.log('Total Warnings:', warnings.length);
    if (warnings.length > 0) {
      console.log('Warnings:', JSON.stringify(warnings, null, 2));
    }

    fs.writeFileSync(
      '/home/abu-huraira/.gemini/antigravity/brain/df3dd0f6-95bc-4cdc-b493-7ea8d37cdc8a/deep_audit_results.json',
      JSON.stringify({ errors, networkFailures, warnings }, null, 2),
      'utf-8'
    );

    ws.close();
  } finally {
    chrome.kill('SIGTERM');
  }
}

auditBrowser().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
