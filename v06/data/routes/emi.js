RELATIONSHIP_ROUTES.emi = [
    scene('emi-1',4,'Unexpected Input',1,'Emi’s robot has started waving at random students. She insists it is a sensor fault, but the code contains a variable named make_friend.\n\n“This is not evidence.”',[
      choice('Help debug the social experiment.',{intellect:1,kindness:1,score:8},'The robot waves only when greeted first. Emi calls this “consent-aware networking.”'),
      choice('Wave back at the robot.',{charisma:1,courage:1,score:7},'The robot plays a victory tone. Emi definitely programmed that part.'),
      choice('Protect the embarrassing variable name.',{reliability:2,score:7},'Emi quietly renames it friendshipProtocol and trusts you more.')
    ]),
    scene('emi-2',9,'The Failure Log',5,'Emi’s competition prototype fails in front of the entire club. She begins deleting the test logs.\n\n“If the data survives, so does the humiliation.”',[
      choice('Save a copy and analyze it together.',{intellect:2,score:11},'The failure reveals a fix nobody would have found from a perfect test.',3),
      choice('Tell the club exactly what went wrong.',{courage:1,reliability:1,score:10},'Honesty turns embarrassment into a shared engineering problem.',3),
      choice('Make a joke, then stay to rebuild.',{charisma:1,kindness:1,score:10},'Emi laughs once. Four hours later, the prototype works.',3)
    ]),
    scene('emi-3',15,'Offline Mode',6,'Emi asks you to spend an afternoon without phones, laptops or timers. She has printed a paper map and looks deeply suspicious of it.\n\n“I need to know whether friendship still works without notifications.”',[
      choice('Follow the map and get cheerfully lost.',{courage:1,kindness:1,score:15},'The wrong turn becomes the part you both remember best.',4),
      choice('Turn the day into a handwritten field log.',{intellect:1,talent:1,score:14},'The log is half observations and half jokes nobody else could decode.',4),
      choice('Tell her silence does not need debugging.',{kindness:2,score:14},'You sit beside the fountain without solving anything. It works.',4)
    ])
  ];
