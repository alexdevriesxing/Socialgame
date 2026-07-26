// Canonical game content. Keep data declarative so it can be validated and expanded safely.

const CLASS_PROMPTS = {
  homeroom: [
    { text:'Ms. Hayashi asks for a volunteer to welcome a nervous transfer student.', choices:[
      { text:'Give a warm introduction.', effects:{charisma:1,kindness:1,score:8}, result:'Your calm welcome earns grateful smiles across the room.' },
      { text:'Invite them to sit with your group.', effects:{kindness:2,score:6}, result:'A seat opens, and so does a new connection.' },
      { text:'Let Aiko handle it.', effects:{reliability:1,score:2}, result:'You support the class president quietly from the second row.' }
    ]},
    { text:'The class must choose a festival theme before the bell.', choices:[
      { text:'Pitch “Starlight City.”', effects:{talent:1,charisma:1,score:8}, result:'The room lights up with ideas for neon constellations.' },
      { text:'Build a quick vote.', effects:{intellect:1,reliability:1,score:7}, result:'Your fair system avoids an argument and lands on a popular choice.' },
      { text:'Ask the quiet students first.', effects:{kindness:2,score:7}, result:'Several excellent ideas finally get heard.' }
    ]}
  ],
  math: [
    { text:'Mr. Mori writes: “A fundraiser sells 48 buns at ¥180 each. Costs are ¥5,400. Profit?”', choices:[
      { text:'¥3,240', correct:true, effects:{intellect:2,score:10}, result:'Correct. Mr. Mori nods with the enthusiasm of a satisfied calculator.' },
      { text:'¥8,640', effects:{stress:1,score:-2}, result:'That is revenue, not profit. You make a careful correction.' },
      { text:'Ask Sora to explain the method.', effects:{intellect:1,kindness:1,score:4}, result:'Sora explains it clearly, and you remember the distinction.' }
    ]},
    { text:'Your group must build the tallest paper tower using only six sheets.', choices:[
      { text:'Triangular supports.', effects:{intellect:1,talent:1,score:9}, result:'The tower survives the desk-shake test.' },
      { text:'Coordinate the team.', effects:{charisma:1,reliability:1,score:8}, result:'Everyone gets a role and the tower rises on schedule.' },
      { text:'Decorate it first.', effects:{talent:1,score:2}, result:'It is beautiful. It is also fourteen centimeters tall.' }
    ]}
  ],
  literature: [
    { text:'Ms. Arai asks why the hero pauses before opening the final letter.', choices:[
      { text:'They fear becoming a different person.', effects:{intellect:1,kindness:1,score:9}, result:'“Exactly,” Ms. Arai says, delighted by the emotional reading.' },
      { text:'The author needs suspense.', effects:{talent:1,score:7}, result:'A practical answer, but a sharp one. The class laughs.' },
      { text:'The letter is probably cursed.', effects:{charisma:1,score:5}, result:'Ms. Arai pretends to object, then writes “excellent genre instinct.”' }
    ]},
    { text:'You must perform a two-line scene with a classmate.', choices:[
      { text:'Play it sincerely.', effects:{courage:1,talent:1,score:9}, result:'The room goes quiet in the best possible way.' },
      { text:'Turn it into comedy.', effects:{charisma:2,score:8}, result:'Even Ms. Arai hides a smile behind her book.' },
      { text:'Help your partner shine.', effects:{kindness:2,score:8}, result:'Your support makes the whole scene stronger.' }
    ]}
  ],
  pe: [
    { text:'Coach Kondo organizes a relay. Your team is one runner short.', choices:[
      { text:'Run the final leg.', effects:{fitness:2,courage:1,score:10}, result:'You cross the line exhausted and one step ahead.' },
      { text:'Plan the baton exchanges.', effects:{intellect:1,reliability:1,score:8}, result:'Clean handoffs win more time than raw speed.' },
      { text:'Encourage the nervous runner.', effects:{kindness:1,charisma:1,score:8}, result:'They find their rhythm and finish to loud cheers.' }
    ]},
    { text:'A ball rolls toward the equipment cart during warm-up.', choices:[
      { text:'Stop it safely with your foot.', effects:{fitness:1,reliability:1,score:7}, result:'Minor hazard avoided. Coach gives you an approving thumbs-up.' },
      { text:'Call out a warning.', effects:{courage:1,reliability:1,score:6}, result:'Everyone pauses before the cart can topple.' },
      { text:'Attempt a dramatic bicycle kick.', effects:{stress:1,score:-4}, result:'Coach catches the ball and assigns you a safety refresher.' }
    ]}
  ],
  social: [
    { text:'The class debates whether rankings motivate students or divide them.', choices:[
      { text:'Argue for transparent rules.', effects:{intellect:1,courage:1,score:9}, result:'Your evidence forces both sides to sharpen their arguments.' },
      { text:'Argue for private feedback.', effects:{kindness:1,charisma:1,score:8}, result:'The room considers the people behind the numbers.' },
      { text:'Propose both monthly ranks and personal goals.', effects:{intellect:1,kindness:1,reliability:1,score:10}, result:'Ms. Hayashi calls it “the first genuinely useful compromise today.”' }
    ]}
  ],
  closing: [
    { text:'Ms. Hayashi asks who will check the classroom windows before leaving.', choices:[
      { text:'Volunteer.', effects:{reliability:2,score:7}, result:'A tiny responsibility, noticed by exactly the right people.' },
      { text:'Do it with a classmate.', effects:{kindness:1,reliability:1,score:6}, result:'The work is quick, and the conversation is good.' },
      { text:'Slip out before anyone asks.', effects:{score:-3,stress:-1}, result:'You escape, but Aiko definitely notices.' }
    ]}
  ]
};
const CLUB_PROMPTS = {
  athletics: [
    { text:'Mina needs a strategy for the inter-class relay.', choices:[
      { text:'Train fast starts.', effects:{fitness:2,score:9}, result:'The team launches off the line like arrows.' },
      { text:'Build team morale.', effects:{charisma:1,kindness:1,score:8}, result:'Even the reserves leave practice feeling essential.' },
      { text:'Chart everyone’s best distance.', effects:{intellect:1,reliability:1,score:8}, result:'The lineup finally matches each runner’s strengths.' }
    ]}
  ],
  arts: [
    { text:'Rina asks you to rescue a festival backdrop that looks “emotionally beige.”', choices:[
      { text:'Add a dramatic skyline.', effects:{talent:2,score:9}, result:'The stage suddenly has depth, light and a destination.' },
      { text:'Organize a paint team.', effects:{charisma:1,reliability:1,score:8}, result:'Five brushes move as one.' },
      { text:'Interview the actors first.', effects:{kindness:1,talent:1,score:8}, result:'The backdrop begins reflecting the story instead of competing with it.' }
    ]}
  ],
  tech: [
    { text:'Emi’s line-following robot keeps choosing the scenic route.', choices:[
      { text:'Recalibrate the sensors.', effects:{intellect:2,score:9}, result:'The robot discovers straight lines and seems mildly disappointed.' },
      { text:'Redesign the course markers.', effects:{talent:1,intellect:1,score:8}, result:'Better contrast fixes the problem without touching the code.' },
      { text:'Document every failed attempt.', effects:{reliability:2,score:8}, result:'Your notes reveal the exact lighting condition causing the fault.' }
    ]}
  ],
  council: [
    { text:'Aiko needs a fair way to assign festival stalls.', choices:[
      { text:'Create a transparent lottery.', effects:{reliability:1,intellect:1,score:9}, result:'Even disappointed clubs agree the process was fair.' },
      { text:'Match stalls to club needs.', effects:{kindness:1,charisma:1,score:8}, result:'You prevent the gardening club from being assigned the windowless corner.' },
      { text:'Host a short mediation session.', effects:{courage:1,charisma:1,score:8}, result:'The loudest argument becomes a workable compromise.' }
    ]}
  ]
};
const DAILY_MISSIONS = [
  { id:'punctual', title:'Beat the Bell', desc:'Attend three required classes on time.', goal:3, type:'ontime', reward:15 },
  { id:'social', title:'Open Circle', desc:'Have meaningful talks with two students.', goal:2, type:'talk', reward:12 },
  { id:'kindness', title:'Small Kindness', desc:'Help with one school problem.', goal:1, type:'help', reward:12 },
  { id:'club', title:'Show Your Colors', desc:'Complete today’s club activity.', goal:1, type:'club', reward:14 },
  { id:'explore', title:'Hallway Stories', desc:'Interact with two school hotspots.', goal:2, type:'hotspot', reward:10 },
  { id:'campus', title:'Stay After the Bell', desc:'Complete one Free Period campus activity.', goal:1, type:'activity', reward:14 }
];

