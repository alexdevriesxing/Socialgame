import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL=process.env.BASE_URL||'http://127.0.0.1:4173';
const failures=[];
await mkdir('test-results',{recursive:true});

function watch(page){
  page.on('pageerror',error=>failures.push(`pageerror: ${error.stack||error.message}`));
  page.on('console',message=>{if(message.type()==='error')failures.push(`console.error: ${message.text()}`);});
  page.on('requestfailed',request=>failures.push(`requestfailed: ${request.method()} ${request.url()} — ${request.failure()?.errorText||'unknown'}`));
}
async function waitForGame(page){
  await page.waitForFunction(()=>document.getElementById('loading')?.classList.contains('hidden')&&typeof game!=='undefined'&&game.mode==='title',null,{timeout:20000});
  const health=await page.locator('#game').evaluate(canvas=>{
    const data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
    let opaque=0,changes=0,previous=-1;
    for(let i=0;i<data.length;i+=64){if(data[i+3]>0)opaque++;const light=data[i]+data[i+1]+data[i+2];if(previous>=0&&Math.abs(light-previous)>24)changes++;previous=light;}
    return {opaque,changes,width:canvas.width,height:canvas.height};
  });
  if(health.width!==960||health.height!==540||health.opaque<1000||health.changes<100)throw new Error(`Canvas health failed: ${JSON.stringify(health)}`);
  const release=await page.evaluate(()=>window.SAKURA_RELEASE);
  if(release?.version!=='1.5.0')throw new Error(`Unexpected release marker: ${JSON.stringify(release)}`);
}
async function canvasArtHealth(page,label){
  const health=await page.locator('#game').evaluate(canvas=>{
    const ctx=canvas.getContext('2d'),data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    const buckets=new Set();let transitions=0,previous=-1,opaque=0;
    for(let i=0;i<data.length;i+=128){if(data[i+3]>0)opaque++;const r=data[i]>>4,g=data[i+1]>>4,b=data[i+2]>>4,l=r+g+b;buckets.add(`${r}:${g}:${b}`);if(previous>=0&&Math.abs(l-previous)>3)transitions++;previous=l;}
    return {colors:buckets.size,transitions,opaque};
  });
  if(health.colors<80||health.transitions<350||health.opaque<2000)throw new Error(`${label} appears visually underdeveloped: ${JSON.stringify(health)}`);
  return health;
}
async function clickCanvas(page,x,y){
  const box=await page.locator('#game').boundingBox();if(!box)throw new Error('Canvas is not visible.');
  await page.mouse.click(box.x+x/960*box.width,box.y+y/540*box.height);
}
async function clearDialogues(page){
  for(let cycle=0;cycle<10;cycle++){
    for(let press=0;press<7;press++){
      if(!await page.evaluate(()=>Boolean(game.dialogue)))break;
      await page.keyboard.press('Space');await page.waitForTimeout(80);
    }
    if(await page.evaluate(()=>!game.dialogue))return;
    await page.waitForTimeout(120);
  }
  throw new Error('Opening dialogue sequence did not settle.');
}

