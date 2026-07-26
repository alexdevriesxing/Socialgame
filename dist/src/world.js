// Expanded World v1.4 — off-campus locations, customization, gifts and duplicate-safe collections.
const WORLD_LOCATIONS = {
  home:{id:'home',name:'Bedroom Hub',icon:'⌂',color:'#c875a0',description:'Your private room, wardrobe, keepsakes and plans.',activity:'Recover, decorate and review memories.',effect:{energy:10,stress:-8}},
  shopping:{id:'shopping',name:'Shopping Street',icon:'◇',color:'#e5b84b',description:'Boutiques, stationery windows and the busiest crosswalk in the district.',activity:'Shop for style items and gifts.',effect:{charisma:1,stress:-2}},
  cafe:{id:'cafe',name:'Maple Café',icon:'☕',color:'#d88750',description:'A warm corner café where conversations last longer than intended.',activity:'Share a drink and talk.',effect:{energy:8,stress:-5}},
  arcade:{id:'arcade',name:'Starline Arcade',icon:'✦',color:'#8f79c6',description:'Rhythm cabinets, claw machines and competitive high scores.',activity:'Play games and win prizes.',effect:{courage:1,stress:-4}},
  park:{id:'park',name:'Riverside Park',icon:'♧',color:'#83b98b',description:'Open lawns, a footbridge and quiet benches under seasonal trees.',activity:'Walk, train or picnic.',effect:{fitness:1,stress:-6}},
  public_library:{id:'public_library',name:'Public Library',icon:'▤',color:'#87c9d8',description:'Three floors of books, archives and dependable silence.',activity:'Research and study.',effect:{intellect:1,stress:-3}},
  cinema:{id:'cinema',name:'Moonlight Cinema',icon:'▶',color:'#c75b7a',description:'A restored neighborhood cinema with themed retrospectives.',activity:'Watch a film and discuss it.',effect:{talent:1,stress:-5}},
  sports_center:{id:'sports_center',name:'Sports Center',icon:'⚑',color:'#d75b50',description:'Courts, a running track and supervised training rooms.',activity:'Train safely with friends.',effect:{fitness:1,energy:-5}},
  music_venue:{id:'music_venue',name:'Echo Live House',icon:'♫',color:'#d5a84f',description:'An all-ages venue for student bands and acoustic showcases.',activity:'Listen, rehearse and perform.',effect:{talent:1,stress:-3}},
  festival:{id:'festival',name:'Festival Grounds',icon:'✺',color:'#e88ea4',description:'Lantern lanes, seasonal stalls and a stage beside the shrine path.',activity:'Explore festivals and special events.',effect:{charisma:1,stress:-5}},
  museum:{id:'museum',name:'City Museum',icon:'◆',color:'#b98b55',description:'Local history, rotating art exhibitions and a rooftop view.',activity:'Explore exhibitions.',effect:{intellect:1,talent:1}},
  study_center:{id:'study_center',name:'Study Center',icon:'✓',color:'#59a98f',description:'Tutors, group rooms and exam-preparation resources.',activity:'Complete focused study.',effect:{intellect:1,reliability:1,stress:2}},
  convenience:{id:'convenience',name:'Crest Convenience',icon:'▣',color:'#55a5b8',description:'Snacks, magazines, practical gifts and late-afternoon errands.',activity:'Restock useful items.',effect:{energy:6}},
  station:{id:'station',name:'Sakura Station',icon:'⇄',color:'#5e8cc2',description:'The district transport hub, meeting point and gateway to new places.',activity:'Travel, wait and people-watch.',effect:{reliability:1}}
};
const WORLD_OFFSITE_IDS = Object.keys(WORLD_LOCATIONS).filter(id=>id!=='home');

