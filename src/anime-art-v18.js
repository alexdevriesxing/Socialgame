// Commercial anime-art routing v1.10 — every visible scene uses a dedicated permanent local asset.
const ANIME_ART_VERSION='1.10.0';
const ANIME_ART_PATHS=Object.freeze({
  keyart:'assets/anime/keyart.webp',
  school_maps:'assets/anime/campus.webp',
  character_atlas:'assets/anime/characters.webp',
  portraits:'assets/anime/portraits.webp',
  objects:'assets/anime/objects.webp',
  object_atlas:'assets/anime/objects.webp',
  tileset:'assets/anime/objects.webp',
  ui_icons:'assets/anime/objects.webp',
  district_map:'assets/anime/district-map.webp',
  world_locations:'assets/anime/world-locations.webp',
  event_atlas:'assets/anime/events.webp',
  rival_atlas:'assets/anime/rivals.webp',
  memory_atlas:'assets/anime/memories.webp',
  manifest:'assets/anime/manifest.json'
});
const ANIME_ART_MANIFEST=Object.freeze({
  version:ANIME_ART_VERSION,
  title:'Sakura Crest: Social Summit',
  source:'original commercial anime artwork stored inside the repository',
  proceduralFallbacks:false,
  externalRuntimeDependency:false,
  worldLocationCells:16,
  eventCells:12,
  rivalCells:12,
  memoryCells:12,
  threeWingAcademy:true,
  explicitClassroomDoors:true,
  assignedClassroomSeats:30,
  characterDirections:4,
  characterActions:['walk','idle','sit','talk','wave','read','teach','train','celebrate']
});

const legacyCreateArtSources=createArtSources;
createArtSources=function(){
  const sources=legacyCreateArtSources();
  Object.assign(sources,ANIME_ART_PATHS);
  return sources;
};

window.SAKURA_ANIME_ART=Object.freeze({
  ...ANIME_ART_MANIFEST,
  paths:ANIME_ART_PATHS,
  characterCount:16,
  animationColumns:9,
  directions:4,
  campusWings:3
});

function validateAnimeArtV18(sources=createArtSources()){
  const required=['keyart','school_maps','character_atlas','portraits','object_atlas','district_map','world_locations','event_atlas','rival_atlas','memory_atlas'];
  const missing=required.filter(key=>!sources[key]);
  const external=required.filter(key=>/^https?:\/\//i.test(sources[key]||''));
  const recycled=[
    ['event_atlas','school_maps'],['event_atlas','keyart'],
    ['rival_atlas','school_maps'],['rival_atlas','keyart'],
    ['memory_atlas','school_maps'],['memory_atlas','keyart'],
    ['world_locations','school_maps'],['district_map','school_maps']
  ].filter(([a,b])=>sources[a]===sources[b]);
  const errors=[];
  if(ANIME_ART_VERSION!=='1.10.0')errors.push('release version mismatch');
  if(missing.length)errors.push(`missing: ${missing.join(', ')}`);
  if(external.length)errors.push(`external paths: ${external.join(', ')}`);
  if(recycled.length)errors.push(`recycled scene assets: ${recycled.map(pair=>pair.join('=')).join(', ')}`);
  if(window.SAKURA_ANIME_ART.proceduralFallbacks)errors.push('procedural fallback enabled');
  if(window.SAKURA_ANIME_ART.characterCount!==16)errors.push('character atlas count');
  if(window.SAKURA_ANIME_ART.animationColumns!==9||window.SAKURA_ANIME_ART.directions!==4)errors.push('animation atlas geometry');
  return {valid:errors.length===0,errors,missing,external,recycled,...window.SAKURA_ANIME_ART};
}
