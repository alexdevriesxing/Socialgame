// Sakura Crest v1.8 — remove only frame-edge backgrounds from the real anime sprite atlas.
const animeV18BaseLoadImage = loadImage;

function animeV18CleanCharacterAtlas(sourceImage){
  const output=document.createElement('canvas');
  output.width=sourceImage.naturalWidth||sourceImage.width;
  output.height=sourceImage.naturalHeight||sourceImage.height;
  const outputContext=output.getContext('2d',{willReadFrequently:true});
  outputContext.imageSmoothingEnabled=true;
  outputContext.drawImage(sourceImage,0,0);

  const imageData=outputContext.getImageData(0,0,output.width,output.height);
  const pixels=imageData.data;
  const frameColumns=Math.floor(output.width/SPRITE_FRAME_W);
  const frameRows=Math.floor(output.height/SPRITE_FRAME_H);
  const framePixels=SPRITE_FRAME_W*SPRITE_FRAME_H;
  const seen=new Uint8Array(framePixels);
  const queueX=new Int16Array(framePixels);
  const queueY=new Int16Array(framePixels);
  let removedPixels=0;

  const pixelOffset=(x,y)=>(y*output.width+x)*4;
  const colorDistance=(offset,background)=>Math.abs(pixels[offset]-background[0])+Math.abs(pixels[offset+1]-background[1])+Math.abs(pixels[offset+2]-background[2]);

  for(let frameRow=0;frameRow<frameRows;frameRow++){
    for(let frameColumn=0;frameColumn<frameColumns;frameColumn++){
      seen.fill(0);
      let head=0,tail=0;
      const originX=frameColumn*SPRITE_FRAME_W,originY=frameRow*SPRITE_FRAME_H;
      const cornerCoordinates=[[0,0],[SPRITE_FRAME_W-1,0],[0,SPRITE_FRAME_H-1],[SPRITE_FRAME_W-1,SPRITE_FRAME_H-1]];
      const background=[0,0,0];
      for(const [localX,localY] of cornerCoordinates){
        const offset=pixelOffset(originX+localX,originY+localY);
        background[0]+=pixels[offset];background[1]+=pixels[offset+1];background[2]+=pixels[offset+2];
      }
      background[0]=Math.round(background[0]/4);background[1]=Math.round(background[1]/4);background[2]=Math.round(background[2]/4);

      const enqueue=(localX,localY)=>{
        const index=localY*SPRITE_FRAME_W+localX;
        if(seen[index])return;
        seen[index]=1;queueX[tail]=localX;queueY[tail]=localY;tail++;
      };
      for(let x=0;x<SPRITE_FRAME_W;x++){enqueue(x,0);enqueue(x,SPRITE_FRAME_H-1);}
      for(let y=0;y<SPRITE_FRAME_H;y++){enqueue(0,y);enqueue(SPRITE_FRAME_W-1,y);}

      while(head<tail){
        const localX=queueX[head],localY=queueY[head];head++;
        const globalX=originX+localX,globalY=originY+localY,offset=pixelOffset(globalX,globalY);
        if(pixels[offset+3]===0)continue;
        const distance=colorDistance(offset,background);
        const luminance=pixels[offset]+pixels[offset+1]+pixels[offset+2];
        const backgroundLuminance=background[0]+background[1]+background[2];
        const matchesBackground=distance<=74||(backgroundLuminance<120&&luminance<105);
        if(!matchesBackground)continue;
        pixels[offset+3]=0;removedPixels++;
        if(localX>0)enqueue(localX-1,localY);
        if(localX+1<SPRITE_FRAME_W)enqueue(localX+1,localY);
        if(localY>0)enqueue(localX,localY-1);
        if(localY+1<SPRITE_FRAME_H)enqueue(localX,localY+1);
      }
    }
  }

  outputContext.putImageData(imageData,0,0);
  window.SAKURA_SPRITE_CLEANUP=Object.freeze({
    version:'1.8.0',processed:true,width:output.width,height:output.height,
    frames:frameColumns*frameRows,removedPixels,
    method:'per-frame connected-edge chroma cleanup',proceduralReplacement:false
  });
  return output;
}

loadImage=function(name){
  if(name!=='character_atlas')return animeV18BaseLoadImage(name);
  return new Promise((resolve,reject)=>{
    const image=new Image();
    image.onload=()=>{
      try{images[name]=animeV18CleanCharacterAtlas(image);resolve();}
      catch(error){reject(error);}
    };
    image.onerror=reject;
    image.src=artSources[name];
  });
};

function validateAnimeSpriteCleanupV18(){
  const state=window.SAKURA_SPRITE_CLEANUP;
  const errors=[];
  if(!state?.processed)errors.push('atlas not processed');
  if(state&&state.frames!==576)errors.push('unexpected frame count');
  if(state&&state.removedPixels<120000)errors.push('insufficient background removal');
  if(state?.proceduralReplacement)errors.push('procedural replacement enabled');
  return {valid:errors.length===0,errors,...state};
}