const NPC_PREFERENCES = {
  aiko:{birthday:[1,8],interests:['student leadership','tea','local history'],likes:['stationery','tea','history'],dislikes:['prank','noisy'],favoritePlace:'cafe',topics:['fair decisions','school traditions','quiet cafés'],scenes:[
    {id:'aiko-cafe-agenda',location:'cafe',title:'The Agenda Between Us',text:'Aiko arrives with an immaculate planner, then closes it. For once, the meeting has no minutes. She admits that leadership feels lonely when every answer must sound certain.',choice:'Tell her uncertainty can be honest.',effect:{kindness:2,charisma:1}},
    {id:'aiko-museum-charter',location:'museum',title:'The First Student Charter',text:'At the museum, Aiko finds an early student-council charter. The rules are formal, but the handwritten margins are full of compromises and second thoughts.',choice:'Study the margins together.',effect:{intellect:2,reliability:1}},
    {id:'aiko-station-rain',location:'station',title:'Platform in the Rain',text:'A delayed train leaves the platform almost empty. Aiko practices a speech, stops halfway, and asks what people actually need to hear.',choice:'Help her replace slogans with specifics.',effect:{charisma:2,kindness:1}}
  ]},
  mina:{birthday:[2,14],interests:['athletics','nutrition','team rituals'],likes:['sports','energy','practical'],dislikes:['fragile','perfume'],favoritePlace:'sports_center',topics:['training plans','team trust','recovery'],scenes:[
    {id:'mina-center-laps',location:'sports_center',title:'One More Lap',text:'Mina turns a casual visit into a measured training circuit. When she notices you falling behind, she changes the pace without making a spectacle of it.',choice:'Finish the final lap together.',effect:{fitness:2,courage:1}},
    {id:'mina-park-captain',location:'park',title:'Captain Without a Whistle',text:'A children’s game in the park loses its referee. Mina quietly organizes teams, explains the rules and makes sure the shyest player gets a real turn.',choice:'Help keep the game fair.',effect:{kindness:2,fitness:1}},
    {id:'mina-convenience-recovery',location:'convenience',title:'The Recovery Shelf',text:'Mina compares recovery drinks with the seriousness of an exam. She laughs when you catch her reading every label twice.',choice:'Build a sensible post-training basket.',effect:{reliability:2,energy:8}}
  ]},
  rina:{birthday:[3,6],interests:['theatre','fashion','film'],likes:['art','fashion','music'],dislikes:['generic','sports'],favoritePlace:'cinema',topics:['costume design','favorite scenes','creative courage'],scenes:[
    {id:'rina-cinema-costume',location:'cinema',title:'Costume in the Last Row',text:'Rina spends half the film studying how costume colors change with the story. In the empty lobby afterward, she sketches a better final outfit on a ticket stub.',choice:'Ask what the colors reveal.',effect:{talent:2,intellect:1}},
    {id:'rina-shopping-window',location:'shopping',title:'Window-Display Rebellion',text:'A boutique display is perfectly coordinated and completely lifeless. Rina rearranges nothing, but narrates the daring version she wishes it had been.',choice:'Design the imaginary display together.',effect:{talent:2,charisma:1}},
    {id:'rina-festival-stage',location:'festival',title:'Lantern Stage Fright',text:'Minutes before an open-mic performance, Rina admits that confidence is sometimes only good posture and a memorized first line.',choice:'Stand in the wings for her opening.',effect:{courage:2,talent:1}}
  ]},
  emi:{birthday:[4,17],interests:['coding','robotics','puzzles'],likes:['tech','books','practical'],dislikes:['perfume','fashion'],favoritePlace:'public_library',topics:['debugging','robot ethics','puzzle design'],scenes:[
    {id:'emi-library-archive',location:'public_library',title:'The Manual Nobody Borrowed',text:'Emi finds an old robotics manual with handwritten corrections from a former student. The best notes are not answers, but warnings about assumptions.',choice:'Digitize the useful annotations.',effect:{intellect:2,reliability:1}},
    {id:'emi-arcade-pattern',location:'arcade',title:'Impossible Pattern',text:'A rhythm cabinet appears random until Emi notices a repeating fault in the timing. She could exploit it for a high score, but pauses.',choice:'Report the fault after one honest run.',effect:{reliability:2,courage:1}},
    {id:'emi-study-prototype',location:'study_center',title:'Prototype at Closing Time',text:'The study center is closing, but Emi’s tiny sensor finally works. She looks happier about the clean test log than the blinking light.',choice:'Celebrate the documented result.',effect:{intellect:2,stress:-3}}
  ]},
  hana:{birthday:[5,11],interests:['gardening','animals','photography'],likes:['nature','cute','tea'],dislikes:['noisy','tech'],favoritePlace:'park',topics:['seasonal flowers','animal care','small acts'],scenes:[
    {id:'hana-park-stray',location:'park',title:'A Name for the Stray',text:'Hana knows the park cat is not really a stray, but still carries water for it. She remembers every person who has helped care for it.',choice:'Add your name to the care rota.',effect:{kindness:3}},
    {id:'hana-cafe-photo',location:'cafe',title:'Steam on the Window',text:'Hana photographs reflections in the café glass rather than the drinks. She says ordinary places become important when someone notices them carefully.',choice:'Take a photo of the shared table.',effect:{talent:1,kindness:2}},
    {id:'hana-festival-flowers',location:'festival',title:'Flowers After Fireworks',text:'After the fireworks, Hana helps vendors collect dropped flower decorations before they are trampled.',choice:'Stay until the last paper blossom is safe.',effect:{kindness:2,reliability:1}}
  ]},
  ren:{birthday:[6,3],interests:['football','strategy','street food'],likes:['sports','practical','snack'],dislikes:['fragile','formal'],favoritePlace:'sports_center',topics:['match tactics','rivalry','street food'],scenes:[
    {id:'ren-center-rematch',location:'sports_center',title:'The Friendly Rematch',text:'Ren challenges you to a short match, then spends more time explaining positioning than celebrating points.',choice:'Ask for one honest weakness to improve.',effect:{fitness:2,courage:1}},
    {id:'ren-convenience-bet',location:'convenience',title:'Loser Buys the Snack',text:'A harmless prediction game ends in a tie. Ren insists ties require both people to buy the other person’s favorite snack.',choice:'Accept the perfectly fair compromise.',effect:{charisma:1,stress:-5}},
    {id:'ren-station-away',location:'station',title:'Away-Game Platform',text:'On the platform, Ren admits away games feel easier than home games because nobody expects him to be the version they remember.',choice:'Tell him growth can surprise familiar people.',effect:{courage:2,kindness:1}}
  ]},
  haru:{birthday:[7,19],interests:['music','poetry','night walks'],likes:['music','art','tea'],dislikes:['sports','practical'],favoritePlace:'music_venue',topics:['songwriting','poetry','quiet places'],scenes:[
    {id:'haru-venue-soundcheck',location:'music_venue',title:'Before the Doors Open',text:'Haru prefers soundcheck to applause. The empty room lets every imperfect note exist without judgment.',choice:'Listen to the unfinished song.',effect:{talent:2,kindness:1}},
    {id:'haru-park-lyrics',location:'park',title:'Lyrics on the Footbridge',text:'A line of lyrics refuses to resolve. Haru reads it aloud over the river until the missing word becomes obvious.',choice:'Offer an image, not an answer.',effect:{talent:2,charisma:1}},
    {id:'haru-cafe-napkin',location:'cafe',title:'Poem on a Napkin',text:'Haru writes a four-line poem on a napkin and leaves space for your final line.',choice:'Complete the poem carefully.',effect:{talent:2,courage:1}}
  ]},
  daichi:{birthday:[8,9],interests:['comedy','sneakers','urban legends'],likes:['funny','fashion','snack'],dislikes:['formal','books'],favoritePlace:'arcade',topics:['best jokes','sneaker design','local legends'],scenes:[
    {id:'daichi-arcade-claw',location:'arcade',title:'The Impossible Claw',text:'Daichi claims the claw machine is a metaphor for society. After ten failed attempts, he quietly gives his last token to a younger child.',choice:'Cheer for the final attempt.',effect:{kindness:2,charisma:1}},
    {id:'daichi-shopping-shoes',location:'shopping',title:'Sneakers With a Story',text:'Daichi can identify every limited sneaker but chooses a plain pair because the shop owner remembers his first visit.',choice:'Ask about that first visit.',effect:{charisma:2,kindness:1}},
    {id:'daichi-station-legend',location:'station',title:'The Last-Train Legend',text:'Daichi tells a ridiculous station ghost story, then admits his grandmother told it to keep him from missing the last train.',choice:'Preserve the dramatic version.',effect:{charisma:2,reliability:1}}
  ]},
  kenji:{birthday:[10,4],interests:['science','history','chess'],likes:['books','history','tech'],dislikes:['noisy','cute'],favoritePlace:'museum',topics:['historical mysteries','experiments','strategy games'],scenes:[
    {id:'kenji-museum-map',location:'museum',title:'Map With No North',text:'Kenji finds a historical map drawn for travelers rather than rulers. Its center is a market, not a palace.',choice:'Compare whose priorities shaped the map.',effect:{intellect:3}},
    {id:'kenji-library-chess',location:'public_library',title:'Silent Chess',text:'A public-library chess game ends without either player speaking. Kenji says the silence made every choice feel more respectful.',choice:'Review the turning point together.',effect:{intellect:2,reliability:1}},
    {id:'kenji-study-proof',location:'study_center',title:'Proof in the Margin',text:'Kenji’s solution is correct, but a younger student cannot follow it. He rewrites the proof using fewer clever steps.',choice:'Praise clarity over showing off.',effect:{kindness:1,intellect:2}}
  ]},
  sora:{birthday:[12,12],interests:['travel','languages','photography'],likes:['travel','books','cute'],dislikes:['formal','sports'],favoritePlace:'station',topics:['future trips','languages','photographs'],scenes:[
    {id:'sora-station-departures',location:'station',title:'Departure Board Dreams',text:'Sora reads every destination aloud, even the ordinary commuter stops. Each name sounds like a possible future.',choice:'Choose one place to visit after graduation.',effect:{courage:2,charisma:1}},
    {id:'sora-museum-postcard',location:'museum',title:'Postcard to the Future',text:'The museum shop sells reproductions of old travel posters. Sora writes a postcard addressed to their future self.',choice:'Add a promise to remember school life.',effect:{courage:1,kindness:2}},
    {id:'sora-cinema-subtitles',location:'cinema',title:'The Subtitle Choice',text:'Sora compares two translations of the same film line. One is literal; the other preserves the feeling.',choice:'Discuss what a good translation protects.',effect:{intellect:1,charisma:2}}
  ]}
};

