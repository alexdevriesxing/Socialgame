RELATIONSHIP_ROUTES.mina = [
    scene('mina-1',4,'The Slow Lap',2,'Mina is walking the track instead of running. She admits that her ankle is sore and that she has told nobody.\n\n“If I rest, someone else gets faster.”',[
      choice('Convince her that recovery is training.',{kindness:1,intellect:1,score:8},'Mina reluctantly schedules a rest day and calls it “strategic not-running.”'),
      choice('Walk one careful lap with her.',{fitness:1,kindness:1,score:7},'The slow lap becomes one of your longest conversations.'),
      choice('Offer to reorganize practice around her recovery.',{reliability:2,score:8},'The team improves its baton work while Mina heals.')
    ]),
    scene('mina-2',9,'Captain of the Bench',3,'A first-year runner freezes before a relay trial. Mina wants to replace them before the team loses confidence.\n\n“They are ready physically. I cannot run courage for them.”',[
      choice('Ask Mina to share her own pre-race fear.',{charisma:1,kindness:1,score:11},'Hearing that the captain gets nervous too gives the runner permission to try.',3),
      choice('Create a low-pressure practice start.',{fitness:1,reliability:1,score:10},'One quiet start becomes three confident ones.',3),
      choice('Volunteer to run beside them for the first ten meters.',{courage:1,fitness:1,score:10},'They finish the trial alone, but they begin it knowing they are not abandoned.',3)
    ]),
    scene('mina-3',15,'Finish Line, No Crowd',6,'After the final practice, Mina challenges you to one last race. There are no spectators and no ranking points.\n\n“This one is just to remember who we became.”',[
      choice('Race seriously until the final step.',{fitness:2,score:15},'You both collapse laughing beyond the line. The result becomes permanently disputed.',4),
      choice('Match her pace and finish together.',{kindness:1,reliability:1,score:14},'Mina complains for exactly five seconds, then keeps the finish photo.',4),
      choice('Let her win, then admit it immediately.',{charisma:1,courage:1,score:13},'She demands a rematch and calls you an impossible friend.',4)
    ])
  ];
