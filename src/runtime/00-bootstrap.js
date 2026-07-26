import {
  SCHOOL_NAME, ROOMS, SCHEDULE, CLUBS, SOCIAL_STATUS_LEVELS, NPCS, TEACHERS, CLASS_PROMPTS,
  CLUB_PROMPTS, DAILY_MISSIONS, RANDOM_EVENTS, BULLY_ENCOUNTERS, HOTSPOTS,
  MONTHLY_SPECIALS, RANKING_RULES
} from './content.js';
import { SAVE_KEY, readSave, writeSave } from './save.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
const creator = document.getElementById('creator');
const nameInput = document.getElementById('nameInput');
const confirmName = document.getElementById('confirmName');
const loading = document.getElementById('loading');

const W = canvas.width;
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

const imageNames = [
  'keyart','school_map','portraits','ui_icons','player_boy','player_girl',
  ...NPCS.map(n=>n.id), ...TEACHERS.map(t=>t.id)
];
const images = {};

function loadImage(name) {
  return new Promise((resolve,reject)=>{
    const img = new Image();
    img.onload=()=>{images[name]=img;resolve();};
    img.onerror=reject;
    img.src=`assets/${name}.png`;
  });
}

function drawCharacter(name, frameColumn, directionRow, x, y, width=48, height=64) {
  const img=images[name];
  if(!img)return;
  ctx.drawImage(img,frameColumn*24,directionRow*32,24,32,x,y,width,height);
}

class PixelAudio {
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
  bad(){this.tone(180,.15,'sawtooth',.025);}
  bell(){[784,988,1175].forEach((f,i)=>setTimeout(()=>this.tone(f,.2,'sine',.035),i*120));}
  startMusic(){
    if(this.musicTimer||!this.enabled)return;
    this.ensure();
    const seq=[262,330,392,330,294,349,440,349,262,330,392,523,440,392,330,294];
    this.musicTimer=setInterval(()=>{
      if(game.mode==='title'||game.mode==='creator'||game.mode==='play'){
        const f=seq[this.step++%seq.length];this.tone(f,.12,'triangle',.008);
      }
    },320);
  }
  toggle(){this.enabled=!this.enabled;if(!this.enabled&&this.musicTimer){clearInterval(this.musicTimer);this.musicTimer=null;}else this.startMusic();}
}
const audio = new PixelAudio();

const keys = new Set();
let pointer = {x:0,y:0,down:false};
let buttons=[];
let lastTime=performance.now();

const defaultPlayer = () => ({
  name:'Akira', gender:'boy', club:'council', socialStatus:'ordinary', x:220, y:350, direction:0, anim:1,
  stats:{charisma:3,intellect:3,fitness:3,talent:3,kindness:3,courage:3,reliability:3},
  energy:100, stress:0, score:0, demerits:0, tardies:0, absences:0, detention:0, teacherTrust:0,
  relationships:Object.fromEntries(NPCS.map(n=>[n.id,0])),
  relationshipMemories:Object.fromEntries(NPCS.map(n=>[n.id,[]])),
  socialProfiles:Object.fromEntries(NPCS.map(n=>[n.id,{trust:0,respect:0,strain:0}])),
  promises:[], accomplishments:[], invitations:[],
  clubXP:0, clubRankIndex:0, clubPrestige:0, clubWins:0, clubAttendance:0,
  inventory:['Student Handbook','Lunch Card'], monthlyScores:[]
});

const game = {
  mode:'title', previousMode:'title', player:defaultPlayer(), creatorGender:'boy', creatorClub:'council', creatorStatus:'ordinary',
  camera:{x:0,y:0}, year:1, month:1, day:1, time:470, timeAccumulator:0,
  scheduleStatus:{}, dayFlags:{talked:[],hotspots:[],help:0,club:0,ontime:0,event:false},
  missions:[], notifications:[], dialogue:null, overlay:null, currentRoom:'hallway', lastSlot:null,
  npcs:JSON.parse(JSON.stringify(NPCS)), teachers:JSON.parse(JSON.stringify(TEACHERS)),
  paused:false, showControls:true, finished:false
};
