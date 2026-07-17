// Thirty bespoke friendship-route scenes: three chapters for each recurring student.
// Route scenes unlock at bond 4, 9 and 15 and are permanently recorded in the save.
const scene = (id, threshold, title, sceneIndex, text, choices) => ({ id, threshold, title, scene: sceneIndex, text, choices });
const choice = (text, effects, result, bond=2) => ({ text, effects, result, bond });

const RELATIONSHIP_ROUTES = {
  aiko: [
    scene('aiko-1',4,'The Unscheduled Minute',0,'Aiko is alone beside the ranking board, holding a perfectly organized folder and staring at one completely blank page.\n\n“I scheduled every task except the part where I decide what I actually want.”',[
      choice('Help her write one personal goal.',{kindness:1,reliability:1,score:8},'Aiko writes: “Make one decision because it feels right.” She underlines it twice.'),
      choice('Suggest an unplanned walk around the courtyard.',{courage:1,charisma:1,score:7},'The walk lasts seven minutes. Aiko calls it “reckless” and looks delighted.'),
      choice('Offer to take one council task off her list.',{reliability:2,score:8},'Her shoulders lower by a fraction. For Aiko, that counts as a dramatic emotional scene.')
    ]),
    scene('aiko-2',9,'The Vote Nobody Wins',4,'Two clubs are demanding the same festival space. Aiko has a fair solution, but either choice will disappoint someone.\n\n“I know how to make the decision. I do not know how to stop everyone from resenting me.”',[
      choice('Stand beside her while she explains it publicly.',{courage:1,reliability:1,score:11},'The decision remains unpopular, but nobody can call it secret or careless.',3),
      choice('Help both clubs design a compromise.',{intellect:1,kindness:1,score:10},'The shared stage becomes better than either original proposal.',3),
      choice('Remind her that leadership is not universal approval.',{charisma:1,courage:1,score:9},'Aiko exhales. “Please repeat that next time I forget.”',3)
    ]),
    scene('aiko-3',15,'A Page Without Columns',7,'Aiko gives you a handwritten letter. There are no bullet points, headings or color codes.\n\n“You taught me that trust cannot always be audited. This is terrifying. I think that means it matters.”',[
      choice('Tell her the honest, imperfect letter is enough.',{kindness:2,score:15},'Aiko smiles without checking whether anyone is watching.',4),
      choice('Promise to keep challenging her plans gently.',{courage:1,reliability:1,score:14},'“Good,” she says. “I need one person who is not impressed by a spreadsheet.”',4),
      choice('Give her your own unscheduled promise.',{charisma:1,kindness:1,score:14},'The promise becomes a private tradition between two future leaders.',4)
    ])
  ],
  mina: [
    scene('mina-1',4,'The Slow Lap',2,'Mina is walking the track instead of running. She admits that her ankle is sore and that she has told nobody.\n\n“If I rest, someone else gets faster.”',[
      choice('Convince her that recovery is training.',{kindness:1,intellect:1,score:8},'Mina reluctantly schedules a rest day and calls it “strategic not-running.”'),
      choice('Walk one careful lap with her.',{fitness:1,kindness:1,score:7},'The slow lap becomes one of your longest conversations.'),
      choice('Offer to reorganize practice around her recovery.',{reliability:2,score:8},'The team improves its baton work while Mina heals.')
    ]),
    scene('mina-2',9,'Captain of the Bench',3,'A first-year runner freezes before a relay trial. Mina wants to replace them before the team loses confidence.\n\n“They are ready physically. I cannot run courage for them.”',[
      choice('Ask Mina to share her own pre-race fear.',{charisma:1,kindness:1,score:11},'Hearing that the captain gets nervous too gives the runner permission to try.',3),
      choice('Create a low-pressure practice start.',{fitness:1,reliability:1,score:10},'One quiet start becomes three confident ones.',3),
      choice('Volunteer to run beside them for the first ten meters.',{courage:1,fitness:1,score:10},'They finish the trial alone, but they begin it knowing they are not abandoned.',3)
    ]),
    scene('mina-3',15,'Finish Line, No Crowd',6,'After the final practice, Mina challenges you to one last race. There are no spectators and no ranking points.\n\n“This one is just to remember who we became.”',[
      choice('Race seriously until the final step.',{fitness:2,score:15},'You both collapse laughing beyond the line. The result becomes permanently disputed.',4),
      choice('Match her pace and finish together.',{kindness:1,reliability:1,score:14},'Mina complains for exactly five seconds, then keeps the finish photo.',4),
      choice('Let her win, then admit it immediately.',{charisma:1,courage:1,score:13},'She demands a rematch and calls you an impossible friend.',4)
    ])
  ],
  rina: [
    scene('rina-1',4,'Emotionally Beige',1,'Rina has painted the same backdrop three times and hates every version.\n\n“They are technically good. That is somehow worse.”',[
      choice('Ask what feeling the scene needs.',{talent:1,kindness:1,score:8},'The fourth version begins with a feeling instead of a color palette.'),
      choice('Add one deliberately strange detail.',{courage:1,talent:1,score:7},'A tiny red umbrella changes the entire composition.'),
      choice('Make her take a snack break.',{kindness:2,score:7},'The painting survives ten minutes without supervision. So does Rina.')
    ]),
    scene('rina-2',9,'The Portrait She Hid',4,'You find a portrait in the art room storage rack. It is unmistakably you, painted during an ordinary hallway moment.\n\nRina appears behind you. “That was not ready to become a conversation.”',[
      choice('Ask what she noticed in that moment.',{kindness:1,charisma:1,score:11},'She describes the exact second you chose to help someone when nobody was looking.',3),
      choice('Offer to sit for a proper portrait.',{courage:1,talent:1,score:10},'The official portrait is beautiful. The hidden one remains her favorite.',3),
      choice('Promise not to show anyone.',{reliability:2,score:10},'Rina trusts you with the painting—and several more unfinished truths.',3)
    ]),
    scene('rina-3',15,'Leave One Corner Unfinished',7,'Rina asks you to sign the final festival mural. One corner is intentionally unpainted.\n\n“Finished things pretend nothing else can happen.”',[
      choice('Sign beside the unfinished corner.',{talent:1,kindness:1,score:15},'Your names sit beside a space reserved for everything after graduation.',4),
      choice('Add a tiny symbol only you two understand.',{charisma:1,talent:1,score:14},'Years later, visitors still wonder what it means.',4),
      choice('Tell her the mural already feels alive.',{kindness:2,score:14},'Rina looks at the wall, then at you. “Good. So do I.”',4)
    ])
  ],
  emi: [
    scene('emi-1',4,'Unexpected Input',1,'Emi’s robot has started waving at random students. She insists it is a sensor fault, but the code contains a variable named make_friend.\n\n“This is not evidence.”',[
      choice('Help debug the social experiment.',{intellect:1,kindness:1,score:8},'The robot waves only when greeted first. Emi calls this “consent-aware networking.”'),
      choice('Wave back at the robot.',{charisma:1,courage:1,score:7},'The robot plays a victory tone. Emi definitely programmed that part.'),
      choice('Protect the embarrassing variable name.',{reliability:2,score:7},'Emi quietly renames it friendshipProtocol and trusts you more.')
    ]),
    scene('emi-2',9,'The Failure Log',5,'Emi’s competition prototype fails in front of the entire club. She begins deleting the test logs.\n\n“If the data survives, so does the humiliation.”',[
      choice('Save a copy and analyze it together.',{intellect:2,score:11},'The failure reveals a fix nobody would have found from a perfect test.',3),
      choice('Tell the club exactly what went wrong.',{courage:1,reliability:1,score:10},'Honesty turns embarrassment into a shared engineering problem.',3),
      choice('Make a joke, then stay to rebuild.',{charisma:1,kindness:1,score:10},'Emi laughs once. Four hours later, the prototype works.',3)
    ]),
    scene('emi-3',15,'Offline Mode',6,'Emi asks you to spend an afternoon without phones, laptops or timers. She has printed a paper map and looks deeply suspicious of it.\n\n“I need to know whether friendship still works without notifications.”',[
      choice('Follow the map and get cheerfully lost.',{courage:1,kindness:1,score:15},'The wrong turn becomes the part you both remember best.',4),
      choice('Turn the day into a handwritten field log.',{intellect:1,talent:1,score:14},'The log is half observations and half jokes nobody else could decode.',4),
      choice('Tell her silence does not need debugging.',{kindness:2,score:14},'You sit beside the fountain without solving anything. It works.',4)
    ])
  ],
  hana: [
    scene('hana-1',4,'The Person With Every Snack',0,'Hana has advice, bandages and snacks for everyone. Today her own lunch is missing.\n\n“I gave it away by accident. Three separate accidents.”',[
      choice('Split your lunch with her.',{kindness:2,score:8},'Hana finally accepts the kind of help she gives so easily.'),
      choice('Organize a snack rescue among friends.',{charisma:1,reliability:1,score:7},'The resulting lunch is nutritionally confusing but emotionally excellent.'),
      choice('Ask why she never saves anything for herself.',{courage:1,kindness:1,score:8},'The question stays with her longer than the meal.')
    ]),
    scene('hana-2',9,'Advice Without an Answer',2,'A student asks Hana to solve a family problem she cannot fix. Hana is shaken by being unable to provide an answer.\n\n“What is the point of being dependable if I cannot make things better?”',[
      choice('Remind her that listening is also help.',{kindness:2,score:11},'Hana returns without a solution and gives the student her full attention.',3),
      choice('Help her find an adult support resource.',{intellect:1,reliability:1,score:10},'Care becomes a bridge to someone properly equipped to help.',3),
      choice('Stay with Hana while she processes it.',{kindness:1,courage:1,score:10},'For once, the support volunteer is allowed to need support.',3)
    ]),
    scene('hana-3',15,'One Rice Ball Saved',7,'At the year-end gala, Hana hands you a rice ball wrapped in a note: “Reserved before helping everyone else.”\n\n“I am practicing.”',[
      choice('Tell her you are proud of the practice.',{kindness:2,score:15},'Hana laughs, cries a little, and makes you promise to practice too.',4),
      choice('Save half for tomorrow together.',{reliability:1,kindness:1,score:14},'The smallest plan becomes a promise that extends beyond school.',4),
      choice('Give her your own carefully saved snack.',{charisma:1,kindness:1,score:14},'The exchange is ridiculous, sincere and perfectly balanced.',4)
    ])
  ],
  ren: [
    scene('ren-1',4,'Two-Minute Terror',3,'Ren can score in front of a packed gym but cannot begin a two-minute class speech.\n\n“My legs know what to do when people watch. My mouth has resigned.”',[
      choice('Practice the speech in an empty gym.',{courage:1,charisma:1,score:8},'The echo makes every mistake dramatic enough to become funny.'),
      choice('Turn the speech into three simple plays.',{intellect:1,reliability:1,score:7},'Opening, evidence, finish. Ren finally sees a court he can navigate.'),
      choice('Stand in the front row during the real speech.',{kindness:1,courage:1,score:8},'He looks at you whenever the room becomes too large.')
    ]),
    scene('ren-2',9,'The Winning Pass',5,'Ren has the final shot in a major game, but a nervous teammate is completely open. The scouts in the stands came to see Ren.\n\n“This is the moment everyone remembers.”',[
      choice('Tell him great players create the right ending.',{courage:1,kindness:1,score:11},'Ren passes. The teammate scores. The entire bench remembers who trusted them.',3),
      choice('Help him accept that either choice may fail.',{intellect:1,courage:1,score:10},'He stops searching for certainty and starts reading the game.',3),
      choice('Promise that one play cannot define him.',{kindness:2,score:10},'The pressure becomes a decision instead of a verdict.',3)
    ]),
    scene('ren-3',15,'Empty Bleachers',7,'After the season ends, Ren sits in the silent gym. No chants, no scoreboard, no heroic image.\n\n“I thought quiet would feel like disappearing.”',[
      choice('Tell him you can see him without the crowd.',{kindness:2,score:15},'Ren looks relieved in a way victory never managed.',4),
      choice('Challenge him to a harmless trick-shot contest.',{fitness:1,charisma:1,score:14},'The final score is terrible. The evening is not.',4),
      choice('Sit in the quiet until it feels normal.',{reliability:1,kindness:1,score:14},'The gym becomes a place, not a stage.',4)
    ])
  ],
  haru: [
    scene('haru-1',4,'No Chorus Yet',1,'Haru plays you a song that stops before the chorus.\n\n“I know what it should sound like. I do not know what I actually mean.”',[
      choice('Ask what he is afraid to say plainly.',{courage:1,kindness:1,score:8},'The missing chorus begins with one honest sentence.'),
      choice('Hum a deliberately terrible melody.',{charisma:1,talent:1,score:7},'Haru laughs, then steals one surprisingly useful note.'),
      choice('Listen without suggesting anything.',{kindness:2,score:8},'The silence gives the unfinished song room to become itself.')
    ]),
    scene('haru-2',9,'The Easy Version of Haru',4,'A label scout compliments Haru’s “effortless” image and asks him to hide how hard he practices.\n\n“They like the version of me that never needs anything.”',[
      choice('Tell him effort is part of the art.',{courage:1,talent:1,score:11},'Haru posts a rehearsal clip full of mistakes—and earns more respect, not less.',3),
      choice('Help him set one boundary with the scout.',{reliability:1,charisma:1,score:10},'The conversation is uncomfortable and necessary.',3),
      choice('Remind him that an image should serve the person.',{intellect:1,kindness:1,score:10},'For once, Haru chooses the complicated truth over the marketable pose.',3)
    ]),
    scene('haru-3',15,'The Song With Your Name Missing',7,'Haru performs a new song at the gala. Your name is nowhere in the lyrics, but every private joke and difficult conversation is there.\n\nAfterward he asks, “Did you recognize it?”',[
      choice('Say you recognized every line.',{talent:1,kindness:1,score:15},'Haru looks happier than he did during the applause.',4),
      choice('Ask for the first handwritten copy.',{reliability:1,charisma:1,score:14},'He has already written your initials in the corner.',4),
      choice('Tell him the chorus finally says what he means.',{kindness:2,score:14},'“Only because someone listened before it existed,” he replies.',4)
    ])
  ],
  daichi: [
    scene('daichi-1',4,'The Joke That Stops',0,'Daichi abandons a joke halfway through when he notices the target is genuinely uncomfortable. The hallway waits for the punchline.\n\n“Backing down is less funny than I hoped.”',[
      choice('Help him redirect the joke toward himself.',{charisma:1,kindness:1,score:8},'The hallway laughs, and nobody has to pay for it.'),
      choice('Tell him stopping was the brave part.',{courage:1,kindness:1,score:8},'Daichi pretends not to care, then remembers the sentence exactly.'),
      choice('Check on the other student together.',{reliability:1,kindness:1,score:7},'The apology is awkward, direct and accepted.')
    ]),
    scene('daichi-2',9,'Breaking News: Not Fine',2,'Daichi is quieter than usual after receiving difficult news from home. He keeps announcing fake headlines to prevent anyone from asking.\n\n“Local comedian remains aggressively normal.”',[
      choice('Ask once, then let him choose the silence.',{kindness:2,score:11},'He eventually tells you the truth because you did not force it.',3),
      choice('Offer ordinary company instead of advice.',{reliability:1,kindness:1,score:10},'You spend lunch rating vending-machine drinks with unnecessary seriousness.',3),
      choice('Give him permission to be unfunny today.',{courage:1,charisma:1,score:10},'Daichi’s first real laugh arrives several minutes later.',3)
    ]),
    scene('daichi-3',15,'Final Announcement',7,'Daichi gets the microphone at the gala. Everyone expects a legendary joke. Instead, he begins thanking people by name.\n\nHe pauses before yours.',[
      choice('Give him an encouraging nod.',{kindness:1,reliability:1,score:15},'His final line is sincere, funny and impossible to forget.',4),
      choice('Mouth “no pressure.”',{charisma:2,score:14},'He nearly loses the speech laughing, which improves it enormously.',4),
      choice('Applaud before he can hide behind a joke.',{courage:1,kindness:1,score:14},'The whole hall follows your lead.',4)
    ])
  ],
  kenji: [
    scene('kenji-1',4,'Optional Objective',1,'Kenji has optimized his entire week and left no time for anything without a measurable reward.\n\n“Fun is difficult to schedule because it has no completion state.”',[
      choice('Invent a ten-minute optional objective.',{charisma:1,intellect:1,score:8},'Objective: find the strangest library title. Reward: laughing too loudly.'),
      choice('Challenge him to lose a harmless game gracefully.',{courage:1,kindness:1,score:7},'Kenji loses, requests balance changes, and has an excellent time.'),
      choice('Ask what he enjoyed before he tracked everything.',{kindness:1,intellect:1,score:8},'The answer leads to an old board game and a new weekly ritual.')
    ]),
    scene('kenji-2',9,'The Cooperative Campaign',5,'Kenji’s competition team is falling apart because he assigns every task himself.\n\n“Delegating introduces variables.”',[
      choice('Show him the variables are people with strengths.',{charisma:1,intellect:1,score:11},'The team becomes less predictable and much more capable.',3),
      choice('Make him ask each teammate what they want to own.',{kindness:1,reliability:1,score:10},'The quietest member volunteers for the hardest system—and solves it.',3),
      choice('Let one small mistake happen without fixing it.',{courage:1,reliability:1,score:10},'Nobody collapses. Kenji records this as “important field data.”',3)
    ]),
    scene('kenji-3',15,'New Game Plus',6,'Kenji gives you a handwritten campaign summary of your four years. The final page is titled NEW GAME PLUS.\n\n“I know graduation is not a reset. The metaphor remains useful.”',[
      choice('Write the first post-graduation objective together.',{intellect:1,reliability:1,score:15},'The objective is ambitious, specific and includes lunch.',4),
      choice('Add “keep calling your party members.”',{kindness:2,score:14},'Kenji circles it as the only mandatory quest.',4),
      choice('Ask for a deliberately unoptimized future.',{courage:1,charisma:1,score:14},'He agrees, provided you both retain manual save points.',4)
    ])
  ],
  sora: [
    scene('sora-1',4,'The Answer He Does Not Have',0,'Sora is staring at a blank debate card. The topic is personal rather than academic.\n\n“I can construct arguments for every position. I cannot identify my own.”',[
      choice('Ask what outcome feels kindest.',{kindness:1,intellect:1,score:8},'The emotional question reveals a position logic could not select.'),
      choice('Tell him uncertainty can be honest.',{courage:1,kindness:1,score:8},'Sora writes “I am still deciding” and means it.'),
      choice('Debate the opposite side until his reaction appears.',{charisma:1,intellect:1,score:7},'His first interruption contains the answer he was searching for.')
    ]),
    scene('sora-2',9,'The Perfect Mediation',4,'Sora resolves a conflict so efficiently that neither student feels heard. The agreement is fair and emotionally useless.\n\n“I solved the structure. Why did I make the people feel smaller?”',[
      choice('Help him reopen the conversation slowly.',{kindness:1,reliability:1,score:11},'This time, the agreement grows from understanding instead of exhaustion.',3),
      choice('Explain that silence is not always consent.',{courage:1,intellect:1,score:10},'Sora adds a new rule to every future mediation: ask twice.',3),
      choice('Let the students describe the harm in their own words.',{kindness:2,score:10},'Sora listens without translating their feelings into bullet points.',3)
    ]),
    scene('sora-3',15,'No Closing Statement',7,'At the final forum, Sora is expected to give the perfect closing speech. Instead, he invites several quieter students to finish it.\n\nAfterward he asks whether he surrendered his moment.',[
      choice('Tell him he expanded the moment.',{charisma:1,kindness:1,score:15},'Sora keeps the phrase and uses it whenever leadership becomes too narrow.',4),
      choice('Say the strongest conclusion was shared.',{intellect:1,reliability:1,score:14},'He smiles. “That is annoyingly difficult to rebut.”',4),
      choice('Remind him he no longer needs to prove every answer.',{courage:1,kindness:1,score:14},'For once, Sora leaves the final sentence unfinished.',4)
    ])
  ]
};

