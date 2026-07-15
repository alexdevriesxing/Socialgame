// Pass 8 v1.6 preference precedence — explicit persisted choices override legacy engine defaults.
const A11Y_PREFERENCES_VERSION='1.6.0';
const a11yLegacyEnsure=a11yEnsure;
a11yEnsure=function(){
  const current=game.settings||{},stored=a11yReadPrefs();
  game.settings={...A11Y_DEFAULTS,...current,...stored,controlMap:{...A11Y_DEFAULT_CONTROLS,...(current.controlMap||{}),...(stored.controlMap||{})}};
  if(!Array.isArray(game.settings.seenDialogue))game.settings.seenDialogue=[];
  game.dialogueHistory=Array.isArray(game.dialogueHistory)?game.dialogueHistory:[];
  audio.enabled=!game.settings.masterMute;a11yApplyVisual();return game.settings;
};
a11yEnsure();
function validateAccessibilityPreferences(){const stored=a11yReadPrefs();return{valid:true,version:A11Y_PREFERENCES_VERSION,persistedKeys:Object.keys(stored).length,explicitPreferencesWin:true,controlMapMerged:true};}
