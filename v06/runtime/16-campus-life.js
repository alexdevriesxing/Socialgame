function ensureCampusLifeState(){
  game.player.phoneInbox ||= [];
  game.player.messageReplies ||= [];
  game.player.showcaseScores ||= [];
  game.player.showcaseWins ??= 0;
  game.player.eventPrestige ??= 0;
  game.dayFlags ||= {};
  game.dayFlags.message ??= false;
  game.dayFlags.showcase ??= false;
}
function messageById(id){return PHONE_MESSAGES.find(message=>message.id===id)||null;}
function npcById(id){return NPCS.find(npc=>npc.id===id)||null;}
function unreadMessageCount(){ensureCampusLifeState();return game.player.phoneInbox.filter(entry=>!entry.read&&!game.player.messageReplies.includes(entry.id)).length;}
function maybeQueuePhoneMessage(){
  ensureCampusLifeState();
  if(game.dayFlags.message||game.dialogue||game.overlay||game.mode!=='play')return;
  if(game.time<700||game.time>880)return;
  const owned=new Set(game.player.phoneInbox.map(entry=>entry.id));
  const eligible=PHONE_MESSAGES.filter(message=>!owned.has(message.id)&&(game.player.relationships[message.npcId]||0)>=message.threshold);
  if(!eligible.length){game.dayFlags.message=true;return;}
  const seed=game.year*997+game.month*73+game.day*31+game.player.name.length*11;
  const message=eligible[Math.abs(seed)%eligible.length];
  game.player.phoneInbox.unshift({id:message.id,read:false,received:{year:game.year,month:game.month,day:game.day}});
  game.dayFlags.message=true;
  notify(`New message from ${npcById(message.npcId)?.name||'a classmate'}`,COLORS.pink);
  audio.message?.();
  saveSilently();
}
function openPhone(){ensureCampusLifeState();game.overlay={type:'phone',title:'Crest Phone'};}
function openMessage(messageId){
  ensureCampusLifeState();
  const entry=game.player.phoneInbox.find(item=>item.id===messageId),message=messageById(messageId),npc=message&&npcById(message.npcId);
  if(!entry||!message||!npc)return;
  entry.read=true;
  if(game.player.messageReplies.includes(message.id)){
    openDialogue({speaker:`${npc.name} • ${message.subject}`,portrait:npc.portrait,text:`${message.text}\n\nYou already replied to this conversation.`,choices:[{text:'Close'}]});
    return;
  }
  game.overlay=null;
  openDialogue({speaker:`${npc.name} • ${message.subject}`,portrait:npc.portrait,text:message.text,choices:message.choices.map(choice=>({
    text:choice.text,effects:choice.effects,relationship:[npc.id,choice.bond||1],result:choice.result,
    achievement:`Message reply: ${npc.name} — ${message.subject}`,
    action:()=>{if(!game.player.messageReplies.includes(message.id))game.player.messageReplies.push(message.id);audio.good();saveSilently();}
  }))});
}
function drawPhoneOverlay(o){
  overlayBase(o.title);
  text('MESSAGES',82,102,18,COLORS.pink,true);
  text(`${unreadMessageCount()} unread • ${game.player.messageReplies.length}/${PHONE_MESSAGES.length} replied`,676,102,13,COLORS.gold,true);
  const inbox=game.player.phoneInbox.slice(0,8);
  if(!inbox.length){
    panel(130,160,700,180,COLORS.deep,COLORS.sky,3);
    centered('No messages yet',224,25,COLORS.paper,'bold 25px Trebuchet MS');
    centered('Conversations arrive during lunch and free periods as friendships develop.',270,14,COLORS.cream,'bold 14px Trebuchet MS');
  }else inbox.forEach((entry,index)=>{
    const message=messageById(entry.id),npc=message&&npcById(message.npcId);if(!message||!npc)return;
    const y=126+index*39,replied=game.player.messageReplies.includes(entry.id),unread=!entry.read&&!replied;
    ctx.fillStyle=unread?'rgba(232,142,164,.18)':'rgba(255,255,255,.045)';ctx.fillRect(82,y,796,34);
    const sx=(npc.portrait%4)*PORTRAIT_CELL,sy=Math.floor(npc.portrait/4)*PORTRAIT_CELL;
    ctx.drawImage(images.portraits,sx,sy,PORTRAIT_CELL,PORTRAIT_CELL,87,y+3,28,28);
    text(npc.name,124,y+14,13,unread?COLORS.paper:COLORS.cream,true);
    text(message.subject,270,y+14,12,COLORS.sky,true);
    text(replied?'REPLIED':unread?'NEW':'READ',790,y+14,10,replied?COLORS.mint:unread?COLORS.pink:COLORS.muted||COLORS.cream,true);
    addButton(704,y+5,82,24,'OPEN',()=>openMessage(entry.id),true,false,unread?COLORS.rose:COLORS.navy);
  });
  addButton(240,465,210,34,'MEMORY GALLERY',()=>game.overlay={type:'memories',title:'Memory Gallery',page:0});
  addButton(510,465,210,34,'CLOSE',()=>game.overlay=null);
}
function routeCatalog(){return NPCS.flatMap(npc=>(RELATIONSHIP_ROUTES[npc.id]||[]).map(route=>({npc,route})));}
function openMemory(routeId){
  const item=routeCatalog().find(entry=>entry.route.id===routeId);if(!item||!game.player.routeScenes.includes(routeId))return;
  game.overlay=null;
  openDialogue({speaker:`Memory • ${item.npc.name} • ${item.route.title}`,portrait:item.npc.portrait,scene:item.route.scene,text:item.route.text,choices:[{text:'Return to the present'}]});
}
function drawMemoryGallery(o){
  overlayBase(o.title);
  const all=routeCatalog(),page=clamp(o.page||0,0,1),start=page*15,visible=all.slice(start,start+15);
  text('UNLOCKED FRIENDSHIP MEMORIES',82,100,17,COLORS.gold,true);
  text(`${game.player.routeScenes.length}/30 • Page ${page+1}/2`,728,100,13,COLORS.sky,true);
  visible.forEach((item,index)=>{
    const col=index%5,row=Math.floor(index/5),x=72+col*166,y=124+row*102,unlocked=game.player.routeScenes.includes(item.route.id);
    ctx.fillStyle=unlocked?'rgba(255,255,255,.065)':'rgba(8,12,22,.55)';ctx.fillRect(x,y,150,90);
    ctx.strokeStyle=unlocked?COLORS.gold:'#4c5262';ctx.lineWidth=2;ctx.strokeRect(x+.5,y+.5,149,89);
    if(unlocked){
      const sx=(item.npc.portrait%4)*PORTRAIT_CELL,sy=Math.floor(item.npc.portrait/4)*PORTRAIT_CELL;
      ctx.drawImage(images.portraits,sx,sy,PORTRAIT_CELL,PORTRAIT_CELL,x+5,y+6,56,56);
      text(item.npc.name.split(' ')[0],x+67,y+23,12,COLORS.paper,true);
      wrapped(item.route.title,x+67,y+43,76,11,COLORS.cream,2);
      addButton(x+5,y+66,140,19,'REPLAY',()=>openMemory(item.route.id),true,false,COLORS.navy);
    }else{
      centeredAt('LOCKED',x+75,y+37,13,'#73798a','bold 13px Trebuchet MS');
      centeredAt(`Bond ${item.route.threshold}`,x+75,y+58,11,'#646b7e','bold 11px Trebuchet MS');
    }
  });
  addButton(250,455,130,32,'PREVIOUS',()=>o.page=Math.max(0,page-1),page>0);
  addButton(415,455,130,32,'PHONE',openPhone);
  addButton(580,455,130,32,'NEXT',()=>o.page=Math.min(1,page+1),page<1);
}
function currentShowcase(){return MONTHLY_SHOWCASES[(game.month-1)%MONTHLY_SHOWCASES.length];}
function showcaseRecord(){ensureCampusLifeState();return game.player.showcaseScores.find(entry=>entry.year===game.year&&entry.month===game.month)||null;}
function showcaseSequence(seed,length=4){const symbols=['A','B','C','D'];return Array.from({length},(_,index)=>symbols[Math.abs(seed+index*17+index*index*7)%symbols.length]);}
function startMonthlyShowcase(source='Monthly showcase'){
  ensureCampusLifeState();
  if(showcaseRecord()){notify('This month’s showcase is already complete.',COLORS.sky);return false;}
  const cfg=currentShowcase(),seed=game.year*1000+game.month*73+game.day*17;
  const overlay={type:'showcase',title:cfg.title,cfg,source,mechanic:cfg.mechanic,phase:'active',elapsed:0,score:0,feedback:'',flash:0};
  if(cfg.mechanic==='timing')Object.assign(overlay,{round:0,total:4,position:.05,targetCenter:.28+(seed%43)/100,targetWidth:.18,hits:[]});
  if(cfg.mechanic==='sequence')Object.assign(overlay,{sequence:showcaseSequence(seed,4),input:[],preview:2.7,mistakes:0});
  if(cfg.mechanic==='balance')Object.assign(overlay,{position:.5,velocity:0,targetCenter:.5,targetWidth:.28,duration:8,insideTime:0});
  game.overlay=overlay;game.dayFlags.showcase=true;audio.bell();return true;
}
function updateShowcase(dt){
  const o=game.overlay;if(o?.type!=='showcase'||o.phase!=='active')return;
  o.elapsed+=dt;o.flash=Math.max(0,(o.flash||0)-dt);
  if(o.mechanic==='timing'){
    const speed=2.2+o.round*.38+game.year*.08;o.position=.5+.47*Math.sin(o.elapsed*speed+o.round*.73);
  }else if(o.mechanic==='sequence'){
    if(o.preview>0)o.preview=Math.max(0,o.preview-dt);
  }else if(o.mechanic==='balance'){
    const left=keys.has('arrowleft')||keys.has('a'),right=keys.has('arrowright')||keys.has('d');
    o.velocity+=(right-left)*dt*.95;o.velocity*=Math.pow(.32,dt);o.position=clamp(o.position+o.velocity*dt,0,1);
    o.targetCenter=.5+Math.sin(o.elapsed*.85+game.month)*.16;
    if(Math.abs(o.position-o.targetCenter)<=o.targetWidth/2)o.insideTime+=dt;
    if(o.elapsed>=o.duration)finishShowcase(Math.round(o.insideTime/o.duration*100));
  }
}
function showcaseAction(value=null){
  const o=game.overlay;if(o?.type!=='showcase'||o.phase!=='active')return;
  if(o.mechanic==='timing'){
    const distance=Math.abs(o.position-o.targetCenter),accuracy=Math.round(clamp(108-distance*190,0,100));o.hits.push(accuracy);o.flash=.24;audio.tone(accuracy>=70?900:250,.1,accuracy>=70?'sine':'sawtooth',.03);
    if(o.hits.length>=o.total){finishShowcase(Math.round(o.hits.reduce((a,b)=>a+b,0)/o.hits.length));return;}
    o.round++;o.elapsed=.14;o.targetCenter=.22+((game.year*31+game.month*19+o.round*27)%57)/100;o.targetWidth=Math.max(.1,.18-o.round*.015);
  }else if(o.mechanic==='sequence'){
    if(o.preview>0||value===null)return;
    const expected=o.sequence[o.input.length],actual=['A','B','C','D'][value];o.input.push(actual);
    if(actual!==expected){o.mistakes++;audio.bad();}else audio.good();
    if(o.input.length>=o.sequence.length)finishShowcase(Math.max(0,100-o.mistakes*24));
  }
}
function finishShowcase(score){
  const o=game.overlay;if(!o||o.type!=='showcase'||o.phase==='result')return;
  const cfg=o.cfg,grade=score>=90?'S':score>=75?'A':score>=58?'B':score>=40?'C':'D';
  const statGain=score>=90?3:score>=70?2:score>=45?1:0;
  const standing=Math.round(score/5)+game.year*2;
  applyEffects({score:standing,[cfg.stat]:statGain,stress:score<45?3:-2},`${cfg.event}: Grade ${grade}`);
  game.player.eventPrestige+=Math.round(score/10);
  if(score>=75)game.player.showcaseWins++;
  game.player.showcaseScores.push({year:game.year,month:game.month,score,grade,event:cfg.event});
  o.phase='result';o.score=score;o.grade=grade;o.resultColor=score>=75?COLORS.gold:score>=50?COLORS.sky:COLORS.rose;
  saveSilently();audio.good();
}
function drawShowcaseOverlay(o){
  overlayBase(`${o.cfg.event} • ${o.title}`);
  centered(o.cfg.description,103,15,COLORS.cream,'bold 15px Trebuchet MS');
  panel(100,135,760,252,COLORS.deep,o.cfg.color,4);
  if(o.phase==='result'){
    centered(`GRADE ${o.grade}`,196,42,o.resultColor,'bold 42px Trebuchet MS');
    centered(`${o.score}% showcase score`,245,21,COLORS.paper,'bold 21px Trebuchet MS');
    wrapped(`The result adds to event prestige and this month’s social standing. Strong showcase performances can become part of your final school legacy.`,220,290,520,15,COLORS.cream,4);
    addButton(325,427,310,42,'CONTINUE TO DAY SUMMARY',()=>{game.overlay=null;setTimeout(endDay,40);});return;
  }
  if(o.mechanic==='timing'){
    const x=155,y=230,w=650,h=44,targetX=x+o.targetCenter*w,targetW=o.targetWidth*w,marker=x+o.position*w;
    text(`CUE ${o.hits.length+1}/${o.total}`,155,190,18,o.cfg.color,true);ctx.fillStyle='#10182a';ctx.fillRect(x,y,w,h);
    ctx.fillStyle='rgba(229,184,75,.38)';ctx.fillRect(targetX-targetW/2,y,targetW,h);ctx.strokeStyle=COLORS.gold;ctx.lineWidth=3;ctx.strokeRect(targetX-targetW/2+.5,y+.5,targetW-1,h-1);
    ctx.fillStyle=o.flash?COLORS.white:o.cfg.color;ctx.fillRect(marker-5,y-16,10,h+32);
    o.hits.forEach((hit,index)=>text(`${index+1}: ${hit}%`,235+index*130,320,14,hit>=70?COLORS.mint:COLORS.paper,true));
    addButton(330,420,300,46,'HIT • E / SPACE',()=>showcaseAction(),true,false,o.cfg.color);
  }else if(o.mechanic==='sequence'){
    text(o.preview>0?'MEMORIZE THE ORDER':'REPEAT THE ORDER',155,185,18,o.cfg.color,true);
    const symbols=o.preview>0?o.sequence:o.input.map((value,index)=>value||'•');
    for(let i=0;i<4;i++){const x=220+i*135;panel(x,220,92,92,o.preview>0?o.cfg.color:'#151c31',COLORS.gold,3);centeredAt(symbols[i]||'•',x+46,279,38,COLORS.paper,'bold 38px Trebuchet MS');}
    if(o.preview<=0){['A','B','C','D'].forEach((symbol,index)=>addButton(220+index*135,345,92,48,`${index+1} • ${symbol}`,()=>showcaseAction(index),true,false,o.cfg.color));}
    else centered(`Sequence appears for ${o.preview.toFixed(1)} seconds`,430,15,COLORS.cream,'bold 15px Trebuchet MS');
  }else{
    const x=155,y=235,w=650,h=48,targetX=x+o.targetCenter*w,targetW=o.targetWidth*w,marker=x+o.position*w;
    text(`HOLD THE PACE • ${Math.max(0,o.duration-o.elapsed).toFixed(1)}s`,155,188,18,o.cfg.color,true);ctx.fillStyle='#10182a';ctx.fillRect(x,y,w,h);
    ctx.fillStyle='rgba(229,184,75,.33)';ctx.fillRect(targetX-targetW/2,y,targetW,h);ctx.fillStyle=o.cfg.color;ctx.fillRect(marker-7,y-17,14,h+34);
    centered(`${Math.round(o.insideTime/o.duration*100)}% controlled`,333,17,COLORS.paper,'bold 17px Trebuchet MS');
    addButton(245,410,180,46,'← HOLD LEFT',()=>{},true,false,COLORS.navy,{holdKey:'arrowleft'});addButton(535,410,180,46,'HOLD RIGHT →',()=>{},true,false,COLORS.navy,{holdKey:'arrowright'});
  }
}
