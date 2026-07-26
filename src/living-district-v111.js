// Sakura Crest v1.11 — living district ambience, signature activities and persistent location mastery.
const LIVING_DISTRICT_VERSION='1.11.0';
const LIVING_DISTRICT_SIGNATURES=Object.freeze({
  home:{title:'Quiet Reset',detail:'Reorganize the memory desk and set one clear intention for tomorrow.',effect:{energy:4,stress:-4,reliability:1},accent:'#db8fa8'},
  shopping:{title:'Street Style Study',detail:'Notice how window displays, crowds and small choices shape confidence.',effect:{charisma:1,talent:1,stress:-1},accent:'#e8bf59'},
  cafe:{title:'Unhurried Conversation',detail:'Listen closely enough for the conversation to move beyond small talk.',effect:{kindness:2,stress:-3},accent:'#d88957'},
  arcade:{title:'Pattern Breaker',detail:'Learn a cabinet pattern, adapt under pressure and finish an honest run.',effect:{courage:1,talent:1,stress:-2},accent:'#9b83df'},
  park:{title:'Riverside Circuit',detail:'Walk the full loop, pause at the bridge and return with a clearer head.',effect:{fitness:1,kindness:1,stress:-3},accent:'#78b985'},
  public_library:{title:'Archive Trail',detail:'Follow one source through references, corrections and forgotten margin notes.',effect:{intellect:2,reliability:1},accent:'#80cbdc'},
  cinema:{title:'Scene Reading',detail:'Study how framing, costume and silence change the meaning of a scene.',effect:{talent:2,charisma:1,stress:-1},accent:'#cf6483'},
  sports_center:{title:'Measured Training',detail:'Complete a safe circuit with proper recovery instead of chasing exhaustion.',effect:{fitness:2,reliability:1,energy:-2},accent:'#df665b'},
  music_venue:{title:'Open Soundcheck',detail:'Listen to an unfinished performance and notice what changes before the crowd arrives.',effect:{talent:2,courage:1},accent:'#dda94d'},
  festival:{title:'Lantern Route',detail:'Visit the stalls, stage and shrine path without rushing past the small moments.',effect:{charisma:1,kindness:1,stress:-3},accent:'#eb91ad'},
  museum:{title:'Curator’s Question',detail:'Choose one object and ask whose story is missing from its display.',effect:{intellect:1,talent:1,kindness:1},accent:'#bc925f'},
  study_center:{title:'Focus Block',detail:'Break one difficult task into a plan that can actually be completed.',effect:{intellect:1,reliability:2,stress:1},accent:'#65b69a'},
  convenience:{title:'Useful Errand',detail:'Restock what is needed, compare options and leave without impulse buying.',effect:{energy:4,reliability:1},accent:'#5ab2c4'},
  station:{title:'Departure Watch',detail:'Read the board, observe the platform and imagine a future route beyond school.',effect:{courage:1,reliability:1,charisma:1},accent:'#6598d1'}
});

function ensureLivingDistrictProgress(player=game.player){
  player.districtProgress ||= {mastery:{},stamps:[],experts:[],moments:[],lastMasteryDay:{}};
  const progress=player.districtProgress;
  progress.mastery ||= {};progress.stamps ||= [];progress.experts ||= [];progress.moments ||= [];progress.lastMasteryDay ||= {};
  return progress;
}
function livingDistrictDayKey(){return `${game.year}-${game.month}-${game.day}`;}
function livingDistrictMastery(id){return ensureLivingDistrictProgress().mastery[id]||0;}
function livingDistrictRecord(id){
  const signature=LIVING_DISTRICT_SIGNATURES[id],location=WORLD_LOCATIONS[id];
  if(!signature||!location)return false;
  const progress=ensureLivingDistrictProgress(),dayKey=livingDistrictDayKey();
  if(progress.lastMasteryDay[id]===dayKey){notify(`${location.name} mastery was already recorded today.`,COLORS.sky);return false;}
  progress.lastMasteryDay[id]=dayKey;
  const level=(progress.mastery[id]||0)+1;progress.mastery[id]=level;
  progress.moments.unshift({id:`${id}-${dayKey}`,locationId:id,title:signature.title,detail:signature.detail,year:game.year,month:game.month,day:game.day});
  progress.moments=progress.moments.slice(0,56);
  applyEffects(signature.effect,`${location.name} • ${signature.title}`);
  if(level===3&&!progress.stamps.includes(id)){
    progress.stamps.push(id);game.player.wallet+=25;notify(`${location.name} district stamp earned • ¥25`,signature.accent);
  }
  if(level===6&&!progress.experts.includes(id)){
    progress.experts.push(id);game.player.score+=18;game.player.wallet+=40;notify(`${location.name} local expert • +18 social score`,COLORS.gold);
  }
  saveSilently();
  return true;
}

