import { mkdir } from 'node:fs/promises';
import { chromium, firefox, webkit } from 'playwright';

const baseURL=process.env.BASE_URL||'http://127.0.0.1:4173';
await mkdir('test-results/engines',{recursive:true});
const targets=[
  {label:'chromium',browserType:chromium,options:{},context:{viewport:{width:1366,height:768}}},
  {label:'chrome',browserType:chromium,options:{channel:'chrome'},context:{viewport:{width:1366,height:768}}},
  {label:'edge',browserType:chromium,options:{channel:'msedge'},context:{viewport:{width:1366,height:768}}},
  {label:'firefox',browserType:firefox,options:{},context:{viewport:{width:1366,height:768}}},
  {label:'webkit-desktop',browserType:webkit,options:{},context:{viewport:{width:1366,height:768}}},
  {label:'webkit-mobile',browserType:webkit,options:{},context:{viewport:{width:844,height:390},isMobile:true,hasTouch:true,deviceScaleFactor:2}}
];
async function canvasHealth(page){return page.locator('#game').evaluate(element=>{const data=element.getContext('2d').getImageData(0,0,element.width,element.height).data;let opaque=0,variation=0,last=-1;for(let index=0;index<data.length;index+=128){if(data[index+3])opaque++;const value=data[index]+data[index+1]+data[index+2];if(last>=0&&Math.abs(value-last)>20)variation++;last=value;}return{opaque,variation};});}
async function waitForPaint(page,label){await page.waitForFunction(()=>{const element=document.getElementById('game'),context=element?.getContext('2d');if(!context)return false;const data=context.getImageData(0,0,element.width,element.height).data;let opaque=0,variation=0,last=-1;for(let index=0;index<data.length;index+=128){if(data[index+3])opaque++;const value=data[index]+data[index+1]+data[index+2];if(last>=0&&Math.abs(value-last)>20)variation++;last=value;}return opaque>=1500&&variation>=200;},null,{timeout:15000}).catch(async error=>{throw new Error(`${label} did not produce a painted game canvas: ${JSON.stringify(await canvasHealth(page))}. ${error.message}`);});}
const results=[];
for(const target of targets){
  const errors=[];const browser=await target.browserType.launch({headless:true,...target.options});
  try{
    const context=await browser.newContext(target.context);const page=await context.newPage();
    page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
    page.on('console',message=>{if(message.type()==='error')errors.push(`console.error: ${message.text()}`);});
    page.on('requestfailed',request=>errors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText||''}`));
    await page.goto(baseURL,{waitUntil:'networkidle',timeout:30000});
    await page.waitForFunction(()=>document.getElementById('loading')?.classList.contains('hidden')&&window.SAKURA_RELEASE?.version==='1.8.0',null,{timeout:20000});
    await waitForPaint(page,`${target.label} title`);
    const boot=await page.evaluate(()=>({release:window.SAKURA_RELEASE?.version,saveVersion:CURRENT_SAVE_VERSION,readiness:validateReleaseReadiness(),anime:validateAnimeArtV18(),canvas:{width:canvas.width,height:canvas.height},scripts:[...document.scripts].map(script=>script.getAttribute('src')).filter(Boolean).length}));
    if(boot.release!=='1.8.0'||boot.saveVersion!==10||!boot.readiness.valid||!boot.anime.valid||boot.anime.externalRuntimeDependency!==false||boot.anime.proceduralFallbacks!==false||boot.canvas.width!==960||boot.canvas.height!==540||boot.scripts<32)throw new Error(`${target.label} boot validation failed: ${JSON.stringify(boot)}`);
    const artResponses=await Promise.all(['keyart.webp','campus.webp','characters.webp','portraits.webp','objects.webp'].map(name=>page.request.get(`${baseURL}/assets/anime/${name}`)));
    if(artResponses.some(response=>!response.ok()))throw new Error(`${target.label} could not load all permanent anime assets.`);
    await page.evaluate(()=>{resetGame();game.mode='play';game.player.name='Engine QA';game.player.gender='girl';game.player.club='tech';game.player.socialStatus='ordinary';initializeSocialStatus();writeSave(localStorage,gameSnapshot());openAccessibility(0);});
    await page.waitForFunction(()=>game.overlay?.type==='accessibility');
    await waitForPaint(page,`${target.label} accessibility overlay`);
    await page.screenshot({path:`test-results/engines/${target.label}-accessibility.png`,fullPage:true});
    await page.evaluate(()=>{game.overlay=null;game.player.score=321;writeSave(localStorage,gameSnapshot());});
    await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>document.getElementById('loading')?.classList.contains('hidden'));
    const loaded=await page.evaluate(()=>({loaded:loadGame(),name:game.player.name,score:game.player.score,club:game.player.club,recovery:getSaveRecoveryReport()}));
    if(!loaded.loaded||loaded.name!=='Engine QA'||loaded.score!==321||loaded.club!=='tech'||loaded.recovery.failures.length)throw new Error(`${target.label} save/load failed: ${JSON.stringify(loaded)}`);
    await waitForPaint(page,`${target.label} loaded game`);
    const health=await canvasHealth(page);
    if(health.opaque<1500||health.variation<200)throw new Error(`${target.label} canvas health failed: ${JSON.stringify(health)}`);
    if(errors.length)throw new Error(`${target.label} emitted browser errors: ${errors.join(' | ')}`);
    results.push({label:target.label,canvasHealth:health,release:boot.release});await context.close();
  }finally{await browser.close();}
}
console.log(`Multi-engine v1.8 browser QA passed: ${results.map(result=>result.label).join(', ')}.`);
