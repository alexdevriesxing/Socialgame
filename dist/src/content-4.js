const reply=(text,effects,result,bond=1)=>({text,effects,result,bond});
const message=(id,npcId,threshold,subject,text,choices)=>({id,npcId,threshold,subject,text,choices});

const PHONE_MESSAGES = [
  message('aiko-brief', 'aiko', 0, 'Festival schedule question', 'I have three versions of tomorrow’s volunteer schedule. Please tell me which one looks least like a military operation.', [
    reply('Use the clearest version and add a friendly note.',{charisma:1,reliability:1,score:6},'Aiko replaces two red warnings with a cheerful welcome paragraph.',2),
    reply('Send all three and let people choose.',{intellect:1,score:3},'Aiko calls it democratic. The group chat calls it terrifying.',1),
    reply('Offer to help simplify it after school.',{kindness:1,energy:-3,score:7},'The two of you turn nine columns into one useful page.',2)
  ]),
  message('aiko-improv', 'aiko', 9, 'Emergency: unscripted speech', 'The principal added a welcome speech with four minutes’ notice. I know the facts. I do not know how to sound human.', [
    reply('Give her three honest opening lines.',{charisma:1,kindness:1,score:9},'Aiko uses the simplest line and sounds more confident than any script.',3),
    reply('Send a bullet-point structure.',{intellect:2,score:8},'The speech lands because the structure leaves room to breathe.',2),
    reply('Promise to stand in the front row.',{courage:1,kindness:1,score:10},'Aiko spots you immediately and stops gripping the podium.',3)
  ]),
  message('mina-water', 'mina', 0, 'Hydration patrol', 'You skipped the fountain twice today. This is not a friendship request. This is a hydration intervention.', [
    reply('Report to the fountain immediately.',{fitness:1,energy:6,score:5},'Mina replies with a trophy emoji and a suspiciously detailed water schedule.',2),
    reply('Negotiate one bottle after class.',{reliability:1,energy:4,score:4},'Mina accepts the compromise and marks it in her training notebook.',1),
    reply('Ask whether curry counts as hydration.',{charisma:1,score:2},'Mina sends a ten-line explanation beginning with “absolutely not.”',1)
  ]),
  message('mina-pressure', 'mina', 9, 'Before the final heat', 'Everyone expects me to win tomorrow. I usually like that feeling. Tonight it is sitting on my chest.', [
    reply('Remind her the team values more than first place.',{kindness:2,score:10},'Mina saves the message and reads it again before the race.',3),
    reply('Offer to run a quiet warm-up lap together.',{fitness:1,reliability:1,energy:-4,score:9},'The empty track makes the competition feel smaller.',3),
    reply('Send a ridiculous victory pose for distraction.',{charisma:2,score:8},'Mina laughs hard enough to stop checking the forecast.',2)
  ]),
  message('rina-palette', 'rina', 0, 'Color emergency', 'The festival banner is technically finished. Emotionally, it is beige. Choose: coral, indigo or reckless gold?', [
    reply('Coral: warm without shouting.',{talent:1,score:5},'Rina adds coral ribbons and declares the hallway emotionally repaired.',2),
    reply('Indigo: let the lanterns provide contrast.',{intellect:1,talent:1,score:6},'The cooler palette makes every warm light glow.',2),
    reply('Reckless gold. Commit completely.',{courage:1,charisma:1,score:7},'The banner becomes impossible to ignore and somehow perfect.',2)
  ]),
  message('rina-portrait', 'rina', 9, 'A portrait I cannot finish', 'I started drawing someone who always looks composed. Every version feels dishonest. People are not one expression.', [
    reply('Draw the moment after the composure breaks.',{talent:1,kindness:1,score:10},'Rina sketches a laugh instead of a pose, and the portrait finally feels alive.',3),
    reply('Layer several expressions into one composition.',{intellect:1,talent:1,score:9},'The final portrait looks different from every angle.',2),
    reply('Ask the subject what they want remembered.',{kindness:2,score:11},'The answer changes the entire painting.',3)
  ]),
  message('emi-adapter', 'emi', 0, 'Borrowed adapter audit', 'Someone borrowed my universal adapter and returned a cable that fits nothing made on Earth. Are you available for a forensic investigation?', [
    reply('Check the sign-out sheet first.',{intellect:1,reliability:1,score:6},'The handwriting points directly to the media room.',2),
    reply('Test every port in the lab.',{intellect:1,energy:-2,score:5},'The mystery cable powers an ancient projector. Emi is delighted.',1),
    reply('Label the cable “probably important.”',{charisma:1,score:3},'Emi adds “scientifically unhelpful” underneath.',1)
  ]),
  message('emi-demo', 'emi', 9, 'Demo anxiety detected', 'The robot works. The presentation works. My hands have apparently decided to vibrate at 60 hertz.', [
    reply('Rehearse the first thirty seconds with her.',{reliability:1,kindness:1,score:10},'Once the opening is automatic, the rest becomes easy.',3),
    reply('Let the robot introduce her.',{talent:1,intellect:1,score:9},'The robot says her name in an absurdly grand voice. The audience loves it.',2),
    reply('Stand beside the control table.',{courage:1,kindness:1,score:10},'Emi stops looking at the crowd and starts explaining the machine to you.',3)
  ]),
  message('hana-snack', 'hana', 0, 'Emergency snack survey', 'Quick question: salty, sweet, or “I forgot lunch and will accept anything”? This is for peer-support research.', [
    reply('Sweet, but share it with someone.',{kindness:1,energy:5,score:5},'Hana appears ten minutes later with two small cakes.',2),
    reply('Salty. Preferably something crunchy.',{energy:6,score:4},'A rice-cracker packet materializes in your locker.',1),
    reply('Admit you forgot lunch.',{reliability:1,energy:8,score:6},'Hana gives you food and a gentle lecture about planning.',2)
  ]),
  message('hana-boundary', 'hana', 9, 'Helping too much', 'I promised to help four people today. Then two more asked. Saying no feels like failing them.', [
    reply('Help her choose what only she can do.',{intellect:1,kindness:1,score:10},'Hana delegates the rest and finally takes a real break.',3),
    reply('Remind her that exhausted help is not reliable help.',{reliability:2,score:9},'She writes the sentence at the top of her planner.',3),
    reply('Offer to take one task, not all six.',{kindness:1,energy:-4,score:9},'The clear limit makes the offer feel sustainable.',2)
  ]),
  message('ren-speech', 'ren', 0, 'Two-minute speech disaster', 'I can sink a shot with five people yelling. I cannot say “thank you for coming” without forgetting my own name.', [
    reply('Treat the speech like a play: breathe, set, release.',{fitness:1,charisma:1,score:6},'Ren repeats the rhythm until the words stop fighting him.',2),
    reply('Write only the first and last sentence.',{intellect:1,score:5},'The middle becomes a conversation instead of a script.',1),
    reply('Practice in the empty gym.',{courage:1,energy:-3,score:6},'The echo is worse than the crowd, which makes tomorrow easier.',2)
  ]),
  message('ren-captain', 'ren', 9, 'Captain decision', 'A younger player broke formation and scored. It worked, but the team cannot survive everyone improvising. How hard should I be?', [
    reply('Praise the courage, then explain the risk.',{charisma:1,reliability:1,score:10},'Ren keeps the player’s confidence while restoring the team plan.',3),
    reply('Ask the player what they saw.',{intellect:1,kindness:1,score:9},'The answer reveals a gap worth adding to the playbook.',3),
    reply('Make it a team review, not a public scolding.',{kindness:1,courage:1,score:9},'The whole team learns without sacrificing one person.',2)
  ]),
  message('haru-chorus', 'haru', 0, 'Chorus vote', 'Option A is catchy. Option B is honest. Option C contains a rhyme with “cafeteria” and may be illegal.', [
    reply('Choose honest and make it catchy later.',{talent:1,courage:1,score:6},'Haru keeps the line he was afraid to sing.',2),
    reply('Combine A and B.',{intellect:1,talent:1,score:6},'The melody carries the truth without flattening it.',2),
    reply('Demand the cafeteria rhyme.',{charisma:1,score:3},'Haru sends a voice note so terrible it becomes legendary.',1)
  ]),
  message('haru-stage', 'haru', 9, 'After the applause', 'The show went well. Everyone says I should be happy. I mostly feel empty and tired.', [
    reply('Tell him the quiet crash after performing is real.',{kindness:2,score:10},'Haru stops apologizing for not feeling triumphant.',3),
    reply('Suggest food, water and no decisions tonight.',{reliability:1,energy:4,score:9},'He sends back a photo of noodles and a blanket.',2),
    reply('Offer a silent walk home.',{kindness:1,courage:1,score:10},'The lack of conversation becomes exactly what he needed.',3)
  ]),
  message('daichi-headline', 'daichi', 0, 'Announcement headline needed', '“Library returns overdue book” lacks energy. I need a headline that respects facts and also has thunder.', [
    reply('The Lost Volume Returns Home.',{charisma:1,talent:1,score:6},'Daichi records it with far too much orchestral humming.',2),
    reply('Keep it factual and add one dramatic pause.',{reliability:1,charisma:1,score:5},'The pause becomes the most discussed part of the announcement.',2),
    reply('Interview the book.',{talent:1,score:4},'The book declines to comment. Daichi calls this powerful journalism.',1)
  ]),
  message('daichi-line', 'daichi', 9, 'A joke that went too far', 'Everyone laughed except the person I joked about. I noticed too late. “I was kidding” feels useless.', [
    reply('Apologize without defending the joke.',{kindness:2,courage:1,score:10},'Daichi writes a short message and does not ask to be forgiven immediately.',3),
    reply('Ask what repair would help.',{kindness:1,reliability:1,score:9},'The answer is smaller and more practical than he expected.',3),
    reply('Stop repeating the story to new audiences.',{reliability:2,score:8},'The joke loses oxygen, and the apology gains weight.',2)
  ]),
  message('kenji-build', 'kenji', 0, 'Strategy question', 'Our group project has one leader, three spectators and a document named FINAL_v8_REAL. Recommended move?', [
    reply('Assign one concrete task to each person.',{intellect:1,reliability:1,score:6},'The document finally stops duplicating itself.',2),
    reply('Run a ten-minute planning round.',{charisma:1,intellect:1,score:6},'Even the quietest member identifies a missing requirement.',2),
    reply('Rename the file FINAL_v9_DESTINY.',{charisma:1,score:3},'Kenji does it, then immediately regrets encouraging you.',1)
  ]),
  message('kenji-loss', 'kenji', 9, 'Tournament loss analysis', 'I know exactly which move lost the match. I have replayed it forty-three times. This is not improving anything.', [
    reply('Review the decision once, then study what worked.',{intellect:1,kindness:1,score:9},'Kenji discovers that most of the match was excellent.',3),
    reply('Play something cooperative tonight.',{kindness:1,stress:-3,score:9},'The change of goal resets his brain.',2),
    reply('Ask what he would tell a teammate.',{charisma:1,kindness:1,score:10},'His advice to an imaginary friend is much gentler than his self-criticism.',3)
  ]),
  message('sora-debate', 'sora', 0, 'Debate opening', 'My argument is correct and completely forgettable. I need an opening people can feel without manipulating them.', [
    reply('Begin with one real student’s experience.',{charisma:1,kindness:1,score:6},'The audience understands the stakes before hearing the statistics.',2),
    reply('Ask a fair question instead of making a claim.',{intellect:1,charisma:1,score:6},'The room leans forward instead of preparing to resist.',2),
    reply('Use silence before the first sentence.',{courage:1,score:5},'The pause gives the opening unexpected gravity.',1)
  ]),
  message('sora-mediator', 'sora', 9, 'Neutral does not mean invisible', 'Two friends asked me to mediate. I can see both sides, but one side caused more harm. Treating them as equal feels wrong.', [
    reply('Name the unequal impact while keeping the process fair.',{courage:1,kindness:1,score:10},'Sora realizes fairness does not require pretending every action was equivalent.',3),
    reply('Set repair as the goal, not balance.',{intellect:1,reliability:1,score:10},'The conversation shifts from blame arithmetic to practical responsibility.',3),
    reply('Ask the hurt person what safety requires first.',{kindness:2,score:11},'The mediation starts with a boundary instead of a debate.',3)
  ])
];

