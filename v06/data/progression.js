// Canonical game content. Keep data declarative so it can be validated and expanded safely.

const CLUBS = {
  athletics: {
    name: 'Skybound Athletics', room: 'gym', stat: 'fitness', color: '#d75b50',
    blurb: 'Relays, teamwork and school-spirit competitions.',
    rival: 'North Hall Falcons', entryStat: 5,
    ranks: ['Prospect','Team Member','First String','Captain'],
    competitions: ['Freshman Relay','Inter-Class Games','Regional Sports Day','Crest Championship'],
    perk: 'On-time PE and fitness choices earn extra club prestige.'
  },
  arts: {
    name: 'Velvet Bloom Arts', room: 'literature', stat: 'talent', color: '#c875a0',
    blurb: 'Murals, performances and festival design.',
    rival: 'Silver Stage Society', entryStat: 5,
    ranks: ['Apprentice','Ensemble Member','Lead Creator','Club Director'],
    competitions: ['Poster Showcase','Sakura Festival','Autumn Performance','National Youth Arts Gala'],
    perk: 'Creative and empathetic choices build stronger public recognition.'
  },
  tech: {
    name: 'Byte Brigade', room: 'library', stat: 'intellect', color: '#55a5b8',
    blurb: 'Robotics, games and puzzle tournaments.',
    rival: 'West Campus Circuit', entryStat: 5,
    ranks: ['Tester','Builder','Lead Engineer','Club President'],
    competitions: ['Logic Sprint','Robot Trial','Innovation Fair','National Student Tech Cup'],
    perk: 'Accurate class answers and documented solutions earn bonus club XP.'
  },
  council: {
    name: 'Crest Council', room: 'homeroom', stat: 'charisma', color: '#e3b64d',
    blurb: 'Events, mediation and student leadership.',
    rival: 'Senior Committee Bloc', entryStat: 5,
    ranks: ['Volunteer','Representative','Committee Chair','Student President'],
    competitions: ['Welcome Assembly','Budget Forum','School Election','Legacy Summit'],
    perk: 'Reliable, fair and diplomatic choices increase school-wide influence.'
  }
};
const SOCIAL_STATUS_LEVELS = {
  established: {
    name: 'Established', difficulty: 'Easy', badge: 'KNOWN',
    description: 'You already know people from feeder school and community activities. Doors open faster, but expectations are high.',
    startScore: 70, relationshipBase: 2, teacherTrust: 2,
    positiveScoreMultiplier: 1.15, negativeScoreMultiplier: 0.80,
    npcPressure: 0.94, rumorRisk: 0.72, clubThresholdModifier: -15,
    invitationThresholdModifier: -2
  },
  ordinary: {
    name: 'Ordinary', difficulty: 'Normal', badge: 'UNPROVEN',
    description: 'You arrive with no special advantage or disadvantage. Your choices create your reputation.',
    startScore: 0, relationshipBase: 0, teacherTrust: 0,
    positiveScoreMultiplier: 1.00, negativeScoreMultiplier: 1.00,
    npcPressure: 1.00, rumorRisk: 1.00, clubThresholdModifier: 0,
    invitationThresholdModifier: 0
  },
  outsider: {
    name: 'Outsider', difficulty: 'Hard', badge: 'NEWCOMER',
    description: 'You are new to the district and school circles. Invitations are rarer and mistakes travel faster, but every rise feels earned.',
    startScore: -35, relationshipBase: -1, teacherTrust: -1,
    positiveScoreMultiplier: 0.90, negativeScoreMultiplier: 1.30,
    npcPressure: 1.10, rumorRisk: 1.45, clubThresholdModifier: 20,
    invitationThresholdModifier: 2
  }
};
const RANKING_RULES = [
  'Accomplishments: classes, competitions, clubs and missions',
  'Connections: strong friendships and respected peers',
  'Character: kindness, courage and reliability under pressure',
  'Conduct: lateness, missed classes and demerits reduce standing',
  'Monthly momentum: visible contributions matter this month'
];
