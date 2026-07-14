// Visual QA polish v1.3 — modal clarity and non-overlapping world labels.
const visualOriginalDrawNotifications = drawNotifications;
drawNotifications = function(){
  if(game.overlay || game.dialogue || game.mode === 'creator') return;
  visualOriginalDrawNotifications();
};

function visualNearestLabelActor(){
  let nearest=null;
  let distance=Infinity;
  for(const actor of [...game.npcs,...game.teachers]){
    const value=Math.hypot(actor.x-game.player.x,actor.y-game.player.y);
    if(value<78&&value<distance){nearest=actor;distance=value;}
  }
  return nearest;
}

function drawWorldCharacters(){
  const labelActor=visualNearestLabelActor();
  const actors=[
    ...game.npcs.map(n=>({...n,type:'npc',source:n})),
    ...game.teachers.map(t=>({...t,type:'teacher',source:t})),
    {...game.player,id:game.player.gender==='boy'?'player_boy':'player_girl',type:'player',source:game.player}
  ];
  actors.sort((a,b)=>a.y-b.y);
  for(const actor of actors){
    const source=actor.source||actor;
    const sx=Math.round(actor.x-game.camera.x),sy=Math.round(actor.y-game.camera.y);
    if(sx<-60||sx>VIEW_W+60||sy<-80||sy>H+50)continue;
    if(CHARACTER_INDEX[actor.id]===undefined)continue;
    const moving=actor.type!=='player'&&source.campus?.state==='moving';
    const row=actor.type==='player'?game.player.direction:(source.direction??0);
    let column;
    if(actor.type==='player')column=game.player.anim;
    else if(moving)column=source.anim??1;
    else{
      column=Math.floor((performance.now()+actor.x*7)/1100)%2?3:4;
      if(actor.type==='npc'&&sameLadder(actor)&&(game.player.rivalHeat[actor.id]||0)>=12)column=5;
      if(actor.type==='npc'&&(game.player.relationships[actor.id]||0)>=15)column=6;
      if(actor.type==='npc'&&(game.player.friendshipMoments||[]).some(id=>id.startsWith(actor.id)))column=Math.floor(performance.now()/1400)%2?7:8;
    }
    ctx.fillStyle='rgba(20,20,30,.28)';
    ctx.beginPath();ctx.ellipse(sx,sy-2,18,7,0,0,Math.PI*2);ctx.fill();
    drawCharacter(actor.id,column,row,sx-31,sy-86,62,86);
    if(actor.type!=='player'){
      ctx.fillStyle=campusActorColor(source);ctx.beginPath();ctx.arc(sx+23,sy-79,4,0,Math.PI*2);ctx.fill();
      if(labelActor?.id===actor.id){
        const width=148;
        label(actor.name,sx-width/2,sy-84,width,20,actor.type==='teacher'?COLORS.rose:COLORS.sky);
        const activity=String(source.campus?.activity||'Campus routine').replace('In transit • ','→ ');
        const short=activity.length>27?`${activity.slice(0,26)}…`:activity;
        label(short,sx-82,sy-61,164,18,campusActorColor(source));
      }
    }
  }
}

function validateVisualPolish(){
  const issues=[];
  const actorIds=[...NPCS,...TEACHERS].map(actor=>actor.id);
  if(new Set(actorIds).size!==actorIds.length)issues.push('Actor IDs are not unique, preventing nearest-label selection.');
  if(typeof visualOriginalDrawNotifications!=='function')issues.push('Notification renderer was not captured.');
  return {valid:issues.length===0,issues,labelMode:'nearest-only',modalNotifications:'suppressed'};
}
