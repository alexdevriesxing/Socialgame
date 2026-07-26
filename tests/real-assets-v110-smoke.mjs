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
  await page.waitForFunction(()=>document.getElementById('loading')?.classList.contains('hidden')&&game?.mode==='title',null,{timeout:25000});

  const report=await page.evaluate(()=>{
    const expected={district_map:[1536,1024],world_locations:[1536,1024],event_atlas:[800,600],rival_atlas:[800,600],memory_atlas:[800,600]};
    const dimensions={};
    for(const [name,size] of Object.entries(expected)){
      const image=images[name];
      dimensions[name]=image?[image.naturalWidth,image.naturalHeight]:null;
      if(!image||image.naturalWidth!==size[0]||image.naturalHeight!==size[1])throw new Error(`${name}: ${dimensions[name]} expected ${size}`);
    }
    const uniqueSources=new Set(Object.keys(expected).map(name=>artSources[name]));
    if(uniqueSources.size!==Object.keys(expected).length)throw new Error(`Dedicated asset sources are recycled: ${JSON.stringify(artSources)}`);

    function signatures(name,cellW,cellH,count){
      const image=images[name],canvas=document.createElement('canvas');canvas.width=48;canvas.height=32;
      const context=canvas.getContext('2d',{willReadFrequently:true}),values=[];
      for(let index=0;index<count;index++){
        const sx=(index%4)*cellW,sy=Math.floor(index/4)*cellH;
        context.clearRect(0,0,48,32);context.drawImage(image,sx,sy,cellW,cellH,0,0,48,32);
        const data=context.getImageData(0,0,48,32).data;let a=2166136261,variance=0,prev=0;
        for(let i=0;i<data.length;i+=16){const value=data[i]*3+data[i+1]*5+data[i+2]*7;variance+=Math.abs(value-prev);prev=value;a^=value;a=Math.imul(a,16777619);}
        values.push(`${a>>>0}:${Math.round(variance/100)}`);
      }
      return values;
    }
    const worldSignatures=signatures('world_locations',384,256,16);
    const eventSignatures=signatures('event_atlas',200,200,12);
    const rivalSignatures=signatures('rival_atlas',200,200,12);
    const memorySignatures=signatures('memory_atlas',200,200,12);
    if(new Set(worldSignatures.slice(0,14)).size<14)throw new Error(`World atlas repeats cells: ${worldSignatures}`);
    if(new Set(eventSignatures).size<10)throw new Error(`Event atlas lacks distinct scenes: ${eventSignatures}`);
    if(new Set(rivalSignatures).size<10)throw new Error(`Rival atlas lacks distinct scenes: ${rivalSignatures}`);
    if(new Set(memorySignatures).size<10)throw new Error(`Memory atlas lacks distinct scenes: ${memorySignatures}`);
    const validation=validateRealAssetCompletionV110();
    if(!validation.valid)throw new Error(`Real-asset validation failed: ${JSON.stringify(validation)}`);
    return {dimensions,worldUnique:new Set(worldSignatures).size,eventUnique:new Set(eventSignatures).size,rivalUnique:new Set(rivalSignatures).size,memoryUnique:new Set(memorySignatures).size,validation};
  });

  await page.evaluate(()=>{game.overlay={type:'world',title:'Sakura District',weekend:true};game.mode='play';});
  await page.waitForTimeout(350);
  await page.screenshot({path:'test-results/real-assets-world-map.png',fullPage:true});

  await page.evaluate(()=>{game.overlay=null;visitWorldLocation('arcade',{weekend:true});});
  await page.waitForFunction(()=>game.walkable?.active&&game.walkable.locationId==='arcade');
  await page.waitForTimeout(350);
  await page.screenshot({path:'test-results/real-assets-arcade.png',fullPage:true});

  if(failures.length)throw new Error(`Browser failures:\n${failures.join('\n')}`);
  console.log('Dedicated real-asset release passed',JSON.stringify(report));
  await context.close();
}finally{await browser.close();}
