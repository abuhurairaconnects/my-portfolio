import { spawn } from 'child_process';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function testAnchors() {
  const chrome = spawn('google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank',
  ]);

  await sleep(1500);

  try {
    const listRes = await fetch('http://127.0.0.1:9224/json');
    const targets = await listRes.json();
    const pageTarget = targets.find((t) => t.type === 'page');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
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

    const anchorTests = [
      { url: 'http://localhost:3000/#testimonials', id: 'testimonials' },
      { url: 'http://localhost:3000/about#ethics', id: 'ethics' },
      { url: 'http://localhost:3000/services#skills', id: 'skills' },
      { url: 'http://localhost:3000/services#fullstack-web', id: 'fullstack-web' },
      { url: 'http://localhost:3000/services#ecommerce-platforms', id: 'ecommerce-platforms' },
      { url: 'http://localhost:3000/services#voice-speech-ai', id: 'voice-speech-ai' },
    ];

    console.log('Testing Footer & In-Page Anchor Targets:');
    for (const test of anchorTests) {
      await send('Page.navigate', { url: test.url });
      await sleep(1500);
      const res = await send('Runtime.evaluate', {
        expression: `Boolean(document.getElementById("${test.id}"))`,
        returnByValue: true,
      });
      const exists = res.result?.value;
      console.log(`Target #${test.id} at ${test.url}: ${exists ? 'EXISTS (VERIFIED)' : 'MISSING'}`);
    }

    ws.close();
  } finally {
    chrome.kill('SIGTERM');
  }
}

testAnchors().catch(console.error);
