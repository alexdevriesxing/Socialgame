function canvasPoint(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height};}
canvas.addEventListener('pointermove',e=>{pointer=canvasPoint(e);});
canvas.addEventListener('pointerdown',e=>{
  pointer={...canvasPoint(e),down:true};audio.ensure();
  for(let i=buttons.length-1;i>=0;i--){const b=buttons[i];if(b.enabled&&pointer.x>=b.x&&pointer.x<=b.x+b.w&&pointer.y>=b.y&&pointer.y<=b.y+b.h){audio.click();if(b.holdKey)keys.add(b.holdKey);else b.onClick();break;}}
});
canvas.addEventListener('pointerup',()=>{pointer.down=false;['arrowup','arrowdown','arrowleft','arrowright'].forEach(k=>keys.delete(k));});
canvas.addEventListener('pointerleave',()=>{pointer.down=false;['arrowup','arrowdown','arrowleft','arrowright'].forEach(k=>keys.delete(k));});
window.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();keys.add(k);
  if(['arrowup','arrowdown','arrowleft','arrowright',' ','e','q','r'].includes(k))e.preventDefault();
  if(game.dialogue){
    if(k===' '||k==='e'||k==='enter'){
      if(game.dialogue.reveal<game.dialogue.text.length)game.dialogue.reveal=game.dialogue.text.length;
      else closeDialogue(game.dialogue.selected||0);
    } else if(['1','2','3','4'].includes(k)&&game.dialogue.reveal>=game.dialogue.text.length)closeDialogue(Number(k)-1);
    else if(k==='arrowdown')game.dialogue.selected=(game.dialogue.selected+1)%Math.max(1,game.dialogue.choices.length);
    else if(k==='arrowup')game.dialogue.selected=(game.dialogue.selected-1+Math.max(1,game.dialogue.choices.length))%Math.max(1,game.dialogue.choices.length);
    return;
  }
  if(game.overlay){if(k==='escape'||k==='q'||k==='r')game.overlay=null;return;}
  if(game.mode==='play'){
    if(k==='e'||k===' ')interact();
    if(k==='r')game.overlay={type:'rankings',title:'Live Social Rankings'};
    if(k==='q')game.overlay={type:'schedule',title:'Class Schedule'};
    if(k==='m')audio.toggle();
    if(k==='escape'){game.paused=!game.paused;notify(game.paused?'Paused':'Resumed',COLORS.sky);}
  }
});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));

confirmName.addEventListener('click',()=>{
  const n=nameInput.value.trim().replace(/[^A-Za-z0-9 '\-]/g,'').slice(0,12)||'Akira';
  game.player.name=n;game.player.gender=game.creatorGender;game.player.club=game.creatorClub;game.player.socialStatus=game.creatorStatus;
  if(game.player.gender==='girl'){game.player.stats.kindness++;game.player.stats.talent++;}
  else{game.player.stats.courage++;game.player.stats.fitness++;}
  game.player.stats[CLUBS[game.player.club].stat]+=2;initializeSocialStatus();
  creator.classList.add('hidden');game.mode='play';assignMissions();relocateNPCs('arrival');audio.startMusic();
  openDialogue({speaker:'Ms. Hayashi',portrait:12,text:`Welcome to ${SCHOOL_NAME}, ${game.player.name}.\n\nYour schedule matters. Reach each room before the grace period ends, build real friendships, contribute to ${clubConfig().name}, and remember: the monthly rankings measure conduct as well as popularity.

Starting status: ${statusConfig().name} (${statusConfig().difficulty}). ${statusConfig().description}`,choices:[{text:'I am ready.',effects:{reliability:1,score:4},result:'The first bell is ten minutes away. Class 1-A is through the blue-marked door.'}]});
});

function loop(now){const dt=Math.min(.05,(now-lastTime)/1000);lastTime=now;update(dt);draw();requestAnimationFrame(loop);}

Promise.all(imageNames.map(loadImage)).then(()=>{
  loading.classList.add('hidden');assignMissions();relocateNPCs('arrival');requestAnimationFrame(loop);
}).catch(err=>{loading.textContent='Asset loading failed. Refresh the page.';console.error(err);});
