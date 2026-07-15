// Commercial Art Pass v1.5 — illustrated district navigation, shops, wardrobe and collections.
const COMMERCIAL_WORLD_ART_VERSION='1.5.0';
const CW_MAP_POSITIONS={
  home:[118,368],shopping:[238,245],cafe:[370,335],arcade:[520,222],park:[665,345],public_library:[790,205],
  cinema:[846,342],sports_center:[685,205],music_venue:[526,365],festival:[390,205],museum:[235,350],study_center:[535,205],
  convenience:[720,365],station:[835,210]
};
function cwDrawPin(id,x,y,location,selected=false){
  ctx.save();ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=8;ctx.shadowOffsetY=4;ctx.fillStyle=location.color;ctx.beginPath();ctx.arc(x,y,18,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(x-9,y+13);ctx.lineTo(x,y+31);ctx.lineTo(x+9,y+13);ctx.closePath();ctx.fill();ctx.restore();
  ctx.strokeStyle=selected?COMMERCIAL_UI.paper:'rgba(255,255,255,.72)';ctx.lineWidth=selected?3:1.5;ctx.beginPath();ctx.arc(x,y,17,0,Math.PI*2);ctx.stroke();uiIcon(id==='home'?'room':id==='shopping'?'gift':id==='public_library'?'book':id==='station'?'world':'campus',x,y,17,COMMERCIAL_UI.paper);
}
function cwDistrictBackdrop(){
  const sky=ctx.createLinearGradient(50,88,50,500);sky.addColorStop(0,'#b9dce7');sky.addColorStop(1,'#6d9c9c');ctx.fillStyle=sky;uiRoundedPath(62,92,836,360,18);ctx.fill();
  ctx.save();uiRoundedPath(62,92,836,360,18);ctx.clip();
  ctx.fillStyle='#86b57e';ctx.fillRect(62,92,836,360);
  ctx.fillStyle='#7bc0d1';ctx.beginPath();ctx.moveTo(620,92);ctx.bezierCurveTo(560,180,720,230,650,452);ctx.lineTo(770,452);ctx.bezierCurveTo(820,240,690,185,760,92);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#d6c6aa';ctx.lineWidth=34;ctx.lineCap='round';const roads=[[[100,180],[350,270],[570,160],[860,260]],[[140,410],[330,330],[560,405],[840,310]],[[220,115],[235,430]],[[500,110],[515,440]],[[800,115],[790,430]]];roads.forEach(points=>{ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);points.slice(1).forEach(p=>ctx.lineTo(p[0],p[1]));ctx.stroke();});
  ctx.strokeStyle='rgba(90,70,55,.35)';ctx.lineWidth=2;roads.forEach(points=>{ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);points.slice(1).forEach(p=>ctx.lineTo(p[0],p[1]));ctx.stroke();});
  for(let i=0;i<25;i++){const x=82+(i*173)%790,y=110+(i*97)%325;ctx.fillStyle=['#d98d7d','#7b96b3','#e2b45d','#7ba686','#9d7cac'][i%5];uiRoundedPath(x,y,36+(i%3)*11,24+(i%2)*7,5);ctx.fill();}
  for(let i=0;i<18;i++)artTree(90+(i*137)%790,115+(i*79)%315,.22,seasonKey());
  ctx.restore();
  uiRoundedPath(62.5,92.5,835,359,18);ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=2;ctx.stroke();
}
drawWorldMap=function(o){
  overlayBase(o.title);ensureWorldState();cwDistrictBackdrop();
  text(`ALLOWANCE ¥${game.player.wallet}`,82,112,12,COMMERCIAL_UI.gold,true);text(`VISITED ${Object.keys(game.player.worldVisits).filter(id=>id!=='home').length}/${WORLD_OFFSITE_IDS.length}`,232,112,11,COMMERCIAL_UI.paper,true);text(`OFF-CAMPUS SCENES ${game.player.worldScenes.length}/${allWorldScenes().length}`,365,112,11,COMMERCIAL_UI.paper,true);
  const ids=['home',...WORLD_OFFSITE_IDS];
  ids.forEach(id=>{const location=WORLD_LOCATIONS[id],p=CW_MAP_POSITIONS[id],visited=Boolean(game.player.worldVisits[id]),allowed=id==='home'||o.weekend||worldTravelAllowed();cwDrawPin(id,p[0],p[1],location,visited);addButton(p[0]-42,p[1]+33,84,21,allowed?'ENTER':'LOCKED',()=>visitWorldLocation(id,{weekend:o.weekend}),allowed,false,location.color);});
  uiGlass(84,462,792,36,10,.9);text(o.weekend?'Weekend travel is free. Every destination is a complete walkable 2D map.':'Walkable district travel opens during optional periods and after 13:45.',105,485,12,COMMERCIAL_UI.cream,true);
  addButton(740,462,120,28,'CLOSE',()=>game.overlay=null,true,false,COMMERCIAL_UI.ink2);
};
function cwGiftIcon(gift,x,y,size=58){
  ctx.save();ctx.translate(x,y);ctx.shadowColor=gift.color;ctx.shadowBlur=9;ctx.fillStyle=uiGradient(-size/2,-size/2,size,size,uiMix(gift.color,25),uiMix(gift.color,-30));uiRoundedPath(-size/2,-size/2,size,size,12);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1.5;ctx.stroke();
  const c='#fff8e9';ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=2.5;
  const cat=gift.category;
  if(['tea','snack','energy'].includes(cat)){ctx.beginPath();ctx.arc(0,5,16,12,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(18,5,8,0,Math.PI*2);ctx.stroke();artLine(-13,-12,13,-12,c,2);}
  else if(['sports','practical'].includes(cat)){ctx.beginPath();ctx.arc(0,0,19,0,Math.PI*2);ctx.stroke();artLine(-16,-10,16,10,c,2);artLine(-16,10,16,-10,c,2);}
  else if(['art','fashion','perfume'].includes(cat)){ctx.beginPath();ctx.moveTo(-18,15);ctx.lineTo(0,-20);ctx.lineTo(18,15);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(0,2,6,0,Math.PI*2);ctx.stroke();}
  else if(['tech','books','history'].includes(cat)){uiRoundedPath(-20,-18,40,36,5);ctx.stroke();artLine(-12,-8,12,-8,c,2);artLine(-12,0,12,0,c,2);artLine(-12,8,6,8,c,2);}
  else{uiIcon('gift',0,0,34,c);}
  ctx.restore();
}
drawGiftShop=function(o){
  ensureWorldState();overlayBase(o.title);
  const shelf=ctx.createLinearGradient(66,105,66,442);shelf.addColorStop(0,'#7c553e');shelf.addColorStop(1,'#3e2c28');ctx.fillStyle=shelf;uiRoundedPath(66,105,828,337,14);ctx.fill();ctx.strokeStyle='#d0aa62';ctx.lineWidth=2;ctx.stroke();
  for(let row=0;row<3;row++){ctx.fillStyle='#2f2424';ctx.fillRect(76,208+row*105,808,13);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(76,208+row*105,808,3);}
  text(`GIFT & LIFESTYLE BOUTIQUE`,86,132,17,COMMERCIAL_UI.gold,true);text(`Allowance ¥${game.player.wallet}`,710,132,13,COMMERCIAL_UI.paper,true);
  GIFT_ITEMS.forEach((gift,index)=>{const col=index%4,row=Math.floor(index/4),x=86+col*198,y=147+row*105,count=game.player.giftInventory[gift.id]||0;cwGiftIcon(gift,x+34,y+31,54);text(gift.name,x+69,y+19,11,COMMERCIAL_UI.paper,true);text(gift.category.toUpperCase(),x+69,y+37,9,gift.color,true);text(`¥${gift.price} • BAG ${count}`,x+69,y+55,9,COMMERCIAL_UI.cream,true);addButton(x+69,y+63,95,22,'BUY',()=>buyGift(gift.id),true,false,gift.color);});
  addButton(250,465,210,32,'BACK TO LOCATION',()=>worldBackToLocation(o.returnLocation,o.returnWeekend));addButton(500,465,210,32,'DISTRICT MAP',()=>openWorldMap({weekend:o.returnWeekend}));
};
function cwStylePreview(category,item,x,y,w,h){
  const bg=ctx.createLinearGradient(x,y,x,y+h);bg.addColorStop(0,uiMix(item.color,30));bg.addColorStop(1,uiMix(item.color,-35));ctx.fillStyle=bg;uiRoundedPath(x,y,w,h,13);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.28)';ctx.stroke();
  if(['hair','skin','face','outfit','accessory','bag'].includes(category)){drawCharacter(game.player.gender==='boy'?'player_boy':'player_girl',3,0,x+w/2-38,y+13,76,104);ctx.globalAlpha=.75;ctx.fillStyle=item.color;uiRoundedPath(x+w/2-31,y+h-45,62,18,7);ctx.fill();ctx.globalAlpha=1;}
  else if(category==='phoneTheme'){ctx.fillStyle='#111827';uiRoundedPath(x+w/2-35,y+15,70,112,13);ctx.fill();ctx.strokeStyle=item.color;ctx.lineWidth=4;ctx.stroke();ctx.fillStyle=item.color;uiRoundedPath(x+w/2-25,y+34,50,52,7);ctx.fill();uiIcon('friends',x+w/2,y+60,24,'white');}
  else{ctx.fillStyle=item.color;artRect(x+20,y+28,w-40,h-55,item.color,'rgba(255,255,255,.5)',2,9);artRect(x+37,y+47,w-74,40,'#efe3cf','#7d654e',2,6);artPlant(x+w-43,y+h-54,.55);}
}
drawCustomization=function(o){
  ensureWorldState();overlayBase(o.title);const categories=Object.keys(CUSTOMIZATION_CATALOG),category=o.category||categories[0];
  categories.forEach((id,index)=>addButton(66+index*104,88,96,25,id.replace('phoneTheme','PHONE').replace('roomTheme','ROOM').toUpperCase(),()=>o.category=id,true,id===category,COMMERCIAL_UI.ink2));
  uiGlass(72,130,816,305,15,.88);text(`${category.toUpperCase()} STUDIO`,92,158,16,COMMERCIAL_UI.gold,true);text(`Allowance ¥${game.player.wallet}`,730,158,12,COMMERCIAL_UI.paper,true);
  CUSTOMIZATION_CATALOG[category].forEach((item,index)=>{const x=91+index*198,y=176,owned=game.player.ownedCustomization[category].includes(item.id),equipped=game.player.customization[category]===item.id;cwStylePreview(category,item,x,y,170,155);text(item.name,x+10,y+181,13,COMMERCIAL_UI.paper,true);text(owned?'OWNED':`¥${item.price}`,x+10,y+202,10,owned?COMMERCIAL_UI.mint:COMMERCIAL_UI.gold,true);addButton(x+10,y+214,150,28,equipped?'EQUIPPED':owned?'EQUIP':'BUY & EQUIP',()=>buyOrEquipCustomization(category,item.id),true,equipped,item.color);});
  addButton(365,465,230,32,game.walkable?.active?'RETURN TO AREA':'RETURN TO BEDROOM',()=>game.walkable?.active?worldBackToLocation(game.walkable.locationId,game.walkable.weekend):openHomeHub());
};
function cwCollectibleIcon(item,x,y,size=48,unlocked=false){
  const color=unlocked?COMMERCIAL_UI.gold:'#596173';ctx.save();ctx.translate(x,y);ctx.fillStyle=unlocked?'rgba(239,199,94,.13)':'rgba(70,76,92,.16)';ctx.beginPath();ctx.arc(0,0,size/2,0,Math.PI*2);ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();
  const icon=item.category==='photos'?'friends':item.category==='badges'?'rank':item.category==='trophies'?'activity':item.category==='posters'?'calendar':item.category==='memoryCards'?'book':item.category==='wallpapers'?'world':item.category==='music'?'sound':'gift';uiIcon(icon,0,0,size*.55,color);ctx.restore();
}
drawCollectionBook=function(o){
  ensureWorldState();overlayBase(o.title);const categories=COLLECTION_CATEGORIES,category=o.category||categories[0][0];
  categories.forEach(([id,label],index)=>addButton(64+index*105,88,97,25,label.split(' ')[0],()=>{o.category=id;o.page=0;},true,id===category,COMMERCIAL_UI.ink2));
  const items=COLLECTION_CATALOG.filter(item=>item.category===category),page=clamp(o.page||0,0,Math.max(0,Math.ceil(items.length/12)-1)),visible=items.slice(page*12,page*12+12);
  uiGlass(70,126,820,320,14,.88);text(`${categories.find(entry=>entry[0]===category)?.[1]}`,91,157,17,COMMERCIAL_UI.gold,true);text(`${collectionCount(category)}/${items.length} unlocked • Total ${game.player.collectibles.length}/${COLLECTION_CATALOG.length}`,590,157,11,COMMERCIAL_UI.paper,true);
  visible.forEach((item,index)=>{const col=index%4,row=Math.floor(index/4),x=91+col*198,y=176+row*84,unlocked=game.player.collectibles.includes(item.id);uiRoundedPath(x,y,178,70,10);ctx.fillStyle=unlocked?'rgba(255,255,255,.075)':'rgba(8,12,22,.34)';ctx.fill();ctx.strokeStyle=unlocked?'rgba(239,199,94,.55)':'rgba(120,128,145,.25)';ctx.stroke();cwCollectibleIcon(item,x+31,y+35,44,unlocked);wrapped(unlocked?item.name:'Undiscovered',x+61,y+24,105,11,unlocked?COMMERCIAL_UI.paper:'#7c8495',2);wrapped(unlocked?item.source:'Continue exploring Sakura Crest.',x+61,y+49,105,8,unlocked?COMMERCIAL_UI.cream:'#657080',2);});
  addButton(210,465,130,32,'PREVIOUS',()=>o.page=Math.max(0,page-1),page>0);addButton(365,465,230,32,game.walkable?.active?'RETURN TO AREA':'BEDROOM',()=>game.walkable?.active?worldBackToLocation(game.walkable.locationId,game.walkable.weekend):openHomeHub());addButton(620,465,130,32,'NEXT',()=>o.page=Math.min(Math.max(0,Math.ceil(items.length/12)-1),page+1),page<Math.ceil(items.length/12)-1);
};
function validateCommercialWorldArt(){
  const issues=[];if(Object.keys(CW_MAP_POSITIONS).length!==14)issues.push('Illustrated district map is missing locations.');if(typeof cwGiftIcon!=='function'||typeof cwStylePreview!=='function'||typeof cwCollectibleIcon!=='function')issues.push('Commercial item illustration functions are missing.');
  return {valid:issues.length===0,issues,version:COMMERCIAL_WORLD_ART_VERSION,illustratedDistrict:true,illustratedProducts:GIFT_ITEMS.length,illustratedCustomization:true,illustratedCollections:true,placeholderCards:false};
}
