import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const failures = [];
await mkdir('test-results', { recursive: true });

const recordPageFailures = page => {
  page.on('pageerror', error => failures.push(`pageerror: ${error.stack || error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') failures.push(`console.error: ${message.text()}`);
  });
  page.on('requestfailed', request => {
    failures.push(`requestfailed: ${request.method()} ${request.url()} — ${request.failure()?.errorText || 'unknown'}`);
  });
};

const waitForGame = async page => {
  await page.waitForFunction(() => {
    const loading = document.getElementById('loading');
    return loading?.classList.contains('hidden') && typeof game !== 'undefined' && game.mode === 'title';
  }, { timeout: 20000 });

  const canvasHealth = await page.locator('#game').evaluate(canvas => {
    const context = canvas.getContext('2d');
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let opaque = 0;
    let luminanceChanges = 0;
    let previous = -1;
    for (let i = 0; i < pixels.length; i += 64) {
      const alpha = pixels[i + 3];
      if (alpha > 0) opaque++;
      const luminance = pixels[i] + pixels[i + 1] + pixels[i + 2];
      if (previous >= 0 && Math.abs(luminance - previous) > 24) luminanceChanges++;
      previous = luminance;
    }
    return { opaque, luminanceChanges, width: canvas.width, height: canvas.height };
  });

  if (canvasHealth.width !== 960 || canvasHealth.height !== 540) {
    throw new Error(`Unexpected canvas dimensions: ${canvasHealth.width}x${canvasHealth.height}`);
  }
  if (canvasHealth.opaque < 1000 || canvasHealth.luminanceChanges < 100) {
    throw new Error(`Canvas appears blank: ${JSON.stringify(canvasHealth)}`);
  }

  const release = await page.evaluate(() => window.SAKURA_RELEASE);
  if (release?.version !== '1.1.0') throw new Error(`Unexpected release marker: ${JSON.stringify(release)}`);
};

const clickCanvas = async (page, x, y) => {
  const box = await page.locator('#game').boundingBox();
  if (!box) throw new Error('Canvas is not visible.');
  await page.mouse.click(box.x + (x / 960) * box.width, box.y + (y / 540) * box.height);
};

const clearOpeningDialogues = async page => {
  for (let cycle = 0; cycle < 8; cycle++) {
    await page.waitForTimeout(180);
    for (let press = 0; press < 6; press++) {
      const open = await page.evaluate(() => Boolean(game.dialogue));
      if (!open) break;
      await page.keyboard.press('Space');
      await page.waitForTimeout(90);
    }
    await page.waitForTimeout(180);
    const settled = await page.evaluate(() => !game.dialogue);
    if (settled) return;
  }
  throw new Error('Opening dialogue sequence did not settle.');
};

const browser = await chromium.launch({ headless: true });

try {
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const page = await desktop.newPage();
  recordPageFailures(page);

  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await waitForGame(page);
  await page.screenshot({ path: 'test-results/title-desktop.png', fullPage: true });

  await clickCanvas(page, 480, 259);
  await page.locator('#creator:not(.hidden)').waitFor({ timeout: 5000 });
  await page.locator('#nameInput').fill('QA Student');
  await page.locator('#confirmName').click();
  await page.waitForFunction(() => typeof game !== 'undefined' && game.mode === 'play', { timeout: 5000 });
  await clearOpeningDialogues(page);

  const playerState = await page.evaluate(() => ({
    name: game.player.name,
    year: game.year,
    month: game.month,
    mode: game.mode
  }));
  if (playerState.name !== 'QA Student' || playerState.year !== 1 || playerState.month !== 1 || playerState.mode !== 'play') {
    throw new Error(`New-game state is invalid: ${JSON.stringify(playerState)}`);
  }

  await page.keyboard.press('o');
  await page.waitForFunction(() => game.overlay?.type === 'accessibility', { timeout: 3000 });
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !game.overlay, { timeout: 3000 });

  await page.keyboard.press('r');
  await page.waitForFunction(() => game.overlay?.type === 'rankings', { timeout: 3000 });
  await page.screenshot({ path: 'test-results/rankings-desktop.png', fullPage: true });
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !game.overlay, { timeout: 3000 });

  await page.waitForFunction(async () => {
    if (!('serviceWorker' in navigator)) return false;
    await navigator.serviceWorker.ready;
    return true;
  }, { timeout: 15000 });

  await page.reload({ waitUntil: 'networkidle' });
  await waitForGame(page);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), { timeout: 10000 });

  await desktop.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });
  await waitForGame(page);
  await page.screenshot({ path: 'test-results/offline-desktop.png', fullPage: true });
  await desktop.setOffline(false);
  await desktop.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  });
  const mobilePage = await mobile.newPage();
  recordPageFailures(mobilePage);
  await mobilePage.goto(baseURL, { waitUntil: 'networkidle' });
  await waitForGame(mobilePage);

  const appBox = await mobilePage.locator('#app').boundingBox();
  if (!appBox || appBox.width > 391 || appBox.height > 845) {
    throw new Error(`Mobile layout escaped the viewport: ${JSON.stringify(appBox)}`);
  }
  await mobilePage.screenshot({ path: 'test-results/title-mobile.png', fullPage: true });
  await mobile.close();
} finally {
  await browser.close();
}

if (failures.length) {
  throw new Error(`Browser smoke captured ${failures.length} failure(s):\n${failures.join('\n')}`);
}

console.log('Production browser smoke passed: desktop gameplay, accessibility, rankings, service worker offline reload and mobile layout.');
