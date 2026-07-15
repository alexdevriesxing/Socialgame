const CURRENT_SAVE_VERSION = 10;
const SAVE_KEY = 'sakura-crest-social-summit';
const SAVE_BACKUP_KEY = `${SAVE_KEY}-backup`;
const SAVE_TEMP_KEY = `${SAVE_KEY}-pending`;
const SAVE_CORRUPT_KEY = `${SAVE_KEY}-corrupt`;
const LEGACY_SAVE_KEYS = ['sakura-crest-social-summit-v1'];

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const saveClone = value => typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
const finiteNumber = (value, fallback=0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const saveClamp = (value, min, max, fallback=min) => Math.max(min, Math.min(max, finiteNumber(value, fallback)));

function saveChecksum(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  let hash = 2166136261;
  for (let index=0; index<text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function migrateV1(data) {
  const migrated = saveClone(data); migrated.player ||= {};
  migrated.player.socialStatus ||= 'ordinary'; migrated.player.teacherTrust ??= 0; migrated.player.invitations ||= [];
  migrated.player.clubXP ??= 0; migrated.player.clubRankIndex ??= 0; migrated.player.clubPrestige ??= 0; migrated.player.clubWins ??= 0; migrated.player.clubAttendance ??= 0;
  migrated.player.monthlyScores ||= []; migrated.scheduleStatus ||= {}; migrated.dayFlags ||= {talked:[],hotspots:[],help:0,club:0,ontime:0,event:false}; migrated.missions ||= []; migrated.finished ??= false;
  return migrated;
}
function migrateV2(data) {
  const migrated=saveClone(data); migrated.player ||= {}; migrated.player.routeScenes ||= []; migrated.player.challengeBest ||= {athletics:0,arts:0,tech:0,council:0}; migrated.player.challengeAttempts ??= 0; migrated.player.monthlyChallengeScores ||= [];
  migrated.dayFlags ||= {talked:[],hotspots:[],help:0,club:0,ontime:0,event:false}; migrated.dayFlags.brief ??= false; migrated.dayFlags.challenge ??= false; migrated.dailyBrief ??= null; migrated.promResult ??= null; return migrated;
}
function migrateV3(data) {
  const migrated=saveClone(data); migrated.player ||= {}; migrated.player.phoneInbox ||= []; migrated.player.messageReplies ||= []; migrated.player.showcaseScores ||= []; migrated.player.showcaseWins ??= 0; migrated.player.eventPrestige ??= 0;
  migrated.dayFlags ||= {talked:[],hotspots:[],help:0,club:0,ontime:0,event:false}; migrated.dayFlags.message ??= false; migrated.dayFlags.showcase ??= false; migrated.promCompanion ??= null; return migrated;
}
function migrateV4(data) {
  const migrated=saveClone(data); migrated.player ||= {}; migrated.player.rivalScenes ||= []; migrated.player.rivalRespect ||= {}; migrated.player.rivalHeat ||= {}; migrated.player.campusActivityLog ||= []; migrated.player.campusMastery ||= {}; migrated.player.achievements ||= []; migrated.player.achievementDates ||= {}; migrated.player.onTimeClasses ??= 0;
  migrated.dayFlags ||= {talked:[],hotspots:[],help:0,club:0,ontime:0,event:false}; migrated.dayFlags.activity ??= false; return migrated;
}
function migrateV5(data) {
  const migrated=saveClone(data); migrated.player ||= {}; migrated.player.friendshipMoments ||= []; migrated.player.incidentHistory ||= []; migrated.player.legacyTags ||= {}; migrated.player.graduationLegacy ??= null; migrated.player.campusBest ||= {};
  migrated.dayFlags ||= {talked:[],hotspots:[],help:0,club:0,ontime:0,event:false}; migrated.dayFlags.incident ??= false; migrated.dayFlags.activity ??= false; return migrated;
}
function migrateV6(data) {
  const migrated=saveClone(data); migrated.player ||= {}; migrated.player.examScores ||= []; migrated.player.examBest ??= 0; migrated.player.weekendOutings ||= []; migrated.player.legacyArchive ||= []; migrated.player.newGamePlus ??= 0; migrated.player.ngPlusPerk ??= null;
  migrated.settings ||= {reducedMotion:false,highContrast:false,largeText:false,gamepad:true}; migrated.settings.reducedMotion ??= false; migrated.settings.highContrast ??= false; migrated.settings.largeText ??= false; migrated.settings.gamepad ??= true; return migrated;
}
function migrateV7(data) {
  const migrated=saveClone(data); migrated.player ||= {}; migrated.player.electionHistory ||= []; migrated.player.leadershipWins ??= 0; migrated.player.campaignBest ??= 0; migrated.player.campaignPlatform ??= null; return migrated;
}
function migrateV8(data) {
  const migrated=saveClone(data); migrated.player ||= {}; migrated.player.wallet ??= 1200;
  migrated.player.customization ||= {hair:'natural',skin:'warm',face:'classic',outfit:'uniform',accessory:'none',bag:'school',phoneTheme:'crest',roomTheme:'academy'};
  migrated.player.ownedCustomization ||= {hair:['natural'],skin:['warm'],face:['classic'],outfit:['uniform'],accessory:['none'],bag:['school'],phoneTheme:['crest'],roomTheme:['academy']};
  migrated.player.giftInventory ||= {}; migrated.player.giftHistory ||= []; migrated.player.worldVisits ||= {}; migrated.player.worldScenes ||= []; migrated.player.worldTopics ||= []; migrated.player.collectibles ||= []; migrated.player.collectionDates ||= {}; migrated.player.likedGifts ??= 0; migrated.player.roomDecor ||= {poster:null,trophy:null,memory:null,music:null}; migrated.dayFlags ||= {}; migrated.dayFlags.worldTrips ??= 0; return migrated;
}
function migrateV9(data) {
  const migrated=saveClone(data); migrated.releaseStats ||= {sessions:0,recoveredSaves:0,lastRecovery:null,lastValidated:null}; migrated.dialogueHistory ||= []; return migrated;
}

function migrateSave(raw) {
  if (!isRecord(raw)) throw new TypeError('Save data must be an object.');
  let version = Number.isInteger(raw.version) ? raw.version : 1;
  let data = isRecord(raw.data) ? raw.data : raw;
  if (version < 1 || version > CURRENT_SAVE_VERSION) throw new Error(`Unsupported save version: ${version}`);
  if (version===1){data=migrateV1(data);version=2;} if(version===2){data=migrateV2(data);version=3;} if(version===3){data=migrateV3(data);version=4;}
  if (version===4){data=migrateV4(data);version=5;} if(version===5){data=migrateV5(data);version=6;} if(version===6){data=migrateV6(data);version=7;}
  if (version===7){data=migrateV7(data);version=8;} if(version===8){data=migrateV8(data);version=9;} if(version===9){data=migrateV9(data);version=10;}
  return {version,data};
}

function normalizeSaveSnapshot(snapshot) {
  const data=saveClone(isRecord(snapshot)?snapshot:{}); data.player=isRecord(data.player)?data.player:{};
  data.year=Math.round(saveClamp(data.year,1,5,1)); data.month=Math.round(saveClamp(data.month,1,12,1)); data.day=Math.round(saveClamp(data.day,1,20,1)); data.time=saveClamp(data.time,0,900,470);
  const player=data.player; player.name=String(player.name||'Akira').slice(0,24); player.gender=['boy','girl'].includes(player.gender)?player.gender:'boy'; player.club=['athletics','arts','tech','council'].includes(player.club)?player.club:'council'; player.socialStatus=['established','ordinary','outsider'].includes(player.socialStatus)?player.socialStatus:'ordinary';
  player.energy=saveClamp(player.energy,0,100,100); player.stress=saveClamp(player.stress,0,100,0); player.score=saveClamp(player.score,-5000,100000,0); player.wallet=Math.round(saveClamp(player.wallet,0,999999,1200));
  player.x=saveClamp(player.x,0,1280,220); player.y=saveClamp(player.y,0,800,350); player.clubXP=saveClamp(player.clubXP,0,100000,0); player.clubRankIndex=Math.round(saveClamp(player.clubRankIndex,0,3,0)); player.clubPrestige=saveClamp(player.clubPrestige,0,100000,0);
  player.tardies=Math.round(saveClamp(player.tardies,0,999,0)); player.absences=Math.round(saveClamp(player.absences,0,999,0)); player.demerits=Math.round(saveClamp(player.demerits,0,999,0)); player.detention=Math.round(saveClamp(player.detention,0,999,0));
  player.stats=isRecord(player.stats)?player.stats:{}; for(const stat of ['charisma','intellect','fitness','talent','kindness','courage','reliability'])player.stats[stat]=saveClamp(player.stats[stat],0,20,3);
  player.relationships=isRecord(player.relationships)?player.relationships:{}; for(const key of Object.keys(player.relationships))player.relationships[key]=saveClamp(player.relationships[key],-10,20,0);
  for(const key of ['accomplishments','invitations','monthlyScores','routeScenes','rivalScenes','campusActivityLog','achievements','friendshipMoments','incidentHistory','examScores','weekendOutings','legacyArchive','electionHistory','monthlyChallengeScores','phoneInbox','messageReplies','showcaseScores','worldScenes','worldTopics','collectibles','giftHistory'])if(!Array.isArray(player[key]))player[key]=[];
  data.scheduleStatus=isRecord(data.scheduleStatus)?data.scheduleStatus:{}; data.dayFlags=isRecord(data.dayFlags)?data.dayFlags:{}; data.missions=Array.isArray(data.missions)?data.missions:[]; data.npcs=Array.isArray(data.npcs)?data.npcs:[]; data.settings=isRecord(data.settings)?data.settings:{}; data.dialogueHistory=Array.isArray(data.dialogueHistory)?data.dialogueHistory.slice(-80):[];
  data.releaseStats=isRecord(data.releaseStats)?data.releaseStats:{sessions:0,recoveredSaves:0,lastRecovery:null,lastValidated:null}; data.releaseStats.sessions=Math.round(saveClamp(data.releaseStats.sessions,0,1000000,0)); data.releaseStats.recoveredSaves=Math.round(saveClamp(data.releaseStats.recoveredSaves,0,1000000,0));
  return data;
}

function validateSaveSnapshot(snapshot) {
  const issues=[]; if(!isRecord(snapshot))issues.push('snapshot is not an object'); if(!isRecord(snapshot?.player))issues.push('player is missing');
  if(!Number.isInteger(snapshot?.year)||snapshot.year<1||snapshot.year>5)issues.push('year is out of range'); if(!Number.isInteger(snapshot?.month)||snapshot.month<1||snapshot.month>12)issues.push('month is out of range'); if(!Number.isInteger(snapshot?.day)||snapshot.day<1||snapshot.day>20)issues.push('day is out of range');
  if(!Number.isFinite(snapshot?.time)||snapshot.time<0||snapshot.time>900)issues.push('time is out of range'); if(!Number.isFinite(snapshot?.player?.energy)||snapshot.player.energy<0||snapshot.player.energy>100)issues.push('energy is out of range'); if(!Number.isFinite(snapshot?.player?.stress)||snapshot.player.stress<0||snapshot.player.stress>100)issues.push('stress is out of range');
  return {valid:issues.length===0,issues};
}

function parseSaveCandidate(serialized) {
  const parsed=JSON.parse(serialized); if(!isRecord(parsed))throw new Error('Save envelope is not an object.');
  if(parsed.checksum&&parsed.checksum!==saveChecksum(parsed.data))throw new Error('Save checksum mismatch.');
  const migrated=migrateSave(parsed); const data=normalizeSaveSnapshot(migrated.data); const validation=validateSaveSnapshot(data); if(!validation.valid)throw new Error(`Invalid save: ${validation.issues.join(', ')}`);
  return {data,version:migrated.version,originalVersion:Number.isInteger(parsed.version)?parsed.version:1};
}

let lastSaveRecovery={source:null,recovered:false,failures:[],at:null};
function getSaveRecoveryReport(){return saveClone(lastSaveRecovery);}
function quarantineSave(storage,serialized,reason){try{storage.setItem(SAVE_CORRUPT_KEY,JSON.stringify({capturedAt:new Date().toISOString(),reason,serialized:String(serialized).slice(0,250000)}));}catch{}}

function writeSave(storage,snapshot,options={}) {
  const data=normalizeSaveSnapshot(snapshot); data.releaseStats.lastValidated=new Date().toISOString();
  const envelope={version:CURRENT_SAVE_VERSION,savedAt:new Date().toISOString(),checksum:saveChecksum(data),data}; const serialized=JSON.stringify(envelope);
  if(!options.skipBackup){const current=storage.getItem(SAVE_KEY);if(current){try{parseSaveCandidate(current);storage.setItem(SAVE_BACKUP_KEY,current);}catch{}}}
  storage.setItem(SAVE_TEMP_KEY,serialized); storage.setItem(SAVE_KEY,serialized); storage.removeItem(SAVE_TEMP_KEY); return envelope;
}

function readSave(storage) {
  const candidates=[SAVE_KEY,SAVE_TEMP_KEY,SAVE_BACKUP_KEY,...LEGACY_SAVE_KEYS]; const failures=[];
  for(const key of candidates){const serialized=storage.getItem(key);if(!serialized)continue;try{const candidate=parseSaveCandidate(serialized);const recovered=key!==SAVE_KEY;candidate.data.releaseStats.recoveredSaves+=(recovered?1:0);candidate.data.releaseStats.lastRecovery=recovered?{source:key,at:new Date().toISOString()}:candidate.data.releaseStats.lastRecovery;
      lastSaveRecovery={source:key,recovered,failures:[...failures],at:new Date().toISOString()}; if(recovered||candidate.originalVersion!==CURRENT_SAVE_VERSION)writeSave(storage,candidate.data,{skipBackup:key===SAVE_BACKUP_KEY}); return candidate.data;
    }catch(error){failures.push({key,message:error?.message||String(error)});if(key===SAVE_KEY||key===SAVE_TEMP_KEY)quarantineSave(storage,serialized,error?.message||String(error));}}
  lastSaveRecovery={source:null,recovered:false,failures,at:new Date().toISOString()}; return null;
}

function deleteSave(storage) {
  for(const key of [SAVE_KEY,SAVE_BACKUP_KEY,SAVE_TEMP_KEY,SAVE_CORRUPT_KEY,...LEGACY_SAVE_KEYS])storage.removeItem(key);
  lastSaveRecovery={source:null,recovered:false,failures:[],at:null};
}