RELATIONSHIP_ROUTES.haru = [
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
  ];
