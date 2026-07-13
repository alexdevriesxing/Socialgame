RELATIONSHIP_ROUTES.hana = [
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
  ];
