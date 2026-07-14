// Canonical game content. Keep data declarative so it can be validated and expanded safely.

export const NPCS = [
  { id:'aiko', name:'Aiko Tanaka', gender:'girl', portrait:2, rank:1, clique:'Crest Council', x:250, y:330, stats:{charisma:9,intellect:8,fitness:4,talent:6,kindness:7,courage:6},
    bio:'Class president, immaculate planner, secretly terrified of improvising.',
    greetings:[
      'The monthly ranking board is not everything. It merely influences everything.',
      'I color-coded the festival task list. Please admire it responsibly.',
      'Leadership is mostly listening—then making a spreadsheet about what you heard.'
    ] },
  { id:'mina', name:'Mina Sato', gender:'girl', portrait:3, rank:2, clique:'Skybound Athletics', x:1000, y:590, stats:{charisma:7,intellect:5,fitness:10,talent:5,kindness:6,courage:9},
    bio:'Track captain. Competitive, direct and always carrying three spare water bottles.',
    greetings:[
      'Race you to the gym doors. Walking speed. Safety first.',
      'People think confidence means never being nervous. It means running anyway.',
      'Coach says teamwork. My legs say victory. We are negotiating.'
    ] },
  { id:'rina', name:'Rina Mori', gender:'girl', portrait:4, rank:3, clique:'Velvet Bloom Arts', x:860, y:170, stats:{charisma:8,intellect:6,fitness:3,talent:10,kindness:7,courage:5},
    bio:'Illustrator and stage designer who notices every emotional detail.',
    greetings:[
      'Hold still. The hallway light makes you look like a main character.',
      'Popularity is composition: contrast, focus, and knowing what to leave out.',
      'I painted the festival banner twice. The first version had insufficient drama.'
    ] },
  { id:'emi', name:'Emi Kuroda', gender:'girl', portrait:5, rank:4, clique:'Byte Brigade', x:1180, y:160, stats:{charisma:5,intellect:10,fitness:3,talent:8,kindness:6,courage:6},
    bio:'Robotics prodigy with dry humor and a backpack full of adapters.',
    greetings:[
      'The ranking algorithm is biased toward visible achievements. So: be visibly excellent.',
      'I built a bell timer. It is more accurate than the bell. This has caused political tension.',
      'Social networks are still networks. The nodes simply have more feelings.'
    ] },
  { id:'hana', name:'Hana Fujimoto', gender:'girl', portrait:6, rank:5, clique:'Crest Council', x:570, y:575, stats:{charisma:6,intellect:7,fitness:5,talent:6,kindness:10,courage:7},
    bio:'Peer-support volunteer who remembers everyone’s favorite snack.',
    greetings:[
      'You look like you need either advice or a rice ball. I carry both.',
      'A good reputation is what people say after you leave. Give them something kind to say.',
      'Someone dropped their notes near the lockers. Help me find the owner?'
    ] },
  { id:'ren', name:'Ren Takahashi', gender:'boy', portrait:7, rank:1, clique:'Skybound Athletics', x:1110, y:610, stats:{charisma:8,intellect:5,fitness:10,talent:5,kindness:5,courage:9},
    bio:'Basketball ace with a heroic image and an inconvenient fear of public speaking.',
    greetings:[
      'The crowd sees the winning shot. Friends see the hundred misses before it.',
      'Top rank is temporary. Locker-room teasing is eternal.',
      'I can handle a full-court press. A two-minute speech? Terrifying.'
    ] },
  { id:'haru', name:'Haru Nakamura', gender:'boy', portrait:8, rank:2, clique:'Velvet Bloom Arts', x:820, y:120, stats:{charisma:9,intellect:6,fitness:4,talent:10,kindness:6,courage:5},
    bio:'Singer and guitarist whose laid-back image hides relentless practice.',
    greetings:[
      'A good entrance is half timing, half pretending you planned the wind.',
      'I wrote a song about homework. It has no chorus because homework never ends.',
      'The arts club needs someone brave enough to test the smoke machine. Water vapor only.'
    ] },
  { id:'daichi', name:'Daichi Okada', gender:'boy', portrait:9, rank:3, clique:'Hallway Legends', x:430, y:335, stats:{charisma:10,intellect:5,fitness:6,talent:7,kindness:6,courage:8},
    bio:'Quick-witted social magnet and unofficial master of school announcements.',
    greetings:[
      'Breaking news: local student seen walking with purpose. Experts are impressed.',
      'A joke can stop a conflict faster than a lecture. Timing is the difficult part.',
      'The lunch queue has factions now. I am negotiating a noodle accord.'
    ] },
  { id:'kenji', name:'Kenji Ito', gender:'boy', portrait:10, rank:4, clique:'Byte Brigade', x:1190, y:210, stats:{charisma:5,intellect:9,fitness:4,talent:8,kindness:7,courage:5},
    bio:'Strategy-game champion who treats school life like a cooperative campaign.',
    greetings:[
      'Current objective: survive Monday. Bonus objective: look cool doing it.',
      'Friendship points should not be visible. People would min-max breakfast.',
      'The library router is named Final_Final_UseThisOne. I respect its honesty.'
    ] },
  { id:'sora', name:'Sora Watanabe', gender:'boy', portrait:11, rank:5, clique:'Crest Council', x:610, y:130, stats:{charisma:6,intellect:10,fitness:4,talent:6,kindness:8,courage:6},
    bio:'Academic star, debate finalist and calm mediator in chaotic group projects.',
    greetings:[
      'Being right is useful. Helping everyone reach the answer is leadership.',
      'I enjoy debates with rules. Hallway rumors rarely respect the format.',
      'There is a difference between influence and noise. The ranking board forgets that.'
    ] }
];
export const TEACHERS = [
  { id:'teacher_hayashi', name:'Ms. Hayashi', portrait:12, x:120, y:90, room:'homeroom', subject:'Homeroom & Social Studies', temperament:'firm but fair' },
  { id:'teacher_mori', name:'Mr. Mori', portrait:13, x:470, y:90, room:'math', subject:'Mathematics', temperament:'precise and dryly funny' },
  { id:'teacher_arai', name:'Ms. Arai', portrait:14, x:830, y:90, room:'literature', subject:'Literature', temperament:'dramatic and perceptive' },
  { id:'coach_kondo', name:'Coach Kondo', portrait:15, x:880, y:500, room:'gym', subject:'Physical Education', temperament:'energetic and safety-obsessed' }
];