// Canonical game content. Keep data declarative so it can be validated and expanded safely.

const RANDOM_EVENTS = [
  { id:'fire_drill', title:'Unexpected Fire Drill', scene:0, chance:0.11, minDay:2,
    intro:'The alarm rings between classes. It is a drill, but a first-year freezes by the lockers.',
    choices:[
      { text:'Guide them to the courtyard.', effects:{kindness:2,reliability:1,score:14,help:1}, result:'You keep your voice steady and reach the assembly point together.' },
      { text:'Alert a hall monitor.', effects:{reliability:1,score:8,help:1}, result:'You get trained help quickly and keep the route clear.' },
      { text:'Race outside for the best spot.', effects:{fitness:1,score:-8,demerits:1}, result:'Coach Kondo spots the sprint and assigns a safety reflection.' }
    ] },
  { id:'rain_leak', title:'Rainstorm Roof Leak', scene:1, chance:0.10, minDay:3,
    intro:'A sudden downpour sends water dripping near the literature-room doorway.',
    choices:[
      { text:'Set out signs and a bucket.', effects:{reliability:2,score:12,help:1}, result:'You prevent slips until the caretaker arrives.' },
      { text:'Organize a dry detour.', effects:{charisma:1,kindness:1,score:10,help:1}, result:'The hallway keeps moving without chaos.' },
      { text:'Jump over the puddle theatrically.', effects:{charisma:1,stress:1,score:-2}, result:'The landing is impressive. The splash is more impressive.' }
    ] },
  { id:'mascot', title:'The Missing Mascot Head', scene:2, chance:0.08, minDay:4,
    intro:'The foam phoenix head has vanished before the pep rally. Rumors blame every clique at once.',
    choices:[
      { text:'Trace who signed out the prop room.', effects:{intellect:2,score:14,help:1}, result:'A paperwork trail leads to the photography club, who borrowed it for portraits.' },
      { text:'Calm the accusations first.', effects:{charisma:1,kindness:1,score:12,help:1}, result:'The cliques stop blaming one another long enough to search properly.' },
      { text:'Make a replacement from a box.', effects:{talent:2,score:10,help:1}, result:'It looks more like a cheerful orange pigeon, but the rally loves it.' }
    ] },
  { id:'power_outage', title:'Ten-Minute Blackout', scene:4, chance:0.07, minDay:6,
    intro:'The lights click off during club period. Emergency lighting works, but everyone starts talking at once.',
    choices:[
      { text:'Lead a calm headcount.', effects:{courage:1,reliability:2,score:14,help:1}, result:'Every student is accounted for before the lights return.' },
      { text:'Tell a story to settle the room.', effects:{charisma:2,talent:1,score:12}, result:'The blackout becomes a strangely cozy memory.' },
      { text:'Use your phone flashlight responsibly.', effects:{reliability:1,score:8}, result:'You light the exits and preserve your battery.' }
    ] },
  { id:'rumor', title:'Hallway Rumor Spiral', scene:6, chance:0.11, minDay:2,
    intro:'A silly rumor claims one clique sabotaged another club’s poster. Voices are rising, but no one has checked the facts.',
    choices:[
      { text:'Ask for evidence, calmly.', effects:{intellect:1,courage:1,score:12,help:1}, result:'The “sabotage” turns out to be a loose piece of tape.' },
      { text:'Defuse it with a joke.', effects:{charisma:2,score:10,help:1}, result:'Everyone laughs long enough to see how absurd the rumor sounded.' },
      { text:'Walk away and do not amplify it.', effects:{reliability:1,score:6}, result:'You deny the rumor another audience.' }
    ] }
];
const BULLY_ENCOUNTERS = [
  { id:'queue', scene:3, intro:'Two older students block the lunch queue, calling it “seniority seating.” No one is hurt, but several first-years are uncomfortable.', choices:[
    { text:'Firmly point to the posted rules.', effects:{courage:2,reliability:1,score:12,help:1}, result:'The rules—and the watching cafeteria staff—end the performance.' },
    { text:'Make room by starting a second orderly line.', effects:{charisma:1,intellect:1,score:10,help:1}, result:'The crowd follows your practical solution, leaving the blockers with no audience.' },
    { text:'Get Hana or a teacher.', effects:{kindness:1,reliability:1,score:9,help:1}, result:'You bring support without escalating the situation.' }
  ]},
  { id:'nickname', scene:6, intro:'A hallway clique keeps repeating an embarrassing nickname at a quiet student. They insist it is “only a joke.”', choices:[
    { text:'Ask the student what they want.', effects:{kindness:2,courage:1,score:13,help:1}, result:'They ask for it to stop. With the boundary clear, the laughter fades.' },
    { text:'Say jokes need willing participants.', effects:{charisma:1,courage:1,score:11,help:1}, result:'The line lands without turning the hallway into a shouting match.' },
    { text:'Invite the student to walk with you.', effects:{kindness:2,score:10,help:1}, result:'You remove the audience and give them space to breathe.' }
  ]}
];
const HOTSPOTS = [
  { id:'board', name:'Ranking Board', x:640, y:330, radius:70, text:'The monthly board lists accomplishments, reliability, friendships and school contributions—not just popularity.' },
  { id:'fountain', name:'Courtyard Fountain', x:210, y:590, radius:60, text:'Students leave folded wishes near the fountain. Today’s most common wish: “Please cancel surprise quizzes.”' },
  { id:'counter', name:'Lunch Counter', x:600, y:455, radius:70, text:'Today’s special is curry bread. The sign says “mild.” Daichi has added a handwritten question mark.' },
  { id:'hoop', name:'Gym Hoop', x:1028, y:590, radius:80, text:'The backboard bears hundreds of tiny scuffs: evidence of practice nobody applauded.' },
  { id:'shelves', name:'Library Shelves', x:1180, y:145, radius:70, text:'A shelf labeled “Student Legends” contains yearbooks, competition records and one suspiciously dramatic poetry anthology.' }
];
const MONTHLY_SPECIALS = [
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

// Four complete academic years. Each month has a distinct public event, story focus,
// ranking pressure and authored opening scene. The simulation uses these entries to
// vary score multipliers, event art and month-end presentation across all 48 months.

const MONTHS = [
  ['New Beginnings','Club Recruitment Week','friendship','The front gates open beneath drifting petals. Every club wants new members, every returning student wants to be noticed, and the first ranking board is already attracting a crowd.'],
  ['Rainy Connections','Indoor Creativity Fair','talent','Rain taps against the classroom windows while clubs transform hallways into miniature studios, labs and performance spaces.'],
  ['Faster Together','Inter-Class Games','fitness','Team colors cover the school. Rival classes trade playful challenges, and even the quietest students are asked to contribute.'],
  ['Sakura Festival','Culture Festival','club','Lanterns, food stalls and painted signs take over the campus. A single successful project can reshape the rankings.'],
  ['Midterm Momentum','Study Marathon','intellect','The library stays open late. Students form study circles, tutors emerge from unlikely cliques, and stress tests every friendship.'],
  ['Summer Lights','Evening Fair','charisma','The academy glows beneath strings of lights. Informal conversations and brave invitations matter as much as formal achievements.'],
  ['Crest in the Community','Service Day','kindness','Students leave campus to help neighborhood groups. The school watches who leads, who listens and who quietly finishes the work.'],
  ['Autumn Spotlight','Performance Showcase','courage','A stage appears in the gym. Performers, designers, presenters and technical crews all compete for one unforgettable evening.'],
  ['Voices of Sakura','Crest Forum','leadership','Debates fill the assembly hall. The strongest argument is not always the loudest, and alliances begin shifting before elections.'],
  ['Winter Trials','Endurance Week','reliability','Cold mornings and difficult schedules expose weak habits. Consistency becomes more valuable than flashy one-day victories.'],
  ['Legacy Threads','Legacy Projects','relationships','Students document the people and traditions that shaped the year. Long friendships become visible in unexpected ways.'],
  ['Year-End Gala','Crest Gala','all','The year closes with awards, performances and the final ranking review. Every missed promise and every generous choice returns to the spotlight.']
];

const YEARS = [
  { stage:'First Steps', pressure:1.00, intro:'As a first-year student, you are still learning which doors open easily—and which require patience.' },
  { stage:'Rising Voices', pressure:1.08, intro:'Second year brings expectations. Younger students watch you, while established leaders protect their positions.' },
  { stage:'Leadership Season', pressure:1.16, intro:'Third year places you close to the center of school life. Decisions now affect whole clubs, classes and friendships.' },
  { stage:'The Final Ascent', pressure:1.24, intro:'The last year has begun. Every month shapes your graduation legacy and the final path to prom.' }
];

const CAMPAIGN_MONTHS = YEARS.flatMap((year, yearIndex) => MONTHS.map((month, monthIndex) => {
  const [title,event,focus,intro] = month;
  const chapter = yearIndex * 12 + monthIndex + 1;
  const yearNumber = yearIndex + 1;
  const stakes = [
    'Build a reliable first impression and identify two people worth knowing well.',
    'Turn early acquaintances into dependable allies while proving your club contribution.',
    'Balance personal ambition with visible support for classmates outside your circle.',
    'Deliver a public project without sacrificing attendance, trust or wellbeing.'
  ][yearIndex];
  const finale = monthIndex === 11
    ? `The ${year.stage.toLowerCase()} chapter ends here. Your final placement will carry momentum into ${yearNumber === 4 ? 'prom night' : 'the next academic year'}.`
    : `This month rewards ${focus === 'all' ? 'a balanced reputation' : focus} and penalizes unreliable shortcuts.`;
  return {
    chapter,
    year:yearNumber,
    month:monthIndex+1,
    stage:year.stage,
    title: yearNumber === 1 ? title : `${title}: ${year.stage}`,
    event,
    focus,
    rivalPressure:year.pressure + monthIndex * 0.006,
    scene:monthIndex,
    intro:`${year.intro}\n\n${intro}`,
    objective:stakes,
    finale
  };
}));