const GIFT_ITEMS = [
  {id:'tea-tin',name:'Seasonal Tea Tin',category:'tea',price:180,color:'#d88750'},
  {id:'sports-towel',name:'Performance Towel',category:'sports',price:220,color:'#d75b50'},
  {id:'sketch-set',name:'Pocket Sketch Set',category:'art',price:240,color:'#c875a0'},
  {id:'circuit-kit',name:'Mini Circuit Kit',category:'tech',price:280,color:'#55a5b8'},
  {id:'flower-charm',name:'Pressed-Flower Charm',category:'nature',price:160,color:'#83b98b'},
  {id:'snack-box',name:'Local Snack Box',category:'snack',price:140,color:'#e5b84b'},
  {id:'film-book',name:'Classic Film Book',category:'books',price:210,color:'#8f79c6'},
  {id:'history-postcards',name:'Historic Postcard Set',category:'history',price:170,color:'#b98b55'},
  {id:'travel-tag',name:'Station Travel Tag',category:'travel',price:150,color:'#5e8cc2'},
  {id:'music-pin',name:'Live-House Music Pin',category:'music',price:190,color:'#d5a84f'},
  {id:'cute-plush',name:'Tiny Crest Plush',category:'cute',price:260,color:'#e88ea4'},
  {id:'pen-case',name:'Structured Pen Case',category:'stationery',price:130,color:'#87c9d8'}
];

const CUSTOMIZATION_CATALOG = {
  hair:[
    {id:'natural',name:'Natural Black',color:'#2c2430',price:0},{id:'chestnut',name:'Chestnut',color:'#6f4434',price:180},{id:'sakura',name:'Sakura Rose',color:'#bd7188',price:260},{id:'midnight',name:'Midnight Blue',color:'#314b70',price:260}
  ],
  skin:[
    {id:'warm',name:'Warm',color:'#d9a77e',price:0},{id:'light',name:'Light',color:'#f0c6a2',price:120},{id:'golden',name:'Golden',color:'#c88b61',price:120},{id:'deep',name:'Deep',color:'#8d5b42',price:120}
  ],
  face:[
    {id:'classic',name:'Classic',color:'#fff6e7',price:0},{id:'glasses',name:'Round Glasses',color:'#87c9d8',price:190},{id:'freckles',name:'Freckles',color:'#d88750',price:150},{id:'confident',name:'Confident Look',color:'#e5b84b',price:150}
  ],
  outfit:[
    {id:'uniform',name:'Academy Uniform',color:'#324a66',price:0},{id:'cardigan',name:'Rose Cardigan',color:'#c75b7a',price:320},{id:'street',name:'Street Casual',color:'#4d8b68',price:340},{id:'formal',name:'Council Formal',color:'#5e5480',price:360}
  ],
  accessory:[
    {id:'none',name:'No Accessory',color:'#73798a',price:0},{id:'ribbon',name:'Crest Ribbon',color:'#e88ea4',price:140},{id:'cap',name:'Training Cap',color:'#d75b50',price:180},{id:'headphones',name:'Music Headphones',color:'#d5a84f',price:240}
  ],
  bag:[
    {id:'school',name:'School Bag',color:'#4b3e49',price:0},{id:'canvas',name:'Canvas Tote',color:'#c6b68e',price:190},{id:'sport',name:'Sports Duffel',color:'#d75b50',price:230},{id:'tech',name:'Tech Backpack',color:'#55a5b8',price:260}
  ],
  phoneTheme:[
    {id:'crest',name:'Crest Blue',color:'#4d76a8',price:0},{id:'petals',name:'Petal Pink',color:'#e88ea4',price:120},{id:'forest',name:'Forest Green',color:'#4d8b68',price:120},{id:'midnight',name:'Midnight',color:'#2b2d42',price:120}
  ],
  roomTheme:[
    {id:'academy',name:'Academy Neat',color:'#324a66',price:0},{id:'cozy',name:'Cozy Rose',color:'#8e5266',price:300},{id:'studio',name:'Creative Studio',color:'#785d8c',price:320},{id:'minimal',name:'Minimal Mint',color:'#48776b',price:320}
  ]
};

const COLLECTION_CATALOG = [
  {id:'photo-first-day',category:'yearbook',name:'First Day at Sakura Crest',source:'Begin school life'},
  {id:'photo-city-friends',category:'yearbook',name:'City Friends',source:'Complete five off-campus scenes'},
  {id:'photo-festival-night',category:'yearbook',name:'Festival Night',source:'Visit festival grounds'},
  {id:'badge-explorer',category:'badges',name:'District Explorer',source:'Visit all off-campus locations'},
  {id:'badge-gift-reader',category:'badges',name:'Thoughtful Giver',source:'Give five liked gifts'},
  {id:'badge-style',category:'badges',name:'Personal Style',source:'Equip five customized categories'},
  {id:'trophy-arcade',category:'trophies',name:'Starline High Score',source:'Explore the arcade'},
  {id:'trophy-sports',category:'trophies',name:'Community Sports Medal',source:'Explore the sports center'},
  {id:'trophy-festival',category:'trophies',name:'Festival Volunteer Cup',source:'Explore festival grounds'},
  {id:'poster-live-house',category:'posters',name:'Echo Live Poster',source:'Visit the music venue'},
  {id:'poster-cinema',category:'posters',name:'Moonlight Retrospective',source:'Visit the cinema'},
  {id:'poster-museum',category:'posters',name:'City Museum Exhibition',source:'Visit the museum'},
  ...Object.entries(NPC_PREFERENCES).flatMap(([npcId,profile])=>profile.scenes.map((scene,index)=>({id:`memory-${scene.id}`,category:'memoryCards',name:scene.title,source:`${NPCS.find(n=>n.id===npcId)?.name||npcId} off-campus scene ${index+1}`}))),
  {id:'wallpaper-spring',category:'wallpapers',name:'Spring Footbridge',source:'Visit the park in spring'},
  {id:'wallpaper-summer',category:'wallpapers',name:'Summer Festival',source:'Visit festival grounds in summer'},
  {id:'wallpaper-autumn',category:'wallpapers',name:'Autumn Station',source:'Visit the station in autumn'},
  {id:'wallpaper-winter',category:'wallpapers',name:'Winter Library',source:'Visit the public library in winter'},
  {id:'music-cafe',category:'music',name:'Maple Café Afternoon',source:'Visit the café'},
  {id:'music-arcade',category:'music',name:'Starline Challenge',source:'Visit the arcade'},
  {id:'music-live',category:'music',name:'Echo House Soundcheck',source:'Visit the music venue'},
  {id:'keepsake-ticket',category:'keepsakes',name:'First Train Ticket',source:'Visit Sakura Station'},
  {id:'keepsake-key',category:'keepsakes',name:'Bedroom Memory Key',source:'Open the bedroom hub'},
  {id:'keepsake-album',category:'keepsakes',name:'Four-Year City Album',source:'Complete all 30 off-campus scenes'}
];
const COLLECTION_CATEGORIES = [
  ['yearbook','YEARBOOK PHOTOS'],['badges','BADGES'],['trophies','TROPHIES'],['posters','POSTERS'],
  ['memoryCards','MEMORY CARDS'],['wallpapers','WALLPAPERS'],['music','MUSIC'],['keepsakes','KEEPSAKES']
];

