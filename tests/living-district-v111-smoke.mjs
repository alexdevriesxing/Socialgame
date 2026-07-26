import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseURL=process.env.BASE_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  const page=await context.newPage();
  const failures=[];
  page.on('pageerror',error=>failures.push(`pageerror: ${error.stack||error.message}`));
  page.on('console',message=>{if(message.type()==='error')failures.push(`console.error: ${message.text()}`);});
  page.on('requestfailed',request=>failures.push(`requestfailed: ${request.url()} — ${request.failure()?.errorText||'unknown'}`));
  await page.goto(baseURL,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('loading')?.classList.contains('hidden')&&game?.mode==='title',null,{timeout:25000});

  const report=await page.evaluate(()=>{
    resetGame();game.mode='play';game.player.name='District QA';
    const validation=validateLivingDistrictV111();
    if(!validation.valid)throw new Error(`Living District validator failed: ${JSON.stringify(validation)}`);
    if(Object.keys(LIVING_DISTRICT_SIGNATURES).length!==14)throw new Error('Signature activity coverage is not 14.');

    game.year=1;game.month=1;game.day=1;
    wwEnter('cafe',{weekend:true,preserve:true});
    wwExplore();
    const first=livingDistrictMastery('cafe');
    game.walkable.explored=false;wwExplore();
    const repeated=livingDistrictMastery('cafe');
    if(first!==1||repeated!==1)throw new Error(`Same-day mastery farming is possible: first=${first}, repeated=${repeated}`);

    game.day=2;game.walkable.explored=false;wwExplore();
    const second=livingDistrictMastery('cafe');
    game.day=3;game.walkable.explored=false;wwExplore();
    const third=livingDistrictMastery('cafe');
    const progress=ensureLivingDistrictProgress();
    if(second!==2||third!==3||!progress.stamps.includes('cafe'))throw new Error(`District stamp progression failed: ${JSON.stringify({second,third,progress})}`);

    game.day=4;game.walkable.explored=false;wwExplore();
    game.day=5;game.walkable.explored=false;wwExplore();
    game.day=6;game.walkable.explored=false;wwExplore();
    if(livingDistrictMastery('cafe')!==6||!progress.experts.includes('cafe'))throw new Error(`Local expert progression failed: ${JSON.stringify(progress)}`);
    const snapshot=gameSnapshot();
    if(!snapshot.player?.districtProgress?.stamps?.includes('cafe'))throw new Error('District progress is missing from the serialized save snapshot.');

    const signatures=Object.fromEntries(Object.entries(LIVING_DISTRICT_SIGNATURES).map(([id,entry])=>[id,{title:entry.title,effectKeys:Object.keys(entry.effect)}]));
    if(Object.values(signatures).some(entry=>!entry.title||entry.effectKeys.length<2))throw new Error(`Signature definitions are incomplete: ${JSON.stringify(signatures)}`);
    return {validation,first,repeated,second,third,expert:livingDistrictMastery('cafe'),stampCount:progress.stamps.length,expertCount:progress.experts.length,momentCount:progress.moments.length,signatures};
  });

  for(const location of ['cafe','arcade','park','station']){
    await page.evaluate(id=>{game.overlay=null;wwEnter(id,{weekend:true,preserve:true});},location);
    await page.waitForFunction(id=>game.walkable?.active&&game.walkable.locationId===id,location);
    await page.waitForTimeout(500);
    await page.screenshot({path:`test-results/living-district-${location}.png`,fullPage:true});
  }

  const reduced=await page.evaluate(()=>{
    game.settings.reducedMotion=true;wwEnter('festival',{weekend:true,preserve:true});
    const validation=validateLivingDistrictV111();
    return {valid:validation.valid,reducedMotionAware:validation.reducedMotionAware,location:game.walkable.locationId};
  });
  if(!reduced.valid||!reduced.reducedMotionAware||reduced.location!=='festival')throw new Error(`Reduced-motion district state failed: ${JSON.stringify(reduced)}`);
  await page.waitForTimeout(250);
  await page.screenshot({path:'test-results/living-district-festival-reduced-motion.png',fullPage:true});

  if(failures.length)throw new Error(`Browser failures:\n${failures.join('\n')}`);
  console.log('Living District v1.11 passed',JSON.stringify({...report,reduced}));
  await context.close();
}finally{await browser.close();}
