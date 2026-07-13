// Canonical game content. Keep data declarative so it can be validated and expanded safely.

export const RANDOM_EVENTS = [
  { id:'fire_drill', title:'Unexpected Fire Drill', chance:0.11, minDay:2,
    intro:'The alarm rings between classes. It is a drill, but a first-year freezes by the lockers.',
    choices:[
      { text:'Guide them to the courtyard.', effects:{kindness:2,reliability:1,score:14,help:1}, result:'You keep your voice steady and reach the assembly point together.' },
      { text:'Alert a hall monitor.', effects:{reliability:1,score:8,help:1}, result:'You get trained help quickly and keep the route clear.' },
      { text:'Race outside for the best spot.', effects:{fitness:1,score:-8,demerits:1}, result:'Coach Kondo spots the sprint and assigns a safety reflection.' }
    ] },
  { id:'rain_leak', title:'Rainstorm Roof Leak', chance:0.10, minDay:3,
    intro:'A sudden downpour sends water dripping near the literature-room doorway.',
    choices:[
      { text:'Set out signs and a bucket.', effects:{reliability:2,score:12,help:1}, result:'You prevent slips until the caretaker arrives.' },
      { text:'Organize a dry detour.', effects:{charisma:1,kindness:1,score:10,help:1}, result:'The hallway keeps moving without chaos.' },
      { text:'Jump over the puddle theatrically.', effects:{charisma:1,stress:1,score:-2}, result:'The landing is impressive. The splash is more impressive.' }
    ] },
  { id:'mascot', title:'The Missing Mascot Head', chance:0.08, minDay:4,
    intro:'The foam phoenix head has vanished before the pep rally. Rumors blame every clique at once.',
    choices:[
      { text:'Trace who signed out the prop room.', effects:{intellect:2,score:14,help:1}, result:'A paperwork trail leads to the photography club, who borrowed it for portraits.' },
      { text:'Calm the accusations first.', effects:{charisma:1,kindness:1,score:12,help:1}, result:'The cliques stop blaming one another long enough to search properly.' },
      { text:'Make a replacement from a box.', effects:{talent:2,score:10,help:1}, result:'It looks more like a cheerful orange pigeon, but the rally loves it.' }
    ] },
  { id:'power_outage', title:'Ten-Minute Blackout', chance:0.07, minDay:6,
    intro:'The lights click off during club period. Emergency lighting works, but everyone starts talking at once.',
    choices:[
      { text:'Lead a calm headcount.', effects:{courage:1,reliability:2,score:14,help:1}, result:'Every student is accounted for before the lights return.' },
      { text:'Tell a story to settle the room.', effects:{charisma:2,talent:1,score:12}, result:'The blackout becomes a strangely cozy memory.' },
      { text:'Use your phone flashlight responsibly.', effects:{reliability:1,score:8}, result:'You light the exits and preserve your battery.' }
    ] },
  { id:'rumor', title:'Hallway Rumor Spiral', chance:0.11, minDay:2,
    intro:'A silly rumor claims one clique sabotaged another club’s poster. Voices are rising, but no one has checked the facts.',
    choices:[
      { text:'Ask for evidence, calmly.', effects:{intellect:1,courage:1,score:12,help:1}, result:'The “sabotage” turns out to be a loose piece of tape.' },
      { text:'Defuse it with a joke.', effects:{charisma:2,score:10,help:1}, result:'Everyone laughs long enough to see how absurd the rumor sounded.' },
      { text:'Walk away and do not amplify it.', effects:{reliability:1,score:6}, result:'You deny the rumor another audience.' }
    ] }
];
export const BULLY_ENCOUNTERS = [
  { id:'queue', intro:'Two older students block the lunch queue, calling it “seniority seating.” No one is hurt, but several first-years are uncomfortable.', choices:[
    { text:'Firmly point to the posted rules.', effects:{courage:2,reliability:1,score:12,help:1}, result:'The rules—and the watching cafeteria staff—end the performance.' },
    { text:'Make room by starting a second orderly line.', effects:{charisma:1,intellect:1,score:10,help:1}, result:'The crowd follows your practical solution, leaving the blockers with no audience.' },
    { text:'Get Hana or a teacher.', effects:{kindness:1,reliability:1,score:9,help:1}, result:'You bring support without escalating the situation.' }
  ]},
  { id:'nickname', intro:'A hallway clique keeps repeating an embarrassing nickname at a quiet student. They insist it is “only a joke.”', choices:[
    { text:'Ask the student what they want.', effects:{kindness:2,courage:1,score:13,help:1}, result:'They ask for it to stop. With the boundary clear, the laughter fades.' },
    { text:'Say jokes need willing participants.', effects:{charisma:1,courage:1,score:11,help:1}, result:'The line lands without turning the hallway into a shouting match.' },
    { text:'Invite the student to walk with you.', effects:{kindness:2,score:10,help:1}, result:'You remove the audience and give them space to breathe.' }
  ]}
];
export const HOTSPOTS = [
  { id:'board', name:'Ranking Board', x:640, y:330, radius:70, text:'The monthly board lists accomplishments, reliability, friendships and school contributions—not just popularity.' },
  { id:'fountain', name:'Courtyard Fountain', x:210, y:590, radius:60, text:'Students leave folded wishes near the fountain. Today’s most common wish: “Please cancel surprise quizzes.”' },
  { id:'counter', name:'Lunch Counter', x:600, y:455, radius:70, text:'Today’s special is curry bread. The sign says “mild.” Daichi has added a handwritten question mark.' },
  { id:'hoop', name:'Gym Hoop', x:1028, y:590, radius:80, text:'The backboard bears hundreds of tiny scuffs: evidence of practice nobody applauded.' },
  { id:'shelves', name:'Library Shelves', x:1180, y:145, radius:70, text:'A shelf labeled “Student Legends” contains yearbooks, competition records and one suspiciously dramatic poetry anthology.' }
];
export const MONTHLY_SPECIALS = [
  { month:1, name:'New Beginnings', event:'Club Recruitment Week', bonus:'Friendship gains are slightly increased.' },
  { month:2, name:'Rainy Season', event:'Indoor Creativity Fair', bonus:'Talent and intellect activities gain extra points.' },
  { month:3, name:'Sports Month', event:'Inter-Class Games', bonus:'Fitness and teamwork matter most.' },
  { month:4, name:'Culture Month', event:'Sakura Festival', bonus:'Club reputation can swing the rankings.' },
  { month:5, name:'Midterm Focus', event:'Study Marathon', bonus:'Reliability protects against stress.' },
  { month:6, name:'Summer Lights', event:'Evening Fair', bonus:'Social choices open special scenes.' },
  { month:7, name:'Community Month', event:'Neighborhood Service Day', bonus:'Kindness earns public recognition.' },
  { month:8, name:'Performance Month', event:'Autumn Showcase', bonus:'Talent and courage are highlighted.' },
  { month:9, name:'Debate Season', event:'Crest Forum', bonus:'Intellect and charisma shape outcomes.' },
  { month:10, name:'Winter Trials', event:'Endurance Week', bonus:'Fitness and reliability resist setbacks.' },
  { month:11, name:'Reflection Month', event:'Legacy Projects', bonus:'Long friendships become more valuable.' },
  { month:12, name:'Finale Month', event:'Year-End Gala', bonus:'All achievements are reviewed.' }
];