function allWorldScenes(){return Object.entries(NPC_PREFERENCES).flatMap(([npcId,profile])=>profile.scenes.map(scene=>({...scene,npcId}))); }
function profileForNpc(id){return NPC_PREFERENCES[id]||null;}
function customizationItem(category,id){return CUSTOMIZATION_CATALOG[category]?.find(item=>item.id===id)||null;}
function giftById(id){return GIFT_ITEMS.find(item=>item.id===id)||null;}
function collectibleById(id){return COLLECTION_CATALOG.find(item=>item.id===id)||null;}

function ensureWorldState(){
  const p=game.player;
  p.wallet ??= 1200;
  p.customization ||= {hair:'natural',skin:'warm',face:'classic',outfit:'uniform',accessory:'none',bag:'school',phoneTheme:'crest',roomTheme:'academy'};
  p.ownedCustomization ||= Object.fromEntries(Object.entries(CUSTOMIZATION_CATALOG).map(([category,items])=>[category,[items[0].id]]));
  for(const [category,items] of Object.entries(CUSTOMIZATION_CATALOG)){
    p.ownedCustomization[category] ||= [items[0].id];
    if(!p.ownedCustomization[category].includes(items[0].id))p.ownedCustomization[category].unshift(items[0].id);
    if(!customizationItem(category,p.customization[category]))p.customization[category]=items[0].id;
  }
  p.giftInventory ||= {};
  p.giftHistory ||= [];
  p.worldVisits ||= {};
  p.worldScenes ||= [];
  p.worldTopics ||= [];
  p.collectibles ||= [];
  p.collectionDates ||= {};
  p.likedGifts ??= 0;
  p.roomDecor ||= {poster:null,trophy:null,memory:null,music:null};
  game.dayFlags ||= {};
  game.dayFlags.worldTrips ||= 0;
  return p;
}