const browser=await chromium.launch({headless:true});
try{
  const desktop=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const page=await desktop.newPage();watch(page);
  await page.goto(baseURL,{waitUntil:'networkidle'});await waitForGame(page);

  const coverage=await page.evaluate(()=>({
    active:validateActiveSchoolContent(),visual:validateActiveVisualLayout(),polish:validateVisualPolish(),
    world:validateExpandedWorld(),navigation:validateWorldNavigation(),commercialUI:validateCommercialUI(),
    commercialCampus:validateCommercialCampus(),walkable:validateWalkableWorld(),commercialWorld:validateCommercialWorldArt(),saveVersion:CURRENT_SAVE_VERSION
  }));
  if(!coverage.active.valid||coverage.active.subjects!==9||coverage.active.clubActivities!==16)throw new Error(`Active School coverage failed: ${JSON.stringify(coverage.active)}`);
  if(!coverage.visual.valid||!coverage.polish.valid)throw new Error(`Visual validation failed: ${JSON.stringify(coverage)}`);
  if(!coverage.world.valid||coverage.world.locations!==13||coverage.world.profiles!==10||coverage.world.scenes!==30||coverage.world.customizationCategories!==8)throw new Error(`World coverage failed: ${JSON.stringify(coverage.world)}`);
  if(!coverage.navigation.valid||coverage.saveVersion!==9)throw new Error(`World navigation/save validation failed: ${JSON.stringify(coverage)}`);
  if(!coverage.commercialUI.valid||!coverage.commercialCampus.valid||coverage.commercialCampus.placeholderMap!==false)throw new Error(`Commercial campus/UI validation failed: ${JSON.stringify(coverage)}`);
  if(!coverage.walkable.valid||coverage.walkable.maps!==14||coverage.walkable.walkableOffsite!==13||coverage.walkable.placeholderCards!==false)throw new Error(`Walkable world validation failed: ${JSON.stringify(coverage.walkable)}`);
  if(!coverage.commercialWorld.valid||coverage.commercialWorld.placeholderCards!==false||!coverage.commercialWorld.illustratedDistrict)throw new Error(`Commercial world-art validation failed: ${JSON.stringify(coverage.commercialWorld)}`);
  await canvasArtHealth(page,'Commercial title screen');
  await page.screenshot({path:'test-results/title-desktop.png',fullPage:true});

  await clickCanvas(page,731,249);
  await page.locator('#creator:not(.hidden)').waitFor({timeout:5000});
  await page.locator('#nameInput').fill('QA Student');await page.locator('#confirmName').click();
  await page.waitForFunction(()=>game.mode==='play',null,{timeout:5000});await clearDialogues(page);

  const state=await page.evaluate(()=>({
    name:game.player.name,year:game.year,month:game.month,wallet:game.player.wallet,
    customization:Object.keys(game.player.customization||{}).length,firstDay:game.player.collectibles.includes('photo-first-day'),
    routines:validateCampusRoutines()
  }));
  if(state.name!=='QA Student'||state.year!==1||state.month!==1||state.wallet!==1200||state.customization!==8||!state.firstDay||!state.routines.valid)throw new Error(`New-game v1.5 state failed: ${JSON.stringify(state)}`);
  await canvasArtHealth(page,'Illustrated academy');
  await page.screenshot({path:'test-results/academy-live-desktop.png',fullPage:true});

  const before=await page.evaluate(()=>Object.fromEntries(game.npcs.map(n=>[n.id,{x:n.x,y:n.y}])));
  await page.evaluate(()=>{game.time=510;game.lastSlot=null;checkSchedule();});await page.waitForTimeout(900);
  const motion=await page.evaluate(()=>({positions:Object.fromEntries(game.npcs.map(n=>[n.id,{x:n.x,y:n.y}])),finite:[...game.npcs,...game.teachers].every(a=>Number.isFinite(a.x)&&Number.isFinite(a.y))}));
  if(!motion.finite||!Object.keys(before).some(id=>Math.hypot(motion.positions[id].x-before[id].x,motion.positions[id].y-before[id].y)>2))throw new Error('Living Campus movement did not occur.');

  await page.evaluate(()=>openLivingCampusOverlay());await page.waitForFunction(()=>game.overlay?.type==='livingCampus');
  await page.screenshot({path:'test-results/campus-pulse-desktop.png',fullPage:true});
  await page.evaluate(()=>openActivityLab('academics'));await page.waitForFunction(()=>game.overlay?.type==='activityLab');
  await page.screenshot({path:'test-results/activity-lab-desktop.png',fullPage:true});
  await page.evaluate(()=>{game.overlay=null;startActiveSchoolActivity('math',{practice:true});activeBegin();});
  await page.waitForFunction(()=>game.overlay?.type==='activeGame'&&game.overlay.phase==='active');
  await page.screenshot({path:'test-results/active-math-desktop.png',fullPage:true});
  await page.evaluate(()=>{while(game.overlay?.type==='activeGame'&&game.overlay.phase!=='result'){if(game.overlay.phase==='active')activeDecisionAnswer(game.overlay.questions[game.overlay.round].correct);if(game.overlay.phase==='feedback')activeNextDecision();}});
  const active=await page.evaluate(()=>({phase:game.overlay?.phase,score:game.overlay?.score,best:game.player.activityBest.math}));
  if(active.phase!=='result'||active.score!==100||active.best!==100)throw new Error(`Active activity failed: ${JSON.stringify(active)}`);
  await page.screenshot({path:'test-results/activity-result-desktop.png',fullPage:true});

  await page.evaluate(()=>{game.overlay=null;game.dialogue=null;game.time=850;openWorldMap({weekend:true});});
  await page.waitForFunction(()=>game.overlay?.type==='worldMap');await canvasArtHealth(page,'Illustrated district map');
  await page.screenshot({path:'test-results/district-map-desktop.png',fullPage:true});

  await page.evaluate(()=>visitWorldLocation('cafe',{weekend:true}));await page.waitForFunction(()=>game.walkable?.active&&game.walkable.locationId==='cafe'&&!game.overlay);
  const cafe=await page.evaluate(()=>({visits:game.player.worldVisits.cafe,npcs:game.walkable.npcs.length,time:game.time,x:game.walkable.x,y:game.walkable.y}));
  if(cafe.visits!==1||cafe.npcs<1||cafe.time!==850)throw new Error(`Walkable café failed: ${JSON.stringify(cafe)}`);
  await canvasArtHealth(page,'Walkable café');await page.screenshot({path:'test-results/walkable-cafe-desktop.png',fullPage:true});

  const moved=await page.evaluate(()=>{const s=wwEnsureState(),before={x:s.x,y:s.y};keys.add('arrowleft');for(let i=0;i<4;i++)wwUpdate(.15);keys.delete('arrowleft');return {before,after:{x:s.x,y:s.y},finite:Number.isFinite(s.x)&&Number.isFinite(s.y)};});
  if(!moved.finite||Math.hypot(moved.after.x-moved.before.x,moved.after.y-moved.before.y)<4)throw new Error(`Walkable player movement failed: ${JSON.stringify(moved)}`);
  const collision=await page.evaluate(()=>{const s=wwEnsureState();s.x=440;s.y=300;keys.add('arrowright');wwUpdate(.25);keys.delete('arrowright');return {x:s.x,y:s.y};});
  if(collision.x!==440)throw new Error(`Walkable furniture collision failed: ${JSON.stringify(collision)}`);
  const npcMotion=await page.evaluate(()=>{const n=wwEnsureState().npcs[0],before=n?{x:n.x,y:n.y}:null;if(n){n.targetX=n.x+45;n.targetY=n.y;n.wait=0;for(let i=0;i<8;i++)wwUpdate(.2);}return {before,after:n?{x:n.x,y:n.y}:null};});
  if(!npcMotion.before||Math.hypot(npcMotion.after.x-npcMotion.before.x,npcMotion.after.y-npcMotion.before.y)<2)throw new Error(`Walkable NPC movement failed: ${JSON.stringify(npcMotion)}`);

  const mapIds=['home','shopping','cafe','arcade','park','public_library','cinema','sports_center','music_venue','festival','museum','study_center','convenience','station'];
  for(const id of mapIds){
    await page.evaluate(locationId=>wwEnter(locationId,{weekend:true,preserve:true}),id);
    await page.waitForFunction(locationId=>game.walkable?.active&&game.walkable.locationId===locationId,id);
    await canvasArtHealth(page,`Walkable ${id}`);
    await page.screenshot({path:`test-results/walkable-${id}.png`,fullPage:true});
  }

  await page.evaluate(()=>wwEnter('cafe',{weekend:true,preserve:true}));
  await page.evaluate(()=>openGiftShop('cafe'));await page.waitForFunction(()=>game.overlay?.type==='giftShop');
  await canvasArtHealth(page,'Illustrated gift shop');await page.screenshot({path:'test-results/illustrated-gift-shop-desktop.png',fullPage:true});
  const nested=await page.evaluate(()=>{const before={time:game.time,visits:game.player.worldVisits.cafe};worldBackToLocation('cafe',true);return {before,time:game.time,visits:game.player.worldVisits.cafe,active:game.walkable.active,location:game.walkable.locationId,weekend:game.walkable.weekend,overlay:game.overlay};});
  if(!nested.active||nested.location!=='cafe'||!nested.weekend||nested.overlay!==null||nested.time!==nested.before.time||nested.visits!==nested.before.visits)throw new Error(`Nested walkable navigation failed: ${JSON.stringify(nested)}`);

  await page.evaluate(()=>openHomeHub());await page.waitForFunction(()=>game.walkable?.active&&game.walkable.locationId==='home'&&!game.overlay);
  await page.screenshot({path:'test-results/walkable-bedroom-desktop.png',fullPage:true});
  await page.evaluate(()=>openCustomization('hair'));await page.waitForFunction(()=>game.overlay?.type==='customization');
  await canvasArtHealth(page,'Illustrated wardrobe');await page.screenshot({path:'test-results/illustrated-wardrobe-desktop.png',fullPage:true});
  const style=await page.evaluate(()=>{game.player.wallet=5000;buyOrEquipCustomization('hair','sakura');writeSave(localStorage,gameSnapshot());const saved=readSave(localStorage);return {equipped:game.player.customization.hair,owned:game.player.ownedCustomization.hair.includes('sakura'),saved:saved.player.customization.hair};});
  if(style.equipped!=='sakura'||!style.owned||style.saved!=='sakura')throw new Error(`Customization persistence failed: ${JSON.stringify(style)}`);

  await page.evaluate(()=>openCollectionBook());await page.waitForFunction(()=>game.overlay?.type==='collectionBook');
  const collection=await page.evaluate(()=>{game.player.collectibles=[];game.player.collectionDates={};const first=grantCollectible('badge-explorer','Browser QA');const second=grantCollectible('badge-explorer','Duplicate QA');return {first,second,count:game.player.collectibles.filter(id=>id==='badge-explorer').length,total:game.player.collectibles.length};});
  if(!collection.first||collection.second||collection.count!==1||collection.total!==1)throw new Error(`Duplicate collection guard failed: ${JSON.stringify(collection)}`);
  await canvasArtHealth(page,'Illustrated collection book');await page.screenshot({path:'test-results/illustrated-collection-book-desktop.png',fullPage:true});

  await page.evaluate(()=>{game.walkable.active=false;game.walkable.locationId=null;game.overlay={type:'rankings',title:'Live Social Rankings'};game.dialogue=null;game.notifications=[];});await page.waitForFunction(()=>game.overlay?.type==='rankings');
  await page.screenshot({path:'test-results/rankings-desktop.png',fullPage:true});
  await page.evaluate(()=>{game.overlay=null;});

  await page.waitForFunction(async()=>{if(!('serviceWorker'in navigator))return false;await navigator.serviceWorker.ready;return true;},null,{timeout:15000});
  await page.reload({waitUntil:'networkidle'});await waitForGame(page);
  await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller),null,{timeout:10000});
  await desktop.setOffline(true);await page.reload({waitUntil:'domcontentloaded',timeout:15000});await waitForGame(page);
  await page.screenshot({path:'test-results/offline-desktop.png',fullPage:true});await desktop.setOffline(false);await desktop.close();

  const portrait=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
  const portraitPage=await portrait.newPage();watch(portraitPage);await portraitPage.goto(baseURL,{waitUntil:'networkidle'});await waitForGame(portraitPage);
  const orientation=await portraitPage.locator('#orientation-hint').evaluate(element=>({display:getComputedStyle(element).display,text:element.textContent,box:element.getBoundingClientRect().toJSON()}));
  if(orientation.display==='none'||!orientation.text.includes('Rotate your device')||orientation.box.width<380||orientation.box.height<830)throw new Error(`Portrait guidance failed: ${JSON.stringify(orientation)}`);
  await portraitPage.screenshot({path:'test-results/title-mobile-portrait.png',fullPage:true});await portrait.close();

  const landscape=await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true,deviceScaleFactor:2});
  const landscapePage=await landscape.newPage();watch(landscapePage);await landscapePage.goto(baseURL,{waitUntil:'networkidle'});await waitForGame(landscapePage);
  const appBox=await landscapePage.locator('#app').boundingBox(),hint=await landscapePage.locator('#orientation-hint').evaluate(element=>getComputedStyle(element).display);
  if(!appBox||appBox.width>845||appBox.height>391||hint!=='none')throw new Error(`Landscape layout failed: ${JSON.stringify({appBox,hint})}`);
  await landscapePage.screenshot({path:'test-results/title-mobile-landscape.png',fullPage:true});await landscape.close();
}finally{await browser.close();}

if(failures.length)throw new Error(`Browser smoke captured ${failures.length} failure(s):\n${failures.join('\n')}`);
console.log('Production browser smoke passed: illustrated academy, fourteen commercial walkable maps, collisions, wandering NPCs, premium shops and collections, offline reload and mobile presentation with zero placeholder screens.');