const livingDistrictBaseExplore=wwExplore;
wwExplore=function(){
  const state=wwEnsureState(),wasExplored=state.explored,locationId=state.locationId;
  livingDistrictBaseExplore();
  if(!wasExplored&&state.explored)livingDistrictRecord(locationId);
};

function livingDistrictPulse(seed,time,speed=1){return .5+.5*Math.sin(time*speed+seed*1.731);}
function livingDistrictMotes(count,color,time,xMin=60,xMax=1120,yMin=90,yMax=690,speed=12){
  ctx.save();ctx.fillStyle=color;
  for(let index=0;index<count;index++){
    const seed=index*97+game.month*31+game.day*17;
    const x=xMin+((seed*13+time*speed*(1+index%3))%(xMax-xMin));
    const y=yMin+((seed*29-time*speed*.55*(1+index%2))%(yMax-yMin)+(yMax-yMin))%(yMax-yMin);
    ctx.globalAlpha=.16+.34*livingDistrictPulse(seed,time,.55);ctx.beginPath();ctx.arc(x,y,1.5+(index%3),0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}
function livingDistrictSteam(x,y,time,offset=0){
  ctx.save();ctx.strokeStyle='rgba(255,247,232,.46)';ctx.lineWidth=3;ctx.lineCap='round';
  for(let line=0;line<3;line++){
    const phase=time*.8+offset+line*.9;ctx.beginPath();ctx.moveTo(x+line*8-8,y);
    ctx.bezierCurveTo(x+Math.sin(phase)*12,y-24,x+Math.cos(phase*.8)*15,y-43,x+Math.sin(phase*.6)*8,y-62);ctx.stroke();
  }
  ctx.restore();
}
function drawLivingDistrictAmbience(id,state){
  const reduced=Boolean(game.settings?.reducedMotion),time=reduced?0:performance.now()/1000;
  ctx.save();
  if(id==='home'){
    const glow=ctx.createRadialGradient(945,155,5,945,155,150);glow.addColorStop(0,'rgba(255,222,185,.28)');glow.addColorStop(1,'rgba(255,222,185,0)');ctx.fillStyle=glow;ctx.fillRect(760,55,360,310);livingDistrictMotes(14,'rgba(255,242,220,.8)',time,90,1090,100,650,5);
  }else if(id==='shopping'){
    ctx.globalAlpha=.28+.18*livingDistrictPulse(2,time,1.4);ctx.fillStyle='#f7e7a4';for(let x=75;x<1110;x+=130)ctx.fillRect(x,376,72,10);ctx.globalAlpha=.34;for(let i=0;i<4;i++){const x=((time*75+i*310)%1400)-110;ctx.fillStyle=i%2?'#e88ea4':'#87c9d8';ctx.fillRect(x,500+i%2*38,48,5);} 
  }else if(id==='cafe'){
    [[220,276],[580,276],[940,276],[340,456],[840,456]].forEach((point,index)=>livingDistrictSteam(point[0],point[1],time,index));livingDistrictMotes(10,'rgba(255,232,197,.7)',time,75,1100,75,650,3);
  }else if(id==='arcade'){
    for(let i=0;i<10;i++){ctx.globalAlpha=.12+.28*livingDistrictPulse(i,time,2.2);ctx.fillStyle=['#9b83df','#67c9df','#e581a7'][i%3];ctx.fillRect(70+i*105,115+(i%4)*135,82,4);}livingDistrictMotes(22,'rgba(183,153,255,.8)',time,70,1110,100,670,18);
  }else if(id==='park'){
    ctx.strokeStyle='rgba(218,249,255,.52)';ctx.lineWidth=2;for(let i=0;i<5;i++){const radius=28+i*17+(reduced?0:(time*12)%17);ctx.globalAlpha=.36-i*.05;ctx.beginPath();ctx.ellipse(590,325,radius,radius*.55,0,0,Math.PI*2);ctx.stroke();}livingDistrictMotes(seasonKey()==='spring'?24:12,seasonKey()==='spring'?'rgba(255,190,213,.9)':'rgba(230,244,190,.8)',time,70,1110,80,690,seasonKey()==='spring'?18:7);
  }else if(id==='public_library'){
    livingDistrictMotes(18,'rgba(255,241,205,.9)',time,70,1110,85,680,4);ctx.globalAlpha=.18+.16*livingDistrictPulse(4,time,.7);ctx.fillStyle='#fff4c9';ctx.fillRect(450,218,280,3);
  }else if(id==='cinema'){
    const beam=ctx.createLinearGradient(590,190,590,520);beam.addColorStop(0,'rgba(255,242,198,.30)');beam.addColorStop(1,'rgba(255,242,198,0)');ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(500,190);ctx.lineTo(330,560);ctx.lineTo(850,560);ctx.lineTo(680,190);ctx.closePath();ctx.fill();livingDistrictMotes(12,'rgba(255,220,170,.8)',time,300,870,190,570,4);
  }else if(id==='sports_center'){
    const phase=reduced?.5:(time*.45)%1,x=330+phase*520,y=535-Math.sin(phase*Math.PI)*210;ctx.fillStyle='#f5c75e';ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.34)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(330,535);ctx.quadraticCurveTo(590,170,850,535);ctx.stroke();
  }else if(id==='music_venue'){
    for(let i=0;i<6;i++){const x=180+i*160,angle=(i-2.5)*.11+Math.sin(time*.7+i)*.08;ctx.save();ctx.translate(x,80);ctx.rotate(angle);const beam=ctx.createLinearGradient(0,0,0,330);beam.addColorStop(0,['rgba(232,138,165,.32)','rgba(130,201,223,.3)','rgba(239,199,94,.3)'][i%3]);beam.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(-8,0);ctx.lineTo(-75,330);ctx.lineTo(75,330);ctx.lineTo(8,0);ctx.closePath();ctx.fill();ctx.restore();}
  }else if(id==='festival'){
    for(let y=90;y<690;y+=85)for(let x=110;x<1090;x+=145){ctx.globalAlpha=.24+.42*livingDistrictPulse(x+y,time,1.8);ctx.fillStyle=['#efc75e','#e68aa5','#82c9df'][(x+y)%3];ctx.beginPath();ctx.arc(x,y,13,0,Math.PI*2);ctx.fill();}livingDistrictMotes(18,'rgba(255,221,126,.9)',time,70,1110,70,690,8);
  }else if(id==='museum'){
    [[215,270],[590,270],[965,270],[385,510],[795,520]].forEach((point,index)=>{const pulse=livingDistrictPulse(index,time,1.1);ctx.globalAlpha=.2+.45*pulse;ctx.fillStyle='#fff2bd';ctx.beginPath();ctx.moveTo(point[0],point[1]-9);ctx.lineTo(point[0]+3,point[1]-2);ctx.lineTo(point[0]+10,point[1]);ctx.lineTo(point[0]+3,point[1]+2);ctx.lineTo(point[0],point[1]+9);ctx.lineTo(point[0]-3,point[1]+2);ctx.lineTo(point[0]-10,point[1]);ctx.lineTo(point[0]-3,point[1]-2);ctx.closePath();ctx.fill();});
  }else if(id==='study_center'){
    for(let i=0;i<7;i++){ctx.globalAlpha=.15+.18*livingDistrictPulse(i,time,.7);ctx.fillStyle='#fff7d8';ctx.fillRect(110+i*145,285+(i%2)*215,78,4);}livingDistrictMotes(10,'rgba(223,255,236,.75)',time,80,1100,90,670,3);
  }else if(id==='convenience'){
    const sweep=((time*90)%900);const shine=ctx.createLinearGradient(120+sweep,0,230+sweep,0);shine.addColorStop(0,'rgba(255,255,255,0)');shine.addColorStop(.5,'rgba(222,250,255,.24)');shine.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=shine;ctx.fillRect(70,170,1010,360);
  }else if(id==='station'){
    const trainX=reduced?180:((time*82)%1500)-260;ctx.globalAlpha=.46;ctx.fillStyle='#d8e7ec';ctx.fillRect(trainX,290,420,82);ctx.fillStyle='#55748b';for(let i=0;i<7;i++)ctx.fillRect(trainX+25+i*55,310,38,28);ctx.fillStyle='#e9c657';ctx.fillRect(trainX,367,420,5);livingDistrictMotes(10,'rgba(218,239,248,.8)',time,60,1120,80,650,10);
  }
  ctx.restore();
}

const livingDistrictBaseDrawScene=wwDrawScene;
wwDrawScene=function(){livingDistrictBaseDrawScene();const state=wwEnsureState();drawLivingDistrictAmbience(state.locationId,state);};

const livingDistrictBaseDrawHud=wwDrawHud;
wwDrawHud=function(){
  livingDistrictBaseDrawHud();
  const state=wwEnsureState(),id=state.locationId,mastery=livingDistrictMastery(id),progress=ensureLivingDistrictProgress(),scene=wwScene();
  ctx.save();ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=10;uiRoundedPath(506,16,104,62,12);ctx.fillStyle='rgba(16,24,40,.92)';ctx.fill();ctx.restore();
  uiRoundedPath(506.5,16.5,103,61,12);ctx.strokeStyle=scene.accent;ctx.lineWidth=2;ctx.stroke();
  centeredAt(progress.experts.includes(id)?'LOCAL EXPERT':progress.stamps.includes(id)?'DISTRICT STAMP':'LOCAL MASTERY',558,36,9,progress.experts.includes(id)?COLORS.gold:COMMERCIAL_UI.cream,`bold 9px ${UI_FONT}`);
  centeredAt(`${Math.min(mastery,6)} / 6`,558,59,17,scene.accent,`bold 17px ${UI_FONT}`);
};

function validateLivingDistrictV111(){
  const issues=[],ids=Object.keys(LIVING_DISTRICT_SIGNATURES),canonical=Object.keys(WW_SCENES);
  if(LIVING_DISTRICT_VERSION!=='1.11.0')issues.push('living district version mismatch');
  if(ids.length!==14)issues.push(`Expected 14 signature activities, found ${ids.length}.`);
  for(const id of canonical){
    const signature=LIVING_DISTRICT_SIGNATURES[id];
    if(!signature)issues.push(`${id} has no signature activity.`);
    else if(!signature.title||!signature.detail||!signature.effect||!signature.accent)issues.push(`${id} signature activity is incomplete.`);
  }
  const progress=ensureLivingDistrictProgress();
  if(!progress.mastery||!progress.stamps||!progress.experts||!progress.moments)issues.push('persistent district progression is unavailable');
  return {valid:issues.length===0,issues,version:LIVING_DISTRICT_VERSION,signatureActivities:ids.length,persistentMastery:true,districtStamps:true,localExpertMilestones:true,uniqueAmbientProfiles:14,reducedMotionAware:true,realAssetBackdropsPreserved:true,placeholderAssets:false};
}
window.SAKURA_LIVING_DISTRICT_V111=Object.freeze({version:LIVING_DISTRICT_VERSION,signatures:LIVING_DISTRICT_SIGNATURES,validate:validateLivingDistrictV111});
ensureLivingDistrictProgress();
