// Sakura Crest v1.8 — permanent commercial anime asset routing.
const ANIME_ART_VERSION='1.8.0';
const ANIME_ART_PATHS=Object.freeze({
  keyart:'assets/anime/keyart.webp',
  campus:'assets/anime/campus.webp',
  characters:'assets/anime/characters.webp',
  portraits:'assets/anime/portraits.webp',
  objects:'assets/anime/objects.webp',
  manifest:'assets/anime/manifest.json'
});
const animeV18LegacyArtFactory=createArtSources;
createArtSources=function(){
  const legacy=animeV18LegacyArtFactory();
  return {
    ...legacy,
    keyart:ANIME_ART_PATHS.keyart,
    school_maps:ANIME_ART_PATHS.campus,
    portraits:ANIME_ART_PATHS.portraits,
    character_atlas:ANIME_ART_PATHS.characters,
    // Story scenes now crop real illustrated campus/key-art sources instead of generated placeholder cards.
    event_atlas:ANIME_ART_PATHS.campus,
    rival_atlas:ANIME_ART_PATHS.keyart,
    memory_atlas:ANIME_ART_PATHS.campus,
    tileset:ANIME_ART_PATHS.objects,
    ui_icons:ANIME_ART_PATHS.objects
  };
};
window.SAKURA_ANIME_ART=Object.freeze({
  version:ANIME_ART_VERSION,
  paths:ANIME_ART_PATHS,
  source:'original commercial anime artwork',
  externalRuntimeDependency:false,
  proceduralFallbacks:false,
  characterCount:16,
  animationColumns:9,
  directions:4,
  campusWings:3
});
function validateAnimeArtV18(){
  const errors=[];
  if(ANIME_ART_VERSION!=='1.8.0')errors.push('release version mismatch');
  if(Object.values(ANIME_ART_PATHS).some(path=>!/^assets\/anime\//.test(path)))errors.push('non-local art path');
  if(window.SAKURA_ANIME_ART.proceduralFallbacks)errors.push('procedural fallback enabled');
  if(window.SAKURA_ANIME_ART.characterCount!==16)errors.push('character atlas count');
  if(window.SAKURA_ANIME_ART.animationColumns!==9||window.SAKURA_ANIME_ART.directions!==4)errors.push('animation atlas geometry');
  return {valid:errors.length===0,errors,...window.SAKURA_ANIME_ART};
}
