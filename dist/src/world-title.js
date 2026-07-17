// Pass 9 v1.7 release title with production-readiness messaging and modal-safe HUD controls.
function drawTitle(){
  ctx.drawImage(images.keyart,0,0,W,H);
  const shade=ctx.createLinearGradient(0,0,W,0);
  shade.addColorStop(0,'rgba(8,12,24,.79)');shade.addColorStop(.58,'rgba(8,12,24,.5)');shade.addColorStop(1,'rgba(8,12,24,.66)');
  ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
  panel(54,34,852,112,'#141627',COLORS.gold,5);
  centered('SAKURA CREST',78,36,COLORS.paper,'bold 38px Trebuchet MS');
  centered('SOCIAL SUMMIT',115,22,COLORS.pink,'bold 22px Trebuchet MS');
  centered('Four complete school years across a living academy and walkable city',137,13,COLORS.cream,`bold 13px ${UI_FONT}`);

  panel(64,174,470,304,'#141627',COLORS.sky,3);
  text('BUILD A LIFE ACROSS THE DISTRICT',88,211,19,COLORS.gold,true);
  wrapped('Attend class, explore fourteen walkable maps, build friendships and compete across forty-eight chapters with resilient saves, original music and accessible controls.',88,246,410,16,COLORS.paper,5);
  const badges=[['48','CAMPAIGN CHAPTERS'],['24','QA PROFILES'],['14','WALKABLE MAPS'],['10','SAVE FORMAT']];
  badges.forEach((item,index)=>{const x=88+(index%2)*205,y=330+Math.floor(index/2)*62;panel(x,y,184,48,COLORS.deep,index%2?COLORS.pink:COLORS.sky,2);text(item[0],x+12,y+31,24,COLORS.gold,true);text(item[1],x+55,y+28,11,COLORS.cream,true);});
  text('v1.7 • RELEASE READINESS + RESILIENT SAVES',88,458,11,COLORS.mint,true);

  panel(566,174,330,304,'#141627',COLORS.gold,3);
  text('START YOUR SCHOOL LIFE',594,207,15,COLORS.gold,true);
  addButton(594,226,274,46,'NEW GAME',()=>{audio.startMusic();resetGame();game.mode='creator';creator.classList.remove('hidden');});
  addButton(594,282,274,46,'CONTINUE',()=>{audio.startMusic();if(!loadGame())notify('No valid save found yet.',COLORS.red);},!!localStorage.getItem(SAVE_KEY)||!!localStorage.getItem(SAVE_BACKUP_KEY)||!!localStorage.getItem(SAVE_TEMP_KEY));
  addButton(594,338,274,42,'HOW TO PLAY',()=>game.overlay={type:'help',title:'How to Play'});
  addButton(594,390,274,42,'ACCESSIBILITY, AUDIO & CONTROLS',openAccessibility);
  centeredAt('O options • H history • X city • B bedroom • Touch + controller',731,454,10,COLORS.cream,`bold 10px ${UI_FONT}`);
}

const worldTitleBaseHud=worldOriginalHud;
drawHudPanel=function(){
  worldTitleBaseHud();
  if(game.overlay)return;
  ctx.fillStyle=COLORS.panel;ctx.fillRect(734,504,212,35);
  addButton(736,508,98,24,'WORLD [X]',()=>openWorldMap(),worldTravelAllowed(),false,COLORS.gold);
  addButton(846,508,98,24,'ROOM [B]',openHomeHub,true,false,COLORS.pink);
};