const ROUTE_THRESHOLDS = [4, 9, 15];

const WEATHER = [
  ['Clear Skies','Soft sunlight fills the courtyard. Outdoor conversations gain a little confidence.','charisma'],
  ['Petal Breeze','Cherry petals drift through open windows. Creative choices feel easier today.','talent'],
  ['Silver Rain','Rain keeps everyone indoors, making the hallways crowded and unexpectedly social.','kindness'],
  ['Bright Heat','The gym is warm and water bottles are valuable social currency.','fitness'],
  ['Cloud Cover','A quiet grey morning makes focused work easier than public performance.','intellect'],
  ['Autumn Wind','Leaves race across the courtyard and every doorway becomes a dramatic entrance.','courage'],
  ['First Frost','Cold air rewards preparation, punctuality and people carrying spare gloves.','reliability'],
  ['Light Snow','The campus is quieter than usual. Small acts of help are noticed.','kindness']
];
const NOTICES = [
  'The lost-property shelf is overflowing with umbrellas and one mysterious trophy.',
  'The cafeteria is testing a curry bun that has already inspired three club alliances.',
  'A first-year student is looking for directions but pretending to study the wall map.',
  'The ranking board will update after closing homeroom. Rumors before then are still rumors.',
  'The library has opened a quiet collaboration table for students who dislike group projects loudly.',
  'Festival rehearsal bookings are available, with strict rules against smoke machines in hallways.',
  'The student council requests volunteers for a task described only as “surprisingly urgent ribbons.”',
  'Coach Kondo reminds everyone that hydration is not a personality weakness.',
  'The school radio is accepting dedications, apologies and songs shorter than four minutes.',
  'A club recruitment poster has been corrected from “desperate” to “enthusiastic.”'
];
const PRESSURES = [
  'Public achievements receive extra attention today.',
  'Quiet reliability matters more than flashy promises today.',
  'Rumors travel quickly; verify before reacting.',
  'Cross-clique cooperation earns unusual respect.',
  'Teachers are paying close attention to punctuality.',
  'Students are tired; kindness has extra impact.'
];

