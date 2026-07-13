// Four complete academic years. Each month has a distinct public event, story focus,
// ranking pressure and authored opening scene. The simulation uses these entries to
// vary score multipliers, event art and month-end presentation across all 48 months.

const MONTHS = [
  ['New Beginnings','Club Recruitment Week','friendship','The front gates open beneath drifting petals. Every club wants new members, every returning student wants to be noticed, and the first ranking board is already attracting a crowd.'],
  ['Rainy Connections','Indoor Creativity Fair','talent','Rain taps against the classroom windows while clubs transform hallways into miniature studios, labs and performance spaces.'],
  ['Faster Together','Inter-Class Games','fitness','Team colors cover the school. Rival classes trade playful challenges, and even the quietest students are asked to contribute.'],
  ['Sakura Festival','Culture Festival','club','Lanterns, food stalls and painted signs take over the campus. A single successful project can reshape the rankings.'],
  ['Midterm Momentum','Study Marathon','intellect','The library stays open late. Students form study circles, tutors emerge from unlikely cliques, and stress tests every friendship.'],
  ['Summer Lights','Evening Fair','charisma','The academy glows beneath strings of lights. Informal conversations and brave invitations matter as much as formal achievements.'],
  ['Crest in the Community','Service Day','kindness','Students leave campus to help neighborhood groups. The school watches who leads, who listens and who quietly finishes the work.'],
  ['Autumn Spotlight','Performance Showcase','courage','A stage appears in the gym. Performers, designers, presenters and technical crews all compete for one unforgettable evening.'],
  ['Voices of Sakura','Crest Forum','leadership','Debates fill the assembly hall. The strongest argument is not always the loudest, and alliances begin shifting before elections.'],
  ['Winter Trials','Endurance Week','reliability','Cold mornings and difficult schedules expose weak habits. Consistency becomes more valuable than flashy one-day victories.'],
  ['Legacy Threads','Legacy Projects','relationships','Students document the people and traditions that shaped the year. Long friendships become visible in unexpected ways.'],
  ['Year-End Gala','Crest Gala','all','The year closes with awards, performances and the final ranking review. Every missed promise and every generous choice returns to the spotlight.']
];
const YEARS = [
  { stage:'First Steps', pressure:1.00, intro:'As a first-year student, you are still learning which doors open easily—and which require patience.' },
  { stage:'Rising Voices', pressure:1.08, intro:'Second year brings expectations. Younger students watch you, while established leaders protect their positions.' },
  { stage:'Leadership Season', pressure:1.16, intro:'Third year places you close to the center of school life. Decisions now affect whole clubs, classes and friendships.' },
  { stage:'The Final Ascent', pressure:1.24, intro:'The last year has begun. Every month shapes your graduation legacy and the final path to prom.' }
];
const CAMPAIGN_MONTHS = YEARS.flatMap((year, yearIndex) => MONTHS.map((month, monthIndex) => {
  const [title,event,focus,intro] = month;
  const chapter = yearIndex * 12 + monthIndex + 1;
  const yearNumber = yearIndex + 1;
  const stakes = ['Build a reliable first impression and identify two people worth knowing well.','Turn early acquaintances into dependable allies while proving your club contribution.','Balance personal ambition with visible support for classmates outside your circle.','Deliver a public project without sacrificing attendance, trust or wellbeing.'][yearIndex];
  const finale = monthIndex === 11 ? `The ${year.stage.toLowerCase()} chapter ends here. Your final placement will carry momentum into ${yearNumber === 4 ? 'prom night' : 'the next academic year'}.` : `This month rewards ${focus === 'all' ? 'a balanced reputation' : focus} and penalizes unreliable shortcuts.`;
  return {chapter,year:yearNumber,month:monthIndex+1,stage:year.stage,title:yearNumber===1?title:`${title}: ${year.stage}`,event,focus,rivalPressure:year.pressure+monthIndex*.006,scene:[0,1,3,2,4,2,0,2,6,5,6,7][monthIndex],intro:`${year.intro}\n\n${intro}`,objective:stakes,finale};
}));
