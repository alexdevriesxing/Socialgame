// Expanded World v1.4 polish — preserve trip context when entering nested world screens.
function worldReturnContext(){
  const overlay=game.overlay||{};
  return {locationId:overlay.returnLocation||overlay.locationId||null,weekend:Boolean(overlay.returnWeekend??overlay.weekend)};
}

openGiftShop=function(returnLocation=null){
  ensureWorldState();
  const context=worldReturnContext();
  game.overlay={type:'giftShop',title:'Gift & Lifestyle Shop',returnLocation:returnLocation||context.locationId,returnWeekend:context.weekend,page:0};
};

openGiftSelect=function(npcId,returnLocation=null){
  ensureWorldState();
  const context=worldReturnContext();
  game.overlay={type:'giftSelect',title:'Choose a Gift',npcId,returnLocation:returnLocation||context.locationId,returnWeekend:context.weekend};
};

openNpcProfile=function(npcId,returnLocation=null){
  ensureWorldState();
  const context=worldReturnContext();
  game.overlay={type:'npcProfile',title:'Friend Profile',npcId,returnLocation:returnLocation||context.locationId,returnWeekend:context.weekend};
};

worldBackToLocation=function(locationId,weekend=false){
  ensureWorldState();
  const context=worldReturnContext();
  const target=locationId||context.locationId;
  const isWeekend=Boolean(weekend||context.weekend);
  if(!target){openWorldMap({weekend:isWeekend});return;}
  const location=WORLD_LOCATIONS[target];
  if(!location){openWorldMap({weekend:isWeekend});return;}
  game.overlay={type:'worldLocation',title:location.name,locationId:target,weekend:isWeekend,npcs:worldAvailableNpcs(target),explored:false};
};

const worldPolishPhone=drawPhoneOverlay;
drawPhoneOverlay=function(o){
  worldPolishPhone(o);
  ensureWorldState();
  const theme=customizationItem('phoneTheme',game.player.customization.phoneTheme);
  ctx.fillStyle=theme?.color||COLORS.blue;
  ctx.fillRect(82,82,796,4);
  text(`THEME • ${theme?.name||'Crest Blue'}`,82,452,10,theme?.color||COLORS.sky,true);
};

function validateWorldNavigation(){
  const beforeVisits={...game.player.worldVisits};
  const beforeTime=game.time;
  const current=game.overlay;
  game.overlay={type:'giftShop',returnLocation:'cafe',returnWeekend:true};
  worldBackToLocation('cafe');
  const valid=game.overlay?.type==='worldLocation'&&game.overlay.locationId==='cafe'&&game.overlay.weekend===true&&game.time===beforeTime&&JSON.stringify(game.player.worldVisits)===JSON.stringify(beforeVisits);
  game.overlay=current;
  return {valid,issues:valid?[]:['Nested world navigation changed time, visit counts or weekend context.']};
}
