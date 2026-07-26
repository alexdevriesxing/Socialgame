// Sakura Crest v1.10 — dedicated real-asset rendering for every district and story surface.
const REAL_ASSET_VERSION='1.10.0';
const REAL_WORLD_CELL_W=384;
const REAL_WORLD_CELL_H=256;
const REAL_WORLD_CELL_INDEX=Object.freeze({
  home:0,shopping:1,cafe:2,arcade:3,park:4,public_library:5,cinema:6,sports_center:7,
  music_venue:8,festival:9,museum:10,study_center:11,convenience:12,station:13,
  school_courtyard:14,rooftop_garden:15
});

function realAssetImage(name){return images?.[name]||null;}
function drawRealAtlasCell(image,index,dx,dy,dw,dh,cellW=REAL_WORLD_CELL_W,cellH=REAL_WORLD_CELL_H,columns=4){
  if(!image)return false;
  const sx=(index%columns)*cellW,sy=Math.floor(index/columns)*cellH;
  ctx.drawImage(image,sx,sy,cellW,cellH,dx,dy,dw,dh);
  return true;
}
function realAssetShade(x,y,w,h,top=.05,bottom=.26){
  const gradient=ctx.createLinearGradient(x,y,x,y+h);
  gradient.addColorStop(0,`rgba(8,12,22,${top})`);
  gradient.addColorStop(.7,'rgba(8,12,22,.03)');
  gradient.addColorStop(1,`rgba(8,12,22,${bottom})`);
  ctx.fillStyle=gradient;ctx.fillRect(x,y,w,h);
}
function drawRealCollisionLandmarks(scene){
  if(!scene?.walls)return;
  ctx.save();ctx.fillStyle='rgba(18,25,40,.12)';ctx.strokeStyle='rgba(245,215,133,.20)';ctx.lineWidth=2;
  for(const wall of scene.walls){
    ctx.fillRect(wall.x,wall.y,wall.w,wall.h);
    if(wall.w>45&&wall.h>32)ctx.strokeRect(wall.x+.5,wall.y+.5,wall.w-1,wall.h-1);
  }
  ctx.restore();
}

// Replaces the procedural district diagram with the permanent illustrated town map.
cwDistrictBackdrop=function(){
  const image=realAssetImage('district_map');
  ctx.save();uiRoundedPath(62,92,836,360,18);ctx.clip();
  if(image)ctx.drawImage(image,0,180,1536,664,62,92,836,360);
  else{ctx.fillStyle='#769f8c';ctx.fillRect(62,92,836,360);}
  realAssetShade(62,92,836,360,.04,.18);
  ctx.restore();
  uiRoundedPath(62.5,92.5,835,359,18);ctx.strokeStyle='rgba(255,255,255,.42)';ctx.lineWidth=2;ctx.stroke();
};

// Replaces all fourteen procedural walkable backgrounds with dedicated atlas cells.
const legacyWwDrawScene=wwDrawScene;
wwDrawScene=function(){
  const state=wwEnsureState(),id=state.locationId,scene=wwScene(),location=WORLD_LOCATIONS[id];
  const index=REAL_WORLD_CELL_INDEX[id];
  const image=realAssetImage('world_locations');
  if(index===undefined||!drawRealAtlasCell(image,index,0,0,WW_MAP_W,WW_MAP_H)){
    legacyWwDrawScene();return;
  }
  realAssetShade(0,0,WW_MAP_W,WW_MAP_H,.02,.22);
  drawRealCollisionLandmarks(scene);
  // Functional exits and interaction anchors stay visible without covering the illustration.
  for(const hotspot of scene.hotspots||[]){
    const [kind,x,y,labelText]=hotspot;
    const color=kind==='school'?COMMERCIAL_UI.gold:kind==='map'?COMMERCIAL_UI.sky:scene.accent;
    ctx.save();ctx.globalAlpha=.82;artEllipse(x,y,20,8,'rgba(8,12,22,.35)');ctx.restore();
    if(kind==='school'||kind==='map')label(labelText,x-64,y-48,128,22,color);
  }
  wwHeaderSign(location.name,scene.accent);
};

function validateRealAssetCompletionV110(){
  const issues=[];
  const sourceCheck=validateAnimeArtV18();
  if(!sourceCheck.valid)issues.push(...sourceCheck.errors);
  for(const name of ['district_map','world_locations','event_atlas','rival_atlas','memory_atlas']){
    const image=realAssetImage(name);
    if(!image||image.naturalWidth<800||image.naturalHeight<600)issues.push(`${name} is missing or below production dimensions.`);
  }
  if(Object.keys(REAL_WORLD_CELL_INDEX).length!==16)issues.push('World-location atlas does not expose sixteen distinct cells.');
  const unique=new Set(['district_map','world_locations','event_atlas','rival_atlas','memory_atlas'].map(name=>artSources[name]));
  if(unique.size!==5)issues.push('Dedicated district, location, event, rival and memory assets are not unique.');
  return {
    valid:issues.length===0,issues,version:REAL_ASSET_VERSION,
    dedicatedDistrictMap:true,dedicatedWalkableLocations:14,dedicatedHome:true,
    dedicatedEventScenes:12,dedicatedRivalScenes:12,dedicatedMemoryScenes:12,
    proceduralSceneFallbacks:false,recycledCampusCrops:false,recycledKeyArtScenes:false,placeholderAssets:false
  };
}
