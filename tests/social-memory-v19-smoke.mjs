import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const NPCS=[
  {id:'aiko',name:'Aiko',clique:'Crest Council',greetings:['Hello'],bio:'Council student',portrait:0},
  {id:'ren',name:'Ren',clique:'Crest Council',greetings:['Hey'],bio:'Council rival',portrait:1}
];
const context={console,NPCS,COLORS:{gold:'gold',rose:'rose'},window:null};context.window=context;
context.game={year:1,month:1,day:1,time:720,mode:'play',player:{score:0,relationships:{aiko:8,ren:8},stats:{kindness:3,reliability:3,courage:3,intellect:3,charisma:3},socialStatus:'ordinary'},dayFlags:{talked:[],help:0},dialogue:null};
context.clamp=(n,a,b)=>Math.max(a,Math.min(b,n));context.statusScore=value=>value;context.notify=()=>{};context.audio={good(){}};
context.currentSlot=()=>({id:'lunch'});context.clubConfig=()=>({name:'Crest Council'});context.relationshipTier=()=> 'Friend';context.cliqueAdvice=()=> 'Lead fairly.';
context.progressMission=()=>{};context.sameLadder=()=>false;context.adjustRivalry=()=>{};context.nextFriendshipMoment=()=>null;context.nextRivalryScene=()=>null;context.nextRouteScene=()=>null;
context.openDialogue=dialogue=>{context.game.dialogue=dialogue;};context.resetGame=function(){};context.loadGame=function(){return true;};context.showMorningBrief=function(){};
context.closeDialogue=function(index=0){const dialogue=context.game.dialogue,choice=dialogue?.choices?.[index];if(choice?.relationship){const[id,delta]=choice.relationship;context.game.player.relationships[id]=(context.game.player.relationships[id]||0)+delta;}if(choice?.action)choice.action();context.game.dialogue=null;};
context.triggerNpcTalk=function(){};
vm.createContext(context);
vm.runInContext(await readFile('src/social-memory-v19.js','utf8'),context,{filename:'src/social-memory-v19.js'});

const aiko=NPCS[0];
context.triggerNpcTalk(aiko);
if(context.game.dialogue.choices[1].text!=='Promise to help after class.')throw new Error('Promise option is missing from an ordinary conversation.');
context.closeDialogue(1);
let promises=context.SakuraSocialMemoryV19.promises();
if(promises.length!==1||promises[0].status!=='pending'||promises[0].due!==2)throw new Error(`Promise creation failed: ${JSON.stringify(promises)}`);

context.game.day=2;context.game.dayFlags.talked=[];context.triggerNpcTalk(aiko);
if(context.game.dialogue.choices[0].text!=='Follow through on your promise.')throw new Error('Promise follow-through option is missing.');
context.closeDialogue(0);promises=context.SakuraSocialMemoryV19.promises();
if(promises[0].status!=='fulfilled')throw new Error('Promise fulfillment did not persist.');
const trusted=context.SakuraSocialMemoryV19.profile('aiko');
if(trusted.trust<4||trusted.respect<3||trusted.warmth<2)throw new Error(`Promise rewards were not applied: ${JSON.stringify(trusted)}`);

context.game.day=3;context.game.dayFlags.talked=[];context.triggerNpcTalk(aiko);context.closeDialogue(1);
context.game.day=5;context.game.dayFlags.talked=[];context.triggerNpcTalk(aiko);
if(!context.game.dialogue.speaker.includes('Broken Promise'))throw new Error('Overdue promise did not trigger its consequence scene.');
context.closeDialogue(2);
const conflict=context.SakuraSocialMemoryV19.profile('aiko');
if(conflict.strain<3||conflict.trust>=trusted.trust)throw new Error(`Broken-promise consequences were not applied: ${JSON.stringify(conflict)}`);

context.game.player.socialMemory.aiko.strain=5;context.game.player.socialPromises=[];context.game.day=6;context.triggerNpcTalk(aiko);
if(!context.game.dialogue.speaker.includes('Unresolved Tension'))throw new Error('High strain did not trigger reconciliation.');
const validation=context.SakuraSocialMemoryV19.validate();
if(!validation.valid||validation.npcs!==2)throw new Error(`Social-memory validation failed: ${JSON.stringify(validation)}`);

const index=await readFile('index.html','utf8');const worker=await readFile('sw.js','utf8');const manifest=JSON.parse(await readFile('build-manifest.json','utf8'));
if(!index.includes('src/social-memory-v19.js')||!worker.includes("'./src/social-memory-v19.js'")||!manifest.files.includes('src/social-memory-v19.js'))throw new Error('Deep Social Memory is not registered across the production artifact.');
if(manifest.version!=='1.9.0'||!index.includes('name="sakura-release" content="1.9.0"'))throw new Error('v1.9 release metadata is inconsistent.');
console.log('Deep Social Memory v1.9 passed promise, consequence, reconciliation, bounds and artifact-registration checks.');
