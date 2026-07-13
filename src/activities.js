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
  { id:'explore', title:'Hallway Stories', desc:'Interact with two school hotspots.', goal:2, type:'hotspot', reward:10 }
];
