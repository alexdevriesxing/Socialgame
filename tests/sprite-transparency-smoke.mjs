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

  const atlasHealth=await page.evaluate(()=>{
    const atlas=images.character_atlas;
    const canvas=document.createElement('canvas');canvas.width=atlas.width;canvas.height=atlas.height;
    const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(atlas,0,0);
    const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
    const frameWidth=48,frameHeight=64,columns=canvas.width/frameWidth,rows=canvas.height/frameHeight;
    let minTransparent=1,maxOpaqueBlack=0,averageTransparent=0;
    for(let row=0;row<rows;row++)for(let column=0;column<columns;column++){
      let transparent=0,opaqueBlack=0;
      for(let y=0;y<frameHeight;y++)for(let x=0;x<frameWidth;x++){
        const offset=(((row*frameHeight+y)*canvas.width)+(column*frameWidth+x))*4;
        const alpha=pixels[offset+3];
        if(alpha<8)transparent++;
        else if(alpha>220&&pixels[offset]<18&&pixels[offset+1]<18&&pixels[offset+2]<18)opaqueBlack++;
      }
      const total=frameWidth*frameHeight,transparentRatio=transparent/total,blackRatio=opaqueBlack/total;
      minTransparent=Math.min(minTransparent,transparentRatio);maxOpaqueBlack=Math.max(maxOpaqueBlack,blackRatio);averageTransparent+=transparentRatio;
    }
    return {cleanup:window.SAKURA_SPRITE_CLEANUP,frames:columns*rows,minTransparent,maxOpaqueBlack,averageTransparent:averageTransparent/(columns*rows)};
  });
  if(!atlasHealth.cleanup?.processed||atlasHealth.cleanup.frames!==576||atlasHealth.cleanup.removedPixels<120000)throw new Error(`Sprite cleanup did not process the real atlas: ${JSON.stringify(atlasHealth)}`);
  if(atlasHealth.frames!==576||atlasHealth.minTransparent<.08||atlasHealth.averageTransparent<.25||atlasHealth.maxOpaqueBlack>.42)throw new Error(`Sprite atlas still contains rectangular backgrounds: ${JSON.stringify(atlasHealth)}`);

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
  await page.waitForTimeout(400);
  const visibleActors=await page.evaluate(()=>[...game.npcs,...game.teachers,game.player].filter(actor=>{const x=actor.x-game.camera.x,y=actor.y-game.camera.y;return x>-80&&x<VIEW_W+80&&y>-120&&y<H+80;}).length);
  if(visibleActors<4)throw new Error(`Too few real actors rendered for visual validation: ${visibleActors}`);
  await page.screenshot({path:'test-results/sprite-transparency-desktop.png',fullPage:true});
  if(failures.length)throw new Error(`Sprite QA captured ${failures.length} browser failure(s):\n${failures.join('\n')}`);
  console.log('Anime sprite transparency passed',JSON.stringify({atlasHealth,visibleActors}));
  await context.close();
}finally{await browser.close();}
