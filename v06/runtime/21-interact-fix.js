// Publishing safeguard: keep hotspot interaction coordinates tied to the hotspot itself.
interact = function(){
  if(game.dialogue||game.overlay||game.mode!=='play')return;
  let nearest=null,dist=999;
  for(const npc of game.npcs){const dd=Math.hypot(npc.x-game.player.x,npc.y-game.player.y);if(dd<dist){dist=dd;nearest=npc;}}
  if(nearest&&dist<72){triggerNpcTalk(nearest);return;}
  for(const teacher of game.teachers){const dd=Math.hypot(teacher.x-game.player.x,teacher.y-game.player.y);if(dd<64){teacherSmallTalk(teacher);return;}}
  for(const hotspot of HOTSPOTS){const dd=Math.hypot(hotspot.x-game.player.x,hotspot.y-game.player.y);if(dd<hotspot.radius){triggerHotspot(hotspot);return;}}
  notify('Nothing nearby to interact with.',COLORS.sky);
};
