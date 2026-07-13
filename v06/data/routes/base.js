// Thirty bespoke friendship-route scenes: three chapters for each recurring student.
// Route scenes unlock at bond 4, 9 and 15 and are permanently recorded in the save.
const scene = (id, threshold, title, sceneIndex, text, choices) => ({ id, threshold, title, scene: sceneIndex, text, choices });
const choice = (text, effects, result, bond=2) => ({ text, effects, result, bond });

const RELATIONSHIP_ROUTES = {};