function grantCollectible(id,source='World discovery'){
  ensureWorldState();
  const item=collectibleById(id);if(!item)return false;
  if(game.player.collectibles.includes(id))return false;
  game.player.collectibles.push(id);
  game.player.collectionDates[id]={year:game.year,month:game.month,day:game.day,source};
  notify(`Collection unlocked: ${item.name}`,COLORS.gold);audio.sparkle?.();saveSilently();return true;
}
function collectionCount(category){ensureWorldState();return game.player.collectibles.filter(id=>collectibleById(id)?.category===category).length;}
function worldFirstVisitReward(locationId){
  const map={park:`wallpaper-${seasonKey()}`,arcade:'trophy-arcade',sports_center:'trophy-sports',festival:'trophy-festival',music_venue:'poster-live-house',cinema:'poster-cinema',museum:'poster-museum',cafe:'music-cafe',station:'keepsake-ticket'};
  if(map[locationId])grantCollectible(map[locationId],`First visit to ${WORLD_LOCATIONS[locationId].name}`);
}
function worldTravelAllowed(){
  const slot=currentSlot();
  return game.mode==='play' && (!slot||slot.optional||game.time>=825);
}
function worldTravelCost(weekend=false){return weekend?0:8;}
function openWorldMap({weekend=false,returnType=null}={}){
  ensureWorldState();
  game.overlay={type:'worldMap',title:weekend?'Weekend District Map':'After-School District Map',weekend,returnType,page:0};
}
function openHomeHub(){ensureWorldState();grantCollectible('keepsake-key','Opened the bedroom hub');game.overlay={type:'homeHub',title:`${game.player.name}'s Bedroom`};}
function worldAvailableNpcs(locationId){
  const candidates=Object.entries(NPC_PREFERENCES).filter(([,profile])=>profile.favoritePlace===locationId||profile.scenes.some(scene=>scene.location===locationId)).map(([id])=>id);
  if(!candidates.length)return [];
  const seed=game.year*1009+game.month*101+game.day*17+locationId.length*13;
  return [candidates[Math.abs(seed)%candidates.length],candidates[(Math.abs(seed)+1)%candidates.length]].filter((id,index,array)=>array.indexOf(id)===index);
}
function visitWorldLocation(locationId,{weekend=false}={}){
  ensureWorldState();const location=WORLD_LOCATIONS[locationId];if(!location)return false;
  if(locationId==='home'){openHomeHub();return true;}
  if(!weekend&&!worldTravelAllowed()){notify('Off-campus travel opens during free periods and after 13:45.',COLORS.sky);return false;}
  const first=!game.player.worldVisits[locationId];
  game.player.worldVisits[locationId]=(game.player.worldVisits[locationId]||0)+1;
  game.dayFlags.worldTrips=(game.dayFlags.worldTrips||0)+1;
  if(first){worldFirstVisitReward(locationId);game.player.score+=3;}
  if(game.player.worldVisits[locationId]===1&&['shopping','convenience'].includes(locationId))game.player.wallet+=100;
  if(!weekend)advanceTime(worldTravelCost(false));
  game.overlay={type:'worldLocation',title:location.name,locationId,weekend,npcs:worldAvailableNpcs(locationId),explored:false};
  if(Object.keys(game.player.worldVisits).filter(id=>id!=='home').length===WORLD_OFFSITE_IDS.length)grantCollectible('badge-explorer','Visited every off-campus location');
  saveSilently();return true;
}
function exploreWorldLocation(){
  const o=game.overlay;if(o?.type!=='worldLocation'||o.explored)return;
  const location=WORLD_LOCATIONS[o.locationId];o.explored=true;applyEffects(location.effect||{score:2},`${location.name}: ${location.activity}`);game.player.wallet+=15;
  if(o.locationId==='festival')grantCollectible(`wallpaper-${seasonKey()}`,`${seasonKey()} festival visit`);
  if(!o.weekend)advanceTime(6);
  saveSilently();
}
function nextWorldScene(npcId,locationId){
  const profile=profileForNpc(npcId);if(!profile)return null;
  return profile.scenes.find(scene=>scene.location===locationId&&!game.player.worldScenes.includes(scene.id))||profile.scenes.find(scene=>!game.player.worldScenes.includes(scene.id))||null;
}
function playWorldScene(npcId,locationId){
  ensureWorldState();const npc=npcById(npcId),scene=nextWorldScene(npcId,locationId);if(!npc||!scene){notify('No new off-campus scene is available here.',COLORS.sky);return false;}
  game.overlay=null;
  openDialogue({speaker:`${npc.name} • ${scene.title}`,portrait:npc.portrait,text:scene.text,choices:[
    {text:scene.choice,effects:scene.effect,relationship:[npcId,3],result:`The afternoon becomes a memory you both keep.`,action:()=>{
      if(!game.player.worldScenes.includes(scene.id))game.player.worldScenes.push(scene.id);
      grantCollectible(`memory-${scene.id}`,scene.title);
      if(game.player.worldScenes.length>=5)grantCollectible('photo-city-friends','Completed five off-campus scenes');
      if(game.player.worldScenes.length===allWorldScenes().length)grantCollectible('keepsake-album','Completed every off-campus scene');
      saveSilently();
    }},
    {text:'Enjoy the moment quietly.',relationship:[npcId,1],effects:{stress:-3},result:'Not every meaningful moment needs a perfect line.'}
  ]});
  return true;
}
function discussWorldTopic(npcId){
  ensureWorldState();const npc=npcById(npcId),profile=profileForNpc(npcId);if(!npc||!profile)return;
  const index=(game.year+game.month+game.day+(game.player.worldTopics.filter(item=>item.startsWith(`${npcId}:`)).length))%profile.topics.length;
  const topic=profile.topics[index],key=`${npcId}:${topic}`;
  const fresh=!game.player.worldTopics.includes(key);if(fresh)game.player.worldTopics.push(key);
  game.overlay=null;openDialogue({speaker:npc.name,portrait:npc.portrait,text:`You talk about ${topic}. ${npc.name} shares a detail that would never fit into a hurried hallway conversation.`,choices:[
    {text:'Ask a thoughtful follow-up.',relationship:[npcId,fresh?2:1],effects:{charisma:1},result:fresh?'A new conversation topic is added to your phone notes.':'The familiar topic still reveals something new.'},
    {text:'Listen without redirecting.',relationship:[npcId,1],effects:{kindness:1},result:'The conversation finds its own pace.'}
  ]});
}
function openNpcProfile(npcId,returnLocation=null){ensureWorldState();game.overlay={type:'npcProfile',title:'Friend Profile',npcId,returnLocation};}
function isNpcBirthday(profile){return profile?.birthday?.[0]===game.month&&profile?.birthday?.[1]===game.day;}
function giftReaction(profile,gift){
  if(profile.likes.includes(gift.category))return 'loved';
  if(profile.dislikes.includes(gift.category))return 'disliked';
  return 'liked';
}
function openGiftSelect(npcId,returnLocation=null){ensureWorldState();game.overlay={type:'giftSelect',title:'Choose a Gift',npcId,returnLocation};}
function giveGift(npcId,giftId){
  ensureWorldState();const gift=giftById(giftId),npc=npcById(npcId),profile=profileForNpc(npcId);if(!gift||!npc||!profile||(game.player.giftInventory[giftId]||0)<1)return false;
  game.player.giftInventory[giftId]--;const reaction=giftReaction(profile,gift),birthday=isNpcBirthday(profile),bond=(reaction==='loved'?3:reaction==='liked'?1:-1)+(birthday?2:0);
  game.player.relationships[npcId]=clamp((game.player.relationships[npcId]||0)+bond,-10,20);
  game.player.giftHistory.push({npcId,giftId,reaction,birthday,year:game.year,month:game.month,day:game.day});
  if(reaction==='loved'){game.player.likedGifts++;if(game.player.likedGifts>=5)grantCollectible('badge-gift-reader','Gave five well-matched gifts');}
  game.overlay=null;openDialogue({speaker:npc.name,portrait:npc.portrait,text:`${birthday?'A birthday ribbon makes the moment feel especially important.\n\n':''}${reaction==='loved'?`“You remembered what I actually like.”`:reaction==='liked'?`“Thank you. This is thoughtful.”`:`${npc.name} accepts politely, though the choice does not fit their interests.`}`,choices:[{text:'Wish them well.',effects:{kindness:1},result:`Bond ${bond>=0?'+':''}${bond}. The gift is recorded in your friendship history.`}]});saveSilently();return true;
}
function openGiftShop(returnLocation=null){ensureWorldState();game.overlay={type:'giftShop',title:'Gift & Lifestyle Shop',returnLocation,page:0};}
function buyGift(giftId){
  ensureWorldState();const gift=giftById(giftId);if(!gift)return false;
  if(game.player.wallet<gift.price){notify('Not enough allowance.',COLORS.rose);return false;}
  game.player.wallet-=gift.price;game.player.giftInventory[giftId]=(game.player.giftInventory[giftId]||0)+1;notify(`Bought ${gift.name}`,COLORS.mint);saveSilently();return true;
}
function openCustomization(category='hair',returnType='homeHub'){ensureWorldState();game.overlay={type:'customization',title:'Style & Room Studio',category,returnType};}
function buyOrEquipCustomization(category,id){
  ensureWorldState();const item=customizationItem(category,id);if(!item)return false;const owned=game.player.ownedCustomization[category].includes(id);
  if(!owned){
    if(game.player.wallet<item.price){notify('Not enough allowance.',COLORS.rose);return false;}
    game.player.wallet-=item.price;game.player.ownedCustomization[category].push(id);notify(`Unlocked ${item.name}`,COLORS.mint);
  }
  game.player.customization[category]=id;
  const equipped=Object.entries(game.player.customization).filter(([cat,value])=>value!==CUSTOMIZATION_CATALOG[cat][0].id).length;
  if(equipped>=5)grantCollectible('badge-style','Equipped five customized categories');
  saveSilently();return true;
}
function openCollectionBook(category='yearbook'){ensureWorldState();game.overlay={type:'collectionBook',title:'Crest Collection',category,page:0};}
function decorateRoom(slot,itemId){
  ensureWorldState();if(!game.player.collectibles.includes(itemId))return false;
  game.player.roomDecor[slot]=itemId;notify(`${collectibleById(itemId)?.name||'Item'} displayed in your room`,COLORS.mint);saveSilently();return true;
}
function availableRoomItems(category){return game.player.collectibles.map(collectibleById).filter(Boolean).filter(item=>item.category===category);}
function cycleRoomDecor(slot,category){
  ensureWorldState();const items=availableRoomItems(category);if(!items.length){notify(`No ${category} collected yet.`,COLORS.sky);return;}
  const current=game.player.roomDecor[slot],index=items.findIndex(item=>item.id===current);decorateRoom(slot,items[(index+1)%items.length].id);
}
function worldBackToLocation(locationId,weekend=false){if(locationId)visitWorldLocation(locationId,{weekend});else openWorldMap({weekend});}

