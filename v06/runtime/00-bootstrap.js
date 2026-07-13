const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
const creator = document.getElementById('creator');
const nameInput = document.getElementById('nameInput');
const confirmName = document.getElementById('confirmName');
const loading = document.getElementById('loading');

const W = canvas.width;
const SPRITE_FRAME_W = 96;
const SPRITE_FRAME_H = 128;
const PORTRAIT_CELL = 128;
const UI_FONT = '"Trebuchet MS", Arial, sans-serif';
const CHARACTER_IDS = ['player_boy','player_girl',...NPCS.map(n=>n.id),...TEACHERS.map(t=>t.id)];
const CHARACTER_INDEX = Object.fromEntries(CHARACTER_IDS.map((id,index)=>[id,index]));
const CHARACTER_SHEET_W = SPRITE_FRAME_W*5;
const CHARACTER_SHEET_H = SPRITE_FRAME_H*4;
const H = canvas.height;
const VIEW_W = 720;
const PANEL_X = 720;
const PANEL_W = 240;
const COLORS = {
  ink:'#1c1d2b', deep:'#2b2d42', navy:'#324a66', blue:'#4d76a8', sky:'#87c9d8',
  cream:'#f4e9d8', paper:'#fff6e7', pink:'#e88ea4', rose:'#c75b7a', red:'#b8424b',
  gold:'#e5b84b', orange:'#d47a43', green:'#4d8b68', mint:'#83b98b', white:'#f8f7f4',
  shadow:'rgba(9,11,18,.75)', panel:'rgba(28,29,43,.95)'
};

const imageNames = ['keyart','school_maps','portraits','event_atlas','character_atlas'];
const images = {};
const artSources = createArtSources();

function loadImage(name) {
  return new Promise((resolve,reject)=>{
    const img = new Image();
    img.onload=()=>{images[name]=img;resolve();};
    img.onerror=reject;
    img.src=artSources[name];
  });
}

function drawCharacter(name, frameColumn, directionRow, x, y, width=64, height=86) {
  const img=images.character_atlas;
  const index=CHARACTER_INDEX[name];
  if(!img||index===undefined)return;
  const sheetX=(index%4)*CHARACTER_SHEET_W;
  const sheetY=Math.floor(index/4)*CHARACTER_SHEET_H;
  ctx.drawImage(img,sheetX+frameColumn*SPRITE_FRAME_W,sheetY+directionRow*SPRITE_FRAME_H,SPRITE_FRAME_W,SPRITE_FRAME_H,x,y,width,height);
}

class SchoolAudio {
  constructor(){ this.enabled=true; this.ctx=null; this.musicTimer=null; this.step=0; }
  ensure(){
    if(!this.enabled) return;
    if(!this.ctx) this.ctx = new (window.AudioContext||window.webkitAudioContext)();
    if(this.ctx.state==='suspended') this.ctx.resume();
  }
  tone(freq=440,dur=.08,type='square',gain=.025){
    if(!this.enabled) return;
    this.ensure();
    const o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.type=type;o.frequency.value=freq;g.gain.value=gain;
    o.connect(g);g.connect(this.ctx.destination);
    const t=this.ctx.currentTime; g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.start(t);o.stop(t+dur);
  }
  click(){this.tone(620,.045,'square',.02);}
  good(){this.tone(660,.07);setTimeout(()=>this.tone(880,.09),70);}
  message(){this.tone(988,.06,'sine',.02);setTimeout(()=>this.tone(1319,.08,'sine',.018),80);}
  sparkle(){[784,988,1319].forEach((f,i)=>setTimeout(()=>this.tone(f,.12,'sine',.018),i*70));}
  bad(){this.tone(180,.15,'sawtooth',.025);}
  bell(){[784,988,1175].forEach((f,i)=>setTimeout(()=>this.tone(f,.2,'sine',.035),i*120));}
  startMusic(){
    if(this.musicTimer||!this.enabled)return;
    this.ensure();
    const themes={
      spring:[262,330,392,523,392,330,294,349,440,587,440,349],
      summer:[294,370,440,587,494,440,370,330,392,494,659,494],
      autumn:[220,277,330,440,370,330,277,247,294,370,494,370],
      winter:[196,247,294,392,330,294,247,220,262,330,440,330],
      title:[262,330,392,523,659,523,440,392]
    };
    this.musicTimer=setInterval(()=>{
      if(game.mode==='title'||game.mode==='creator'||game.mode==='play'||game.mode==='prom'){
        const key=game.mode==='title'||game.mode==='creator'?'title':seasonKey();
        const seq=themes[key]||themes.spring,f=seq[this.step%seq.length];
        this.tone(f,.16,'triangle',.0075);
        if(this.step%4===0)this.tone(f/2,.24,'sine',.004);
        this.step++;
      }
    },360);
  }
  toggle(){this.enabled=!this.enabled;if(!this.enabled&&this.musicTimer){clearInterval(this.musicTimer);this.musicTimer=null;}else this.startMusic();}
}
const audio = new SchoolAudio();

const keys = new Set();
let pointer = {x:0,y:0,down:false};
let buttons=[];
let lastTime=performance.now();

const defaultPlayer = () => ({
  name:'Akira', gender:'boy', club:'council', socialStatus:'ordinary', x:220, y:350, direction:0, anim:1,
  stats:{charisma:3,intellect:3,fitness:3,talent:3,kindness:3,courage:3,reliability:3},
  energy:100, stress:0, score:0, demerits:0, tardies:0, absences:0, detention:0, teacherTrust:0,
  relationships:Object.fromEntries(NPCS.map(n=>[n.id,0])), accomplishments:[], invitations:[],
  clubXP:0, clubRankIndex:0, clubPrestige:0, clubWins:0, clubAttendance:0,
  routeScenes:[], challengeBest:{athletics:0,arts:0,tech:0,council:0}, challengeAttempts:0, monthlyChallengeScores:[],
  phoneInbox:[], messageReplies:[], showcaseScores:[], showcaseWins:0, eventPrestige:0,
  inventory:['Student Handbook','Lunch Card'], monthlyScores:[]
});

const game = {
  mode:'title', previousMode:'title', player:defaultPlayer(), creatorGender:'boy', creatorClub:'council', creatorStatus:'ordinary',
  camera:{x:0,y:0}, year:1, month:1, day:1, time:470, timeAccumulator:0,
  scheduleStatus:{}, dayFlags:{talked:[],hotspots:[],help:0,club:0,ontime:0,event:false,brief:false,challenge:false,message:false,showcase:false},
  missions:[], notifications:[], dialogue:null, overlay:null, currentRoom:'hallway', lastSlot:null, dailyBrief:null,
  npcs:JSON.parse(JSON.stringify(NPCS)), teachers:JSON.parse(JSON.stringify(TEACHERS)),
  paused:false, showControls:true, finished:false
};

