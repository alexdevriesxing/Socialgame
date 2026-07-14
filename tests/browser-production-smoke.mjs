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
  if (release?.version !== '1.4.0') throw new Error(`Unexpected release marker: ${JSON.stringify(release)}`);
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

  const releaseCoverage = await page.evaluate(() => ({
    active:validateActiveSchoolContent(),
    visual:validateActiveVisualLayout(),
    world:validateExpandedWorld(),
    navigation:validateWorldNavigation(),
    layout:window.SAKURA_VISUAL_LAYOUT
  }));
  if (!releaseCoverage.active.valid || releaseCoverage.active.subjects !== 9 || releaseCoverage.active.clubActivities !== 16 || releaseCoverage.active.seasonalEvents !== 16) {
    throw new Error(`Active School coverage is invalid: ${JSON.stringify(releaseCoverage.active)}`);
  }
  if (!releaseCoverage.visual.valid) throw new Error(`Visual safe-area validation failed: ${JSON.stringify(releaseCoverage.visual)}`);
  if (!releaseCoverage.world.valid || releaseCoverage.world.locations !== 13 || releaseCoverage.world.profiles !== 10 || releaseCoverage.world.scenes !== 30 || releaseCoverage.world.customizationCategories !== 8) {
    throw new Error(`Expanded World coverage is invalid: ${JSON.stringify(releaseCoverage.world)}`);
  }
  if (!releaseCoverage.navigation.valid) throw new Error(`World navigation validation failed: ${JSON.stringify(releaseCoverage.navigation)}`);
  await page.screenshot({ path: 'test-results/title-desktop.png', fullPage: true });

  await clickCanvas(page, 731, 249);
  await page.locator('#creator:not(.hidden)').waitFor({ timeout: 5000 });
  await page.locator('#nameInput').fill('QA Student');
  await page.locator('#confirmName').click();
  await page.waitForFunction(() => typeof game !== 'undefined' && game.mode === 'play', { timeout: 5000 });
  await clearOpeningDialogues(page);

  const playerState = await page.evaluate(() => ({
    name: game.player.name,
    year: game.year,
    month: game.month,
    mode: game.mode,
    routineCoverage: validateCampusRoutines(),
    activityAssist:game.player.activityAssist,
    wallet:game.player.wallet,
    customization:Object.keys(game.player.customization||{}).length,
    saveVersion:CURRENT_SAVE_VERSION
  }));
  if (playerState.name !== 'QA Student' || playerState.year !== 1 || playerState.month !== 1 || playerState.mode !== 'play') {
    throw new Error(`New-game state is invalid: ${JSON.stringify(playerState)}`);
  }
  if (!playerState.routineCoverage.valid || playerState.routineCoverage.studentPeriods !== 110 || playerState.routineCoverage.teacherPeriods !== 44) {
    throw new Error(`Living Campus coverage is invalid: ${JSON.stringify(playerState.routineCoverage)}`);
  }
  if (playerState.activityAssist !== true || playerState.wallet !== 1200 || playerState.customization !== 8 || playerState.saveVersion !== 9) {
    throw new Error(`v1.4 player state is invalid: ${JSON.stringify(playerState)}`);
  }

  await page.screenshot({ path: 'test-results/live-hud-desktop.png', fullPage: true });

  const beforeMovement = await page.evaluate(() => Object.fromEntries(game.npcs.map(npc => [npc.id, { x:npc.x, y:npc.y }])));
  await page.evaluate(() => {
    game.time = 510;
    game.lastSlot = null;
    checkSchedule();
  });
  await page.waitForTimeout(900);
  const afterMovement = await page.evaluate(() => ({
    positions:Object.fromEntries(game.npcs.map(npc => [npc.id, { x:npc.x, y:npc.y, state:npc.campus?.state, room:npc.campus?.room }])),
    finite:[...game.npcs,...game.teachers].every(actor => Number.isFinite(actor.x) && Number.isFinite(actor.y)),
    valid:[...game.npcs,...game.teachers].every(actor => Boolean(ROOMS[actor.campus?.room]))
  }));
  const moved = Object.keys(beforeMovement).some(id => Math.hypot(afterMovement.positions[id].x-beforeMovement[id].x, afterMovement.positions[id].y-beforeMovement[id].y) > 2);
  if (!moved || !afterMovement.finite || !afterMovement.valid) {
    throw new Error(`Living Campus movement failed: ${JSON.stringify(afterMovement)}`);
  }

  await page.keyboard.press('c');
  await page.waitForFunction(() => game.overlay?.type === 'livingCampus', { timeout: 3000 });
  await page.screenshot({ path: 'test-results/campus-desktop.png', fullPage: true });
  await page.keyboard.press('c');
  await page.waitForFunction(() => !game.overlay, { timeout: 3000 });

  await page.keyboard.press('g');
  await page.waitForFunction(() => game.overlay?.type === 'activityLab', { timeout: 3000 });
  await page.screenshot({ path: 'test-results/activity-lab-desktop.png', fullPage: true });
  await page.evaluate(() => { game.overlay=null; startActiveSchoolActivity('math',{practice:true}); activeBegin(); });
  await page.waitForFunction(() => game.overlay?.type === 'activeGame' && game.overlay.phase === 'active', { timeout: 3000 });
  await page.screenshot({ path: 'test-results/active-math-desktop.png', fullPage: true });
  await page.evaluate(() => {
    while(game.overlay?.type==='activeGame'&&game.overlay.phase!=='result'){
      if(game.overlay.phase==='active')activeDecisionAnswer(game.overlay.questions[game.overlay.round].correct);
      if(game.overlay.phase==='feedback')activeNextDecision();
    }
  });
  const activeResult = await page.evaluate(() => ({phase:game.overlay?.phase,score:game.overlay?.score,best:game.player.activityBest.math,mastery:game.player.subjectMastery.math}));
  if (activeResult.phase !== 'result' || activeResult.score !== 100 || activeResult.best !== 100 || activeResult.mastery < 1) {
    throw new Error(`Active mathematics result failed: ${JSON.stringify(activeResult)}`);
  }
  await page.screenshot({ path: 'test-results/activity-result-desktop.png', fullPage: true });
  await page.evaluate(() => activeExitResult());

  await page.evaluate(() => { game.time=850;game.overlay=null;game.dialogue=null;openWorldMap({weekend:true}); });
  await page.waitForFunction(() => game.overlay?.type === 'worldMap', { timeout: 3000 });
  await page.screenshot({ path: 'test-results/world-map-desktop.png', fullPage: true });

  await page.evaluate(() => visitWorldLocation('cafe',{weekend:true}));
  await page.waitForFunction(() => game.overlay?.type === 'worldLocation' && game.overlay.locationId === 'cafe', { timeout: 3000 });
  const locationState = await page.evaluate(() => ({visits:game.player.worldVisits.cafe,npcs:game.overlay.npcs.length,time:game.time}));
  if (locationState.visits !== 1 || locationState.npcs < 1 || locationState.time !== 850) throw new Error(`Weekend world visit failed: ${JSON.stringify(locationState)}`);
  await page.screenshot({ path: 'test-results/world-cafe-desktop.png', fullPage: true });

  await page.evaluate(() => openGiftShop('cafe'));
  await page.waitForFunction(() => game.overlay?.type === 'giftShop', { timeout: 3000 });
  await page.screenshot({ path: 'test-results/gift-shop-desktop.png', fullPage: true });
  const nestedNavigation = await page.evaluate(() => {
    const before={time:game.time,visits:game.player.worldVisits.cafe};
    worldBackToLocation('cafe');
    return {type:game.overlay?.type,location:game.overlay?.locationId,weekend:game.overlay?.weekend,time:game.time,visits:game.player.worldVisits.cafe,before};
  });
  if (nestedNavigation.type !== 'worldLocation' || nestedNavigation.location !== 'cafe' || !nestedNavigation.weekend || nestedNavigation.time !== nestedNavigation.before.time || nestedNavigation.visits !== nestedNavigation.before.visits) {
    throw new Error(`Nested world navigation failed: ${JSON.stringify(nestedNavigation)}`);
  }

  await page.evaluate(() => openHomeHub());
  await page.waitForFunction(() => game.overlay?.type === 'homeHub', { timeout: 3000 });
  await page.screenshot({ path: 'test-results/bedroom-desktop.png', fullPage: true });

  await page.evaluate(() => openCustomization('hair'));
  await page.waitForFunction(() => game.overlay?.type === 'customization', { timeout: 3000 });
  await page.screenshot({ path: 'test-results/customization-desktop.png', fullPage: true });
  const customState = await page.evaluate(() => {
    game.player.wallet=5000;
    buyOrEquipCustomization('hair','sakura');
    writeSave(localStorage,gameSnapshot());
    const saved=readSave(localStorage);
    return {equipped:game.player.customization.hair,owned:game.player.ownedCustomization.hair.includes('sakura'),saved:saved.player.customization.hair};
  });
  if (customState.equipped !== 'sakura' || !customState.owned || customState.saved !== 'sakura') throw new Error(`Customization persistence failed: ${JSON.stringify(customState)}`);

  await page.evaluate(() => openCollectionBook());
  await page.waitForFunction(() => game.overlay?.type === 'collectionBook', { timeout: 3000 });
  const collectionState = await page.evaluate(() => {
    game.player.collectibles=[];game.player.collectionDates={};
    const first=grantCollectible('badge-explorer','Browser QA');
    const second=grantCollectible('badge-explorer','Duplicate QA');
    return {first,second,count:game.player.collectibles.filter(id=>id==='badge-explorer').length,total:game.player.collectibles.length};
  });
  if (!collectionState.first || collectionState.second || collectionState.count !== 1 || collectionState.total !== 1) throw new Error(`Duplicate collection guard failed: ${JSON.stringify(collectionState)}`);
  await page.screenshot({ path: 'test-results/collection-book-desktop.png', fullPage: true });
  await page.evaluate(() => {game.overlay=null;game.notifications=[];});

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

  const portrait = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  });
  const portraitPage = await portrait.newPage();
  recordPageFailures(portraitPage);
  await portraitPage.goto(baseURL, { waitUntil: 'networkidle' });
  await waitForGame(portraitPage);
  const orientation = await portraitPage.locator('#orientation-hint').evaluate(element => ({
    display:getComputedStyle(element).display,
    text:element.textContent,
    box:element.getBoundingClientRect().toJSON()
  }));
  if (orientation.display === 'none' || !orientation.text.includes('Rotate your device') || orientation.box.width < 380 || orientation.box.height < 830) {
    throw new Error(`Portrait orientation guidance failed: ${JSON.stringify(orientation)}`);
  }
  await portraitPage.screenshot({ path: 'test-results/title-mobile-portrait.png', fullPage: true });
  await portrait.close();

  const landscape = await browser.newContext({
    viewport: { width: 844, height: 390 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  });
  const landscapePage = await landscape.newPage();
  recordPageFailures(landscapePage);
  await landscapePage.goto(baseURL, { waitUntil: 'networkidle' });
  await waitForGame(landscapePage);
  const appBox = await landscapePage.locator('#app').boundingBox();
  const hintDisplay = await landscapePage.locator('#orientation-hint').evaluate(element => getComputedStyle(element).display);
  if (!appBox || appBox.width > 845 || appBox.height > 391 || hintDisplay !== 'none') {
    throw new Error(`Landscape mobile layout failed: ${JSON.stringify({appBox,hintDisplay})}`);
  }
  await landscapePage.screenshot({ path: 'test-results/title-mobile-landscape.png', fullPage: true });
  await landscape.close();
} finally {
  await browser.close();
}

if (failures.length) {
  throw new Error(`Browser smoke captured ${failures.length} failure(s):\n${failures.join('\n')}`);
}

console.log('Production browser smoke passed: Expanded World, persistent customization, gifts, duplicate-safe collections, Active School, Living Campus, offline reload and portrait/landscape mobile presentation.');