function drawWorldMap(o){
  overlayBase(o.title);ensureWorldState();
  text(`Allowance ¥${game.player.wallet} • Visited ${Object.keys(game.player.worldVisits).filter(id=>id!=='home').length}/${WORLD_OFFSITE_IDS.length} • Scenes ${game.player.worldScenes.length}/${allWorldScenes().length}`,82,101,13,COLORS.gold,true);
  const ids=['home',...WORLD_OFFSITE_IDS];ids.forEach((id,index)=>{
    const location=WORLD_LOCATIONS[id],col=index%4,row=Math.floor(index/4),x=76+col*205,y=122+row*82,visited=Boolean(game.player.worldVisits[id]),allowed=id==='home'||o.weekend||worldTravelAllowed();
    panel(x,y,188,70,COLORS.deep,visited?location.color:'#566074',2);text(location.icon,x+12,y+29,23,location.color,true);text(location.name,x+45,y+23,13,COLORS.paper,true);wrapped(location.activity,x+45,y+42,132,10,COLORS.cream,2);addButton(x+108,y+48,68,18,id==='home'?'OPEN':visited?'VISIT':'GO',()=>visitWorldLocation(id,{weekend:o.weekend}),allowed,false,location.color);
  });
  centered(o.weekend?'Weekend travel does not consume the school-day clock.':'Travel is available during optional periods and after 13:45.',466,11,COLORS.cream,`bold 11px ${UI_FONT}`);
  addButton(240,476,150,30,'BEDROOM',openHomeHub);addButton(405,476,150,30,'COLLECTIONS',()=>openCollectionBook());addButton(570,476,150,30,'CLOSE',()=>game.overlay=null);
}
function drawWorldLocation(o){
  ensureWorldState();const location=WORLD_LOCATIONS[o.locationId];overlayBase(location.name);
  panel(78,110,520,315,COLORS.deep,location.color,4);text(location.icon,105,186,58,location.color,true);text(location.name,190,153,25,COLORS.paper,true);wrapped(location.description,190,184,370,15,COLORS.cream,5);text(location.activity,105,270,15,COLORS.gold,true);
  const visits=game.player.worldVisits[o.locationId]||0;text(`Visits ${visits} • ${o.weekend?'Weekend outing':'School day'} • Wallet ¥${game.player.wallet}`,105,302,12,COLORS.sky,true);
  addButton(105,332,210,38,o.explored?'EXPLORED TODAY':'EXPLORE',exploreWorldLocation,!o.explored,false,location.color);
  if(['shopping','convenience','cafe','arcade','music_venue','museum'].includes(o.locationId))addButton(335,332,210,38,'SHOP & GIFTS',()=>openGiftShop(o.locationId),true,false,COLORS.gold);
  else addButton(335,332,210,38,'VIEW COLLECTION',()=>openCollectionBook(),true,false,COLORS.navy);
  text('WHO IS HERE',630,131,15,COLORS.gold,true);
  if(!o.npcs.length)wrapped('The location is quiet today. Explore it or return another time.',630,165,230,13,COLORS.cream,4);
  o.npcs.forEach((npcId,index)=>{
    const npc=npcById(npcId),profile=profileForNpc(npcId),y=155+index*124,scene=nextWorldScene(npcId,o.locationId);
    panel(620,y,260,108,COLORS.deep,profile.favoritePlace===o.locationId?COLORS.gold:COLORS.sky,2);
    const sx=(npc.portrait%4)*PORTRAIT_CELL,sy=Math.floor(npc.portrait/4)*PORTRAIT_CELL;ctx.drawImage(images.portraits,sx,sy,PORTRAIT_CELL,PORTRAIT_CELL,630,y+10,54,54);
    text(npc.name,695,y+27,14,COLORS.paper,true);text(isNpcBirthday(profile)?'BIRTHDAY TODAY':profile.interests[0],695,y+47,10,isNpcBirthday(profile)?COLORS.gold:COLORS.cream,true);
    addButton(630,y+75,72,22,'PROFILE',()=>openNpcProfile(npcId,o.locationId),true,false,COLORS.navy);
    addButton(710,y+75,72,22,scene?'SCENE':'TALK',()=>scene?playWorldScene(npcId,o.locationId):discussWorldTopic(npcId),true,false,profile.favoritePlace===o.locationId?COLORS.gold:COLORS.blue);
    addButton(790,y+75,72,22,'GIFT',()=>openGiftSelect(npcId,o.locationId),true,false,COLORS.rose);
  });
  addButton(315,456,150,34,'DISTRICT MAP',()=>openWorldMap({weekend:o.weekend}));addButton(495,456,150,34,'RETURN TO SCHOOL',()=>game.overlay=null);
}
function drawHomeHub(){
  ensureWorldState();const theme=customizationItem('roomTheme',game.player.customization.roomTheme),accent=theme?.color||COLORS.navy;overlayBase(`${game.player.name}'s Bedroom`);
  panel(75,110,560,330,accent,COLORS.gold,4);ctx.globalAlpha=.22;for(let i=0;i<12;i++){ctx.fillStyle=i%2?COLORS.paper:COLORS.pink;ctx.fillRect(90+i*45,125,22,290);}ctx.globalAlpha=1;
  panel(105,145,210,110,COLORS.deep,COLORS.sky,3);text('WARDROBE MIRROR',125,172,14,COLORS.gold,true);drawCharacter(game.player.gender==='boy'?'player_boy':'player_girl',3,0,174,179,72,96);text(customizationItem('outfit',game.player.customization.outfit)?.name||'Uniform',125,240,11,COLORS.cream,true);
  panel(340,145,260,110,COLORS.deep,COLORS.pink,3);text('DISPLAY WALL',360,172,14,COLORS.gold,true);wrapped(game.player.roomDecor.poster?collectibleById(game.player.roomDecor.poster)?.name:'No poster displayed',360,202,220,13,COLORS.paper,2);wrapped(game.player.roomDecor.trophy?collectibleById(game.player.roomDecor.trophy)?.name:'No trophy displayed',360,235,220,12,COLORS.cream,2);
  panel(105,278,495,125,COLORS.deep,COLORS.mint,3);text('MEMORY DESK',125,306,14,COLORS.gold,true);wrapped(game.player.roomDecor.memory?collectibleById(game.player.roomDecor.memory)?.name:'Choose a memory card from your collection.',125,335,220,13,COLORS.paper,3);text(`Music: ${game.player.roomDecor.music?collectibleById(game.player.roomDecor.music)?.name:'Room ambience'}`,365,335,12,COLORS.cream,true);text(`Collection ${game.player.collectibles.length}/${COLLECTION_CATALOG.length} • Wallet ¥${game.player.wallet}`,365,371,12,COLORS.gold,true);
  text('ROOM ACTIONS',670,126,15,COLORS.gold,true);addButton(660,150,220,36,'STYLE & WARDROBE',()=>openCustomization('hair'));addButton(660,198,220,36,'COLLECTION BOOK',()=>openCollectionBook());addButton(660,246,220,36,'CYCLE POSTER',()=>cycleRoomDecor('poster','posters'),true,false,COLORS.pink);addButton(660,294,220,36,'CYCLE TROPHY',()=>cycleRoomDecor('trophy','trophies'),true,false,COLORS.gold);addButton(660,342,220,36,'CYCLE MEMORY',()=>cycleRoomDecor('memory','memoryCards'),true,false,COLORS.sky);addButton(660,390,220,36,'CYCLE MUSIC',()=>cycleRoomDecor('music','music'),true,false,COLORS.mint);addButton(370,462,220,34,'CLOSE BEDROOM',()=>game.overlay=null);
}
function drawCustomization(o){
  ensureWorldState();overlayBase(o.title);const categories=Object.keys(CUSTOMIZATION_CATALOG),category=o.category||categories[0];
  categories.forEach((id,index)=>addButton(72+index*102,88,94,25,id.replace('phoneTheme','PHONE').replace('roomTheme','ROOM').toUpperCase(),()=>o.category=id,true,id===category,COLORS.navy));
  text(`${category.toUpperCase()} • Wallet ¥${game.player.wallet}`,82,135,16,COLORS.gold,true);
  CUSTOMIZATION_CATALOG[category].forEach((item,index)=>{
    const x=85+index*205,y=165,owned=game.player.ownedCustomization[category].includes(item.id),equipped=game.player.customization[category]===item.id;
    panel(x,y,180,190,COLORS.deep,equipped?COLORS.gold:item.color,3);ctx.fillStyle=item.color;ctx.fillRect(x+28,y+25,124,72);text(item.name,x+15,y+125,14,COLORS.paper,true);text(owned?'OWNED':`¥${item.price}`,x+15,y+150,12,owned?COLORS.mint:COLORS.gold,true);addButton(x+15,y+158,150,25,equipped?'EQUIPPED':owned?'EQUIP':'BUY & EQUIP',()=>buyOrEquipCustomization(category,item.id),true,equipped,item.color);
  });
  panel(175,380,610,55,COLORS.deep,COLORS.sky,2);text('CURRENT LOOK',195,404,12,COLORS.gold,true);text(Object.entries(game.player.customization).map(([cat,id])=>customizationItem(cat,id)?.name).filter(Boolean).join(' • '),195,426,11,COLORS.cream,true);
  addButton(365,465,230,32,'RETURN TO BEDROOM',openHomeHub);
}
function drawGiftShop(o){
  ensureWorldState();overlayBase(o.title);text(`Allowance ¥${game.player.wallet}`,720,101,14,COLORS.gold,true);
  GIFT_ITEMS.forEach((gift,index)=>{const col=index%4,row=Math.floor(index/4),x=72+col*205,y=125+row*104,count=game.player.giftInventory[gift.id]||0;panel(x,y,188,90,COLORS.deep,gift.color,2);text(gift.name,x+12,y+24,13,COLORS.paper,true);text(gift.category.toUpperCase(),x+12,y+45,10,gift.color,true);text(`¥${gift.price} • Owned ${count}`,x+12,y+68,11,COLORS.gold,true);addButton(x+113,y+58,62,21,'BUY',()=>buyGift(gift.id),true,false,gift.color);});
  addButton(275,462,190,32,'BACK TO LOCATION',()=>worldBackToLocation(o.returnLocation));addButton(495,462,190,32,'DISTRICT MAP',()=>openWorldMap());
}
function drawGiftSelect(o){
  ensureWorldState();const npc=npcById(o.npcId),profile=profileForNpc(o.npcId);overlayBase(`${npc.name} • Gift`);
  text(`Birthday ${profile.birthday[0]}/${profile.birthday[1]} • Interests: ${profile.interests.join(', ')}`,82,101,13,COLORS.gold,true);
  const owned=GIFT_ITEMS.filter(gift=>(game.player.giftInventory[gift.id]||0)>0);
  if(!owned.length){panel(150,165,660,160,COLORS.deep,COLORS.sky,3);centered('No gifts in your bag',220,24,COLORS.paper,'bold 24px Trebuchet MS');centered('Visit a shop on the district map to buy thoughtful gifts.',270,14,COLORS.cream,'bold 14px Trebuchet MS');}
  owned.slice(0,12).forEach((gift,index)=>{const col=index%4,row=Math.floor(index/4),x=72+col*205,y=128+row*92,reaction=giftReaction(profile,gift);panel(x,y,188,78,COLORS.deep,gift.color,2);text(gift.name,x+10,y+24,12,COLORS.paper,true);text(`Owned ${game.player.giftInventory[gift.id]}`,x+10,y+45,10,COLORS.cream,true);text(reaction==='loved'?'MATCHES INTEREST':reaction==='disliked'?'POOR MATCH':'NEUTRAL',x+10,y+65,9,reaction==='loved'?COLORS.mint:reaction==='disliked'?COLORS.rose:COLORS.sky,true);addButton(x+113,y+48,64,21,'GIVE',()=>giveGift(o.npcId,gift.id),true,false,gift.color);});
  addButton(265,462,200,32,'BUY GIFTS',()=>openGiftShop(o.returnLocation));addButton(495,462,200,32,'BACK',()=>worldBackToLocation(o.returnLocation));
}
function drawNpcProfile(o){
  ensureWorldState();const npc=npcById(o.npcId),profile=profileForNpc(o.npcId);overlayBase(`${npc.name} • Profile`);
  const sx=(npc.portrait%4)*PORTRAIT_CELL,sy=Math.floor(npc.portrait/4)*PORTRAIT_CELL;ctx.drawImage(images.portraits,sx,sy,PORTRAIT_CELL,PORTRAIT_CELL,100,135,160,160);
  text(npc.name,300,150,25,COLORS.paper,true);text(`${npc.clique} • Bond ${game.player.relationships[npc.id]||0}`,300,178,14,COLORS.gold,true);text(`Birthday: Month ${profile.birthday[0]}, Day ${profile.birthday[1]}`,300,208,13,isNpcBirthday(profile)?COLORS.gold:COLORS.cream,true);text(`Favorite place: ${WORLD_LOCATIONS[profile.favoritePlace].name}`,300,235,13,COLORS.sky,true);
  wrapped(`Interests: ${profile.interests.join(', ')}.`,300,270,540,14,COLORS.paper,3);wrapped(`Likes: ${profile.likes.join(', ')}. Avoid: ${profile.dislikes.join(', ')}.`,300,320,540,13,COLORS.cream,3);text(`Off-campus scenes ${profile.scenes.filter(scene=>game.player.worldScenes.includes(scene.id)).length}/3 • Gifts ${game.player.giftHistory.filter(g=>g.npcId===npc.id).length}`,300,380,13,COLORS.mint,true);
  addButton(195,450,180,34,'CONVERSATION TOPIC',()=>discussWorldTopic(npc.id));addButton(390,450,180,34,'CHOOSE GIFT',()=>openGiftSelect(npc.id,o.returnLocation),true,false,COLORS.rose);addButton(585,450,180,34,'BACK',()=>worldBackToLocation(o.returnLocation));
}
function drawCollectionBook(o){
  ensureWorldState();overlayBase(o.title);const categories=COLLECTION_CATEGORIES,category=o.category||categories[0][0];
  categories.forEach(([id,label],index)=>addButton(66+index*104,86,96,25,label.split(' ')[0],()=>{o.category=id;o.page=0;},true,id===category,COLORS.navy));
  const items=COLLECTION_CATALOG.filter(item=>item.category===category),page=clamp(o.page||0,0,Math.max(0,Math.ceil(items.length/12)-1)),visible=items.slice(page*12,page*12+12);
  text(`${categories.find(entry=>entry[0]===category)?.[1]} • ${collectionCount(category)}/${items.length} • Total ${game.player.collectibles.length}/${COLLECTION_CATALOG.length}`,82,132,14,COLORS.gold,true);
  visible.forEach((item,index)=>{const col=index%4,row=Math.floor(index/4),x=72+col*205,y=150+row*86,unlocked=game.player.collectibles.includes(item.id);panel(x,y,188,72,unlocked?COLORS.deep:'#181b27',unlocked?COLORS.gold:'#4c5262',2);text(unlocked?'◆':'◇',x+10,y+25,16,unlocked?COLORS.gold:'#646b7e',true);wrapped(unlocked?item.name:'Locked collectible',x+36,y+22,138,12,unlocked?COLORS.paper:'#73798a',2);wrapped(item.source,x+12,y+55,164,9,unlocked?COLORS.cream:'#646b7e',2);});
  addButton(220,462,130,32,'PREVIOUS',()=>o.page=Math.max(0,page-1),page>0);addButton(370,462,220,32,'BEDROOM',openHomeHub);addButton(610,462,130,32,'NEXT',()=>o.page=Math.min(Math.max(0,Math.ceil(items.length/12)-1),page+1),page<Math.ceil(items.length/12)-1);
}

