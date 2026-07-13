RELATIONSHIP_ROUTES.rina = [
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
  ];
