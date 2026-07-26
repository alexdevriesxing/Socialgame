// Headless runtime smoke test with a minimal DOM/canvas shim.
const listeners={};
class Element {
  constructor(id){this.id=id;this.classList={_s:new Set(id==='creator'||id==='loading'?[]:[]),add(v){this._s.add(v)},remove(v){this._s.delete(v)},contains(v){return this._s.has(v)}};this.value='Akira';}
  addEventListener(type,fn){(listeners[`${this.id}:${type}`]??=[]).push(fn)}
}
const ctx=new Proxy({
  imageSmoothingEnabled:false,textAlign:'left',textBaseline:'alphabetic',
  measureText(t){return{width:String(t).length*8}},
  createLinearGradient(){return{addColorStop(){}}},
}, {get(o,p){if(p in o)return o[p];return()=>{}},set(o,p,v){o[p]=v;return true}});
const canvas=new Element('game');canvas.width=960;canvas.height=540;canvas.getContext=()=>ctx;canvas.getBoundingClientRect=()=>({left:0,top:0,width:960,height:540});
const elements={game:canvas,creator:new Element('creator'),nameInput:new Element('nameInput'),confirmName:new Element('confirmName'),loading:new Element('loading')};
elements.creator.classList.add('hidden');
globalThis.document={getElementById:id=>elements[id]};
globalThis.window=globalThis;window.addEventListener=(t,f)=>{(listeners[`window:${t}`]??=[]).push(f)};
window.AudioContext=class{constructor(){this.currentTime=0;this.state='running';this.destination={}}createOscillator(){return{type:'',frequency:{value:0},connect(){},start(){},stop(){}}}createGain(){return{gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}}resume(){}};
globalThis.localStorage={_d:{},getItem(k){return this._d[k]??null},setItem(k,v){this._d[k]=v}};
globalThis.requestAnimationFrame=()=>0;
globalThis.Image=class{set src(v){this._src=v;queueMicrotask(()=>this.onload?.())}};
globalThis.performance={now:()=>1000};
globalThis.setInterval=()=>1;globalThis.clearInterval=()=>{};
await import('../dist/src/main.js');
await new Promise(r=>setTimeout(r,10));
if(!elements.loading.classList.contains('hidden'))throw new Error('Assets did not complete loading');
console.log('Smoke test passed: game module initialized with all assets and UI hooks.');