function validateExpandedWorld(){
  const issues=[],profiles=Object.entries(NPC_PREFERENCES),scenes=allWorldScenes();
  if(WORLD_OFFSITE_IDS.length!==13)issues.push(`Expected 13 off-campus locations, found ${WORLD_OFFSITE_IDS.length}.`);
  if(profiles.length!==NPCS.length)issues.push(`Expected ${NPCS.length} preference profiles, found ${profiles.length}.`);
  for(const npc of NPCS){
    const profile=profileForNpc(npc.id);if(!profile)issues.push(`${npc.id} has no preference profile.`);
    else{
      if(profile.scenes.length!==3)issues.push(`${npc.id} has ${profile.scenes.length} off-campus scenes.`);
      if(!WORLD_LOCATIONS[profile.favoritePlace])issues.push(`${npc.id} has an invalid favorite place.`);
      for(const scene of profile.scenes)if(!WORLD_LOCATIONS[scene.location])issues.push(`${scene.id} has an invalid location.`);
    }
  }
  if(scenes.length!==NPCS.length*3)issues.push(`Expected ${NPCS.length*3} scenes, found ${scenes.length}.`);
  const collectionIds=COLLECTION_CATALOG.map(item=>item.id);if(new Set(collectionIds).size!==collectionIds.length)issues.push('Collection IDs are not unique.');
  if(Object.keys(CUSTOMIZATION_CATALOG).length!==8)issues.push('Expected eight customization categories.');
  return {valid:issues.length===0,issues,locations:WORLD_OFFSITE_IDS.length,profiles:profiles.length,scenes:scenes.length,customizationCategories:Object.keys(CUSTOMIZATION_CATALOG).length,collectibles:COLLECTION_CATALOG.length};
}

