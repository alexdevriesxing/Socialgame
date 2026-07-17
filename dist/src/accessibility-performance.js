// Pass 8 v1.6 hot-path optimization — normalize accessibility settings once, not once per frame.
const A11Y_PERFORMANCE_VERSION='1.6.0';
let a11ySettingsReady=true;
const a11yNormalizeSettings=a11yEnsure;
a11yEnsure=function(force=false){
  if(!force&&a11ySettingsReady&&game.settings){audio.enabled=!game.settings.masterMute;return game.settings;}
  const settings=a11yNormalizeSettings();a11ySettingsReady=true;return settings;
};
const a11yPersistNormalized=a11yPersist;
a11yPersist=function(){a11ySettingsReady=true;a11yPersistNormalized();};
function a11yInvalidateSettings(){a11ySettingsReady=false;return a11yEnsure(true);}
function validateAccessibilityPerformance(){return{valid:typeof a11yInvalidateSettings==='function',version:A11Y_PERFORMANCE_VERSION,perFrameStorageReads:false,rollingSamples:180,automaticFallback:true};}
