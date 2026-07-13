RELATIONSHIP_ROUTES.ren = [
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
  ];