function createDailyBrief(year, month, day, clubId='council') {
  const seed = year*997 + month*89 + day*31 + String(clubId).length*17;
  const weather = WEATHER[seed % WEATHER.length];
  const notice = NOTICES[(seed*3 + month) % NOTICES.length];
  const pressure = PRESSURES[(seed*5 + day) % PRESSURES.length];
  const featuredIndex = (seed*7 + year + month) % 10;
  return {
    id:`${year}-${month}-${day}`,
    weather:weather[0],
    weatherText:weather[1],
    bonusStat:weather[2],
    notice,
    pressure,
    featuredIndex,
    modifier: 1 + ((seed % 5)-2)*0.02
  };
}

const CLUB_CHALLENGES = {
  athletics:{title:'Relay Launch',instruction:'Hit the marker inside the golden start window.',stat:'fitness',color:'#4f9bc4',labels:['Set','Drive','Finish']},
  arts:{title:'Stage Rhythm',instruction:'Catch each beat inside the spotlight window.',stat:'talent',color:'#c56aa8',labels:['Listen','Enter','Flourish']},
  tech:{title:'Circuit Sync',instruction:'Lock each signal when it crosses the stable band.',stat:'intellect',color:'#6f85d6',labels:['Scan','Link','Compile']},
  council:{title:'Debate Balance',instruction:'Commit each response when confidence meets empathy.',stat:'charisma',color:'#e1ae45',labels:['Listen','Frame','Conclude']}
};
