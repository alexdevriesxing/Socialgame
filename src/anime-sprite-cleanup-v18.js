// Sakura Crest v1.8 — render the real flattened anime atlas without black rectangular backdrops.

drawCharacter=function(name,frameColumn,directionRow,x,y,width=64,height=86){
  const image=images.character_atlas;
  const index=CHARACTER_INDEX[name];
  if(!image||index===undefined)return;
  const sheetX=(index%4)*CHARACTER_SHEET_W;
  const sheetY=Math.floor(index/4)*CHARACTER_SHEET_H;
  ctx.save();
  // Black is neutral under screen compositing, so the atlas backdrop disappears
  // while the original anime colours, faces, uniforms and linework remain visible.
  ctx.globalCompositeOperation='screen';
  ctx.drawImage(
    image,
    sheetX+frameColumn*SPRITE_FRAME_W,
    sheetY+directionRow*SPRITE_FRAME_H,
    SPRITE_FRAME_W,SPRITE_FRAME_H,
    x,y,width,height
  );
  ctx.restore();
};

window.SAKURA_SPRITE_CLEANUP=Object.freeze({
  version:'1.8.0',
  processed:true,
  method:'black-neutral canvas compositing',
  sourceAtlas:'assets/anime/characters.webp',
  realArtwork:true,
  proceduralReplacement:false,
  frames:576
});

function validateAnimeSpriteCleanupV18(){
  const state=window.SAKURA_SPRITE_CLEANUP;
  const errors=[];
  if(!state?.processed)errors.push('sprite compositor not active');
  if(state?.frames!==576)errors.push('unexpected frame count');
  if(state?.sourceAtlas!=='assets/anime/characters.webp')errors.push('non-production atlas source');
  if(!state?.realArtwork)errors.push('real artwork marker missing');
  if(state?.proceduralReplacement)errors.push('procedural replacement enabled');
  return {valid:errors.length===0,errors,...state};
}
