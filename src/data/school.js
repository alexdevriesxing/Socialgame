// Canonical game content. Keep data declarative so it can be validated and expanded safely.

export const SCHOOL_NAME = 'Sakura Crest Academy';
export const ROOMS = {
  homeroom: { name: 'Class 1-A', x: 30, y: 30, w: 340, h: 230 },
  math: { name: 'Mathematics Room', x: 395, y: 30, w: 340, h: 230 },
  literature: { name: 'Literature Room', x: 760, y: 30, w: 340, h: 230 },
  library: { name: 'Library', x: 1125, y: 30, w: 125, h: 230 },
  hallway: { name: 'Main Hall', x: 30, y: 280, w: 1220, h: 110 },
  courtyard: { name: 'Courtyard', x: 30, y: 420, w: 370, h: 350 },
  cafeteria: { name: 'Cafeteria', x: 425, y: 420, w: 355, h: 350 },
  gym: { name: 'Gymnasium', x: 805, y: 420, w: 445, h: 350 }
};
export const SCHEDULE = [
  { id: 'arrival', start: 470, end: 480, title: 'Arrival', room: 'hallway', optional: true },
  { id: 'homeroom', start: 480, end: 505, title: 'Morning Homeroom', room: 'homeroom', teacher: 'Ms. Hayashi', grace: 5 },
  { id: 'math', start: 510, end: 560, title: 'Mathematics', room: 'math', teacher: 'Mr. Mori', grace: 5 },
  { id: 'literature', start: 570, end: 620, title: 'Literature', room: 'literature', teacher: 'Ms. Arai', grace: 5 },
  { id: 'break', start: 620, end: 640, title: 'Morning Break', room: 'hallway', optional: true },
  { id: 'pe', start: 645, end: 695, title: 'Physical Education', room: 'gym', teacher: 'Coach Kondo', grace: 5 },
  { id: 'lunch', start: 700, end: 740, title: 'Lunch', room: 'cafeteria', optional: true },
  { id: 'club', start: 745, end: 795, title: 'Club Period', room: 'club', teacher: 'Club Captain', grace: 8 },
  { id: 'social', start: 800, end: 850, title: 'Social Studies', room: 'homeroom', teacher: 'Ms. Hayashi', grace: 5 },
  { id: 'free', start: 855, end: 885, title: 'Free Period', room: 'courtyard', optional: true },
  { id: 'closing', start: 890, end: 900, title: 'Closing Homeroom', room: 'homeroom', teacher: 'Ms. Hayashi', grace: 4 }
];