const worldOriginalReset=resetGame;
resetGame=function(){worldOriginalReset();ensureWorldState();grantCollectible('photo-first-day','Started a new school life');};
const worldOriginalLoad=loadGame;
loadGame=function(){const loaded=worldOriginalLoad();if(loaded)ensureWorldState();return loaded;};

const worldOriginalDrawOverlay=drawOverlay;
drawOverlay=function(){
  const o=game.overlay;
  if(o?.type==='worldMap')drawWorldMap(o);
  else if(o?.type==='worldLocation')drawWorldLocation(o);
  else if(o?.type==='homeHub')drawHomeHub(o);
  else if(o?.type==='customization')drawCustomization(o);
  else if(o?.type==='giftShop')drawGiftShop(o);
  else if(o?.type==='giftSelect')drawGiftSelect(o);
  else if(o?.type==='npcProfile')drawNpcProfile(o);
  else if(o?.type==='collectionBook')drawCollectionBook(o);
  else worldOriginalDrawOverlay();
};

const worldOriginalHud=drawHudPanel;
drawHudPanel=function(){
  worldOriginalHud();
  ctx.fillStyle=COLORS.panel;ctx.fillRect(734,504,212,35);
  addButton(736,508,98,24,'WORLD [X]',()=>openWorldMap(),worldTravelAllowed(),false,COLORS.gold);
  addButton(846,508,98,24,'ROOM [B]',openHomeHub,true,false,COLORS.pink);
};

const worldOriginalDrawDayEnd=drawDayEnd;
drawDayEnd=function(o){worldOriginalDrawDayEnd(o);addButton(704,82,155,27,'EVENING CITY [X]',()=>openWorldMap({weekend:false}),true,false,COLORS.gold);};
const worldOriginalDrawMonthEnd=drawMonthEnd;
drawMonthEnd=function(o){worldOriginalDrawMonthEnd(o);addButton(704,82,155,27,'WEEKEND CITY [X]',()=>openWorldMap({weekend:true}),true,false,COLORS.gold);};

const worldOriginalDrawCharacter=drawCharacter;
drawCharacter=function(name,frameColumn,directionRow,x,y,width=64,height=86){
  worldOriginalDrawCharacter(name,frameColumn,directionRow,x,y,width,height);
  if(name!=='player_boy'&&name!=='player_girl')return;
  ensureWorldState();const style=game.player.customization;
  const hair=customizationItem('hair',style.hair),outfit=customizationItem('outfit',style.outfit),accessory=style.accessory,face=style.face,bag=customizationItem('bag',style.bag);
  ctx.save();ctx.globalAlpha=.58;ctx.fillStyle=hair?.color||'#2c2430';ctx.fillRect(x+width*.28,y+height*.07,width*.44,height*.08);
  ctx.fillStyle=outfit?.color||COLORS.navy;ctx.fillRect(x+width*.28,y+height*.64,width*.44,height*.06);
  ctx.fillStyle=bag?.color||'#4b3e49';ctx.fillRect(x+width*.76,y+height*.55,width*.12,height*.22);
  ctx.globalAlpha=.9;ctx.strokeStyle=customizationItem('face',face)?.color||COLORS.paper;ctx.lineWidth=Math.max(1,width/44);
  if(face==='glasses'){ctx.strokeRect(x+width*.31,y+height*.29,width*.14,height*.07);ctx.strokeRect(x+width*.52,y+height*.29,width*.14,height*.07);}
  if(accessory==='ribbon'){ctx.fillStyle=COLORS.pink;ctx.beginPath();ctx.moveTo(x+width*.72,y+height*.13);ctx.lineTo(x+width*.88,y+height*.07);ctx.lineTo(x+width*.86,y+height*.21);ctx.fill();}
  if(accessory==='cap'){ctx.fillStyle=COLORS.red;ctx.fillRect(x+width*.25,y+height*.03,width*.5,height*.06);}
  if(accessory==='headphones'){ctx.strokeStyle=COLORS.gold;ctx.lineWidth=Math.max(2,width/22);ctx.beginPath();ctx.arc(x+width*.5,y+height*.22,width*.24,Math.PI,0);ctx.stroke();}
  ctx.restore();
};

window.addEventListener('keydown',event=>{
  const key=event.key.toLowerCase();
  if(game.overlay?.type==='worldMap'&&key==='escape'){game.overlay=null;return;}
  if(game.mode==='play'&&!game.dialogue){
    if(key==='x'){
      event.preventDefault();
      if(game.overlay?.type==='dayEnd')openWorldMap({weekend:false});
      else if(game.overlay?.type==='monthEnd')openWorldMap({weekend:true});
      else if(!game.overlay)openWorldMap();
    }
    if(key==='b'&&!game.overlay){event.preventDefault();openHomeHub();}
    if(key==='u'&&!game.overlay){event.preventDefault();openCollectionBook();}
  }
});
ensureWorldState();
