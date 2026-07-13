RELATIONSHIP_ROUTES.kenji = [
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
  ];
