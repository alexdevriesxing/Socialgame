RELATIONSHIP_ROUTES.aiko = [
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
  ];