const showcase=(month,title,event,mechanic,stat,scene,description,color)=>({month,title,event,mechanic,stat,scene,description,color});
const MONTHLY_SHOWCASES = [
  showcase(1,'Club Recruitment Rally','Recruitment Week','timing','charisma',0,'Make three confident introductions as students cross the courtyard.','#e7a553'),
  showcase(2,'Creativity Fair Pattern','Indoor Creativity Fair','sequence','talent',1,'Remember the display-light sequence and reproduce it under pressure.','#8b78c8'),
  showcase(3,'Inter-Class Relay','Inter-Class Games','balance','fitness',2,'Keep your pace inside the team zone through the final straight.','#4f9bc4'),
  showcase(4,'Festival Lantern Rhythm','Sakura Festival','timing','talent',3,'Strike each lantern cue when the music and crowd align.','#df6f91'),
  showcase(5,'Study Marathon Recall','Study Marathon','sequence','intellect',4,'Repeat the revision-card sequence before the timer expires.','#7788bd'),
  showcase(6,'Summer Fair Parade','Evening Fair','balance','charisma',5,'Guide the parade pace without rushing performers or losing the crowd.','#e5ae4a'),
  showcase(7,'Service Day Dispatch','Neighborhood Service Day','sequence','reliability',6,'Remember the correct order for supplies, teams and destinations.','#5eaa7a'),
  showcase(8,'Autumn Spotlight','Autumn Showcase','timing','courage',7,'Enter the spotlight on the beat and hold the room.','#c46e48'),
  showcase(9,'Crest Forum','Crest Forum','balance','intellect',8,'Keep evidence and empathy in balance as the debate intensifies.','#667dc3'),
  showcase(10,'Winter Endurance','Endurance Week','balance','fitness',9,'Maintain a sustainable pace through changing conditions.','#78a9c7'),
  showcase(11,'Legacy Project Archive','Legacy Projects','sequence','reliability',10,'Reconstruct four years of project milestones in the correct order.','#a475bd'),
  showcase(12,'Year-End Gala Finale','Year-End Gala','timing','charisma',11,'Deliver the final gala cue at exactly the right moment.','#e1b64d')
];
