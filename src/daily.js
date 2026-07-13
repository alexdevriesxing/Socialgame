const WEATHER = [
  ['Clear Skies','Soft sunlight fills the courtyard. Outdoor conversations gain a little confidence.','charisma'],
  ['Petal Breeze','Cherry petals drift through open windows. Creative choices feel easier today.','talent'],
  ['Silver Rain','Rain keeps everyone indoors, making the hallways crowded and unexpectedly social.','kindness'],
  ['Bright Heat','The gym is warm and water bottles are valuable social currency.','fitness'],
  ['Cloud Cover','A quiet grey morning makes focused work easier than public performance.','intellect'],
  ['Autumn Wind','Leaves race across the courtyard and every doorway becomes a dramatic entrance.','courage'],
  ['First Frost','Cold air rewards preparation, punctuality and people carrying spare gloves.','reliability'],
  ['Light Snow','The campus is quieter than usual. Small acts of help are noticed.','kindness']
];
const NOTICES = [
  'The lost-property shelf is overflowing with umbrellas and one mysterious trophy.',
  'The cafeteria is testing a curry bun that has already inspired three club alliances.',
  'A first-year student is looking for directions but pretending to study the wall map.',
  'The ranking board will update after closing homeroom. Rumors before then are still rumors.',
  'The library has opened a quiet collaboration table for students who dislike group projects loudly.',
  'Festival rehearsal bookings are available, with strict rules against smoke machines in hallways.',
  'The student council requests volunteers for a task described only as “surprisingly urgent ribbons.”',
  'Coach Kondo reminds everyone that hydration is not a personality weakness.',
  'The school radio is accepting dedications, apologies and songs shorter than four minutes.',
  'A club recruitment poster has been corrected from “desperate” to “enthusiastic.”'
];
const PRESSURES = [
  'Public achievements receive extra attention today.',
  'Quiet reliability matters more than flashy promises today.',
  'Rumors travel quickly; verify before reacting.',
  'Cross-clique cooperation earns unusual respect.',
  'Teachers are paying close attention to punctuality.',
  'Students are tired; kindness has extra impact.'
];

function createDailyBrief(year, month, day, clubId='council') {
  const seed = year*997 + month*89 + day*31 + String(clubId).length*17;
  const weather = WEATHER[seed % WEATHER.length];
  const notice = NOTICES[(seed*3 + month) % NOTICES.length];
  const pressure = PRESSURES[(seed*5 + day) % PRESSURES.length];
  const featuredIndex = (seed*7 + year + month) % 10;
  return {
    id:`${year}-${month}-${day}`,
    weather:weather[0],
    weatherText:weather[1],
    bonusStat:weather[2],
    notice,
    pressure,
    featuredIndex,
    modifier: 1 + ((seed % 5)-2)*0.02
  };
}
