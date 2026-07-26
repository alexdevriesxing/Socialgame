// Pass 8 v1.6 dialogue-history de-duplication — keep choice outcomes on the originating exchange.
const A11Y_HISTORY_VERSION='1.6.0';
const a11yRecordedOpenDialogue=openDialogue;
openDialogue=function(payload){
  const previous=game.dialogueHistory?.at(-1);
  const isRecordedOutcome=Boolean(previous?.result&&payload?.speaker===previous.speaker&&payload?.text===previous.result);
  if(!isRecordedOutcome){a11yRecordedOpenDialogue(payload);return;}
  a11yBaseOpenDialogue(payload);
  if(game.dialogue){game.dialogue.a11yHistoryId=previous.id;game.dialogue.a11yHash=previous.hash;game.dialogue.a11ySpoken=0;}
  a11yAnnounce(`${payload.speaker}. ${payload.text}`);
};
function validateAccessibilityHistory(){return{valid:typeof a11yRecordedOpenDialogue==='function',version:A11Y_HISTORY_VERSION,choiceOutcomesDeduplicated:true,maxEntries:80};}
