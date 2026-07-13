RELATIONSHIP_ROUTES.sora = [
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
  ];
