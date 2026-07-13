RELATIONSHIP_ROUTES.daichi = [
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
  ];
