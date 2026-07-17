import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseURL=process.env.BASE_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();
  const failures=[];
  page.on('pageerror',error=>failures.push(`pageerror: ${error.stack||error.message}`));
  page.on('console',message=>{if(message.type()==='error')failures.push(`console.error: ${message.text()}`);});
  page.on('requestfailed',request=>failures.push(`requestfailed: ${request.url()} — ${request.failure()?.errorText||'unknown'}`));
  await page.goto(baseURL,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('loading')?.classList.contains('hidden')&&game?.mode==='title'&&window.SAKURA_SPRITE_CLEANUP?.processed,null,{timeout:25000});

  const compositor=await page.evaluate(()=>validateAnimeSpriteCleanupV18());
  if(!compositor.valid||compositor.frames!==576||!compositor.realArtwork||compositor.proceduralReplacement)throw new Error(`Real sprite compositor is not active: ${JSON.stringify(compositor)}`);

  const gameBox=await page.locator('#game').boundingBox();
  await page.mouse.click(gameBox.x+800/960*gameBox.width,gameBox.y+155/540*gameBox.height);
  await page.locator('#creator:not(.hidden)').waitFor({timeout:5000});
  await page.locator('#nameInput').fill('Sprite QA');
  await page.locator('#confirmName').click();
  await page.waitForFunction(()=>game.mode==='play',null,{timeout:5000});
  for(let cycle=0;cycle<70;cycle++){
    if(await page.evaluate(()=>Boolean(game.dialogue))){await page.keyboard.press('Space');await page.waitForTimeout(80);continue;}
    await page.waitForTimeout(120);
    if(!await page.evaluate(()=>Boolean(game.dialogue)))break;
  }
  await page.waitForTimeout(500);

  const renderedHealth=await page.locator('#game').evaluate(canvas=>{
    const actors=[...game.npcs,...game.teachers,game.player].map(actor=>({x:Math.round(actor.x-game.camera.x-31),y:Math.round(actor.y-game.camera.y-86)})).filter(actor=>actor.x>-62&&actor.x<VIEW_W&&actor.y>-86&&actor.y<H);
    const context=canvas.getContext('2d',{willReadFrequently:true});
    const samples=[];
    for(const actor of actors){
      const x=Math.max(0,actor.x),y=Math.max(0,actor.y),w=Math.min(62,canvas.width-x),h=Math.min(86,canvas.height-y);
      if(w<30||h<40)continue;
      const pixels=context.getImageData(x,y,w,h).data;
      let nearBlack=0,colourful=0,transitions=0,previous=-1;
      for(let offset=0;offset<pixels.length;offset+=4){
        const r=pixels[offset],g=pixels[offset+1],b=pixels[offset+2];
        if(r<18&&g<18&&b<18)nearBlack++;
        if(Math.max(r,g,b)-Math.min(r,g,b)>18)colourful++;
        const light=r+g+b;if(previous>=0&&Math.abs(light-previous)>40)transitions++;previous=light;
      }
      const total=pixels.length/4;
      samples.push({nearBlackRatio:nearBlack/total,colourfulRatio:colourful/total,transitions});
    }
    return {actors:actors.length,samples,maxNearBlack:Math.max(0,...samples.map(sample=>sample.nearBlackRatio)),averageColour:samples.reduce((sum,sample)=>sum+sample.colourfulRatio,0)/Math.max(1,samples.length)};
  });
  if(renderedHealth.actors<4||renderedHealth.samples.length<4)throw new Error(`Too few real actors rendered for validation: ${JSON.stringify(renderedHealth)}`);
  if(renderedHealth.maxNearBlack>.48||renderedHealth.averageColour<.12)throw new Error(`Rendered actors still contain rectangular atlas backdrops: ${JSON.stringify(renderedHealth)}`);

  await page.screenshot({path:'test-results/sprite-transparency-desktop.png',fullPage:true});
  if(failures.length)throw new Error(`Sprite QA captured ${failures.length} browser failure(s):\n${failures.join('\n')}`);
  console.log('Anime sprite compositing passed',JSON.stringify({compositor,renderedHealth}));
  await context.close();
}finally{await browser.close();}
