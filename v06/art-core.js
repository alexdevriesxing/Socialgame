// Scalable anime art factory. All runtime visuals are authored as SVG atlases so
// Cloudflare Pages can deploy the complete game without binary asset hosting.
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
const svgUri = (width, height, body, defs='') => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs>${defs}</defs>${body}</svg>`)}`;

const CHARACTERS = [
  ['player_boy','#18243d','#435d87','#4b7cb8','#d24c58','short'],
  ['player_girl','#20233d','#626a9d','#7a63c6','#d24c58','long'],
  ['aiko','#20213b','#666ca2','#8a58ba','#d24c58','long'],
  ['mina','#77452f','#c4845d','#4d8ba8','#d85c4d','pony'],
  ['rina','#d56888','#f1a4b5','#7f62b2','#d24c58','bob'],
  ['emi','#1e2f66','#6179bd','#6f90d3','#d24c58','short','glasses'],
  ['hana','#d6d9e2','#ffffff','#7890ad','#d24c58','long'],
  ['ren','#172338','#416791','#547fb0','#d24c58','messy'],
  ['haru','#875033','#d39a6c','#5e8b9d','#d24c58','soft'],
  ['daichi','#963739','#df7564','#6a7d9f','#d24c58','spike'],
  ['kenji','#27396e','#6f7fc0','#7a66b7','#d24c58','short','glasses'],
  ['sora','#e8e9ef','#ffffff','#7c95b6','#d24c58','soft'],
  ['teacher_hayashi','#27213a','#665481','#6d4b9e','#507fb0','long','adult'],
  ['teacher_mori','#5c4538','#98755d','#4d748a','#507fb0','soft','adult'],
  ['teacher_arai','#1f2942','#657697','#6b7eb2','#507fb0','bob','glasses-adult'],
  ['coach_kondo','#383a43','#7d818d','#61788e','#d75b50','short','adult']
].map(([id,hair,hair2,eyes,accent,style,flag=''])=>({id,hair,hair2,eyes,accent,style,glasses:flag.includes('glasses'),adult:flag.includes('adult')}));

const defsFor = (c, id) => `
  <linearGradient id="hair-${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c.hair2}"/><stop offset=".52" stop-color="${c.hair}"/><stop offset="1" stop-color="#101728"/></linearGradient>
  <linearGradient id="uniform-${id}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${c.adult?'#556b84':'#344766'}"/><stop offset="1" stop-color="${c.adult?'#26374b':'#18243a'}"/></linearGradient>
  <filter id="shadow-${id}" x="-30%" y="-30%" width="160%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>`;

function hairShape(c,x,y,s,id,back=false,layer='all'){
  const fill=`url(#hair-${id})`;
  if(back) return `<ellipse cx="${x}" cy="${y+36*s}" rx="${36*s}" ry="${45*s}" fill="${fill}" stroke="#101728" stroke-width="${2*s}"/>`;
  const tails = c.style==='long' ? `<path d="M${x-32*s} ${y+25*s}Q${x-45*s} ${y+92*s} ${x-25*s} ${y+129*s}L${x+25*s} ${y+129*s}Q${x+45*s} ${y+88*s} ${x+32*s} ${y+25*s}Z" fill="${fill}"/>` : c.style==='pony' ? `<path d="M${x+28*s} ${y+20*s}Q${x+75*s} ${y+34*s} ${x+50*s} ${y+95*s}Q${x+80*s} ${y+60*s} ${x+48*s} ${y+14*s}Z" fill="${fill}" stroke="#101728" stroke-width="${2*s}"/>` : c.style==='bob' ? `<path d="M${x-34*s} ${y+18*s}Q${x-43*s} ${y+82*s} ${x-20*s} ${y+91*s}L${x+23*s} ${y+91*s}Q${x+44*s} ${y+70*s} ${x+34*s} ${y+18*s}Z" fill="${fill}"/>` : '';
  let bangs=`<path d="M${x-34*s} ${y+27*s}Q${x-25*s} ${y-13*s} ${x+4*s} ${y-11*s}Q${x+31*s} ${y-9*s} ${x+35*s} ${y+28*s}Q${x+17*s} ${y+12*s} ${x+12*s} ${y+37*s}Q${x+1*s} ${y+15*s} ${x-5*s} ${y+37*s}Q${x-18*s} ${y+15*s} ${x-34*s} ${y+27*s}Z" fill="${fill}" stroke="#101728" stroke-width="${1.7*s}"/>`;
  if(c.style==='spike') bangs=`<path d="M${x-38*s} ${y+29*s}L${x-29*s} ${y-10*s}L${x-14*s} ${y+1*s}L${x} ${y-20*s}L${x+13*s} ${y+2*s}L${x+31*s} ${y-12*s}L${x+39*s} ${y+30*s}Q${x} ${y+2*s} ${x-38*s} ${y+29*s}Z" fill="${fill}" stroke="#101728" stroke-width="${1.8*s}"/>`;
  if(c.style==='short') bangs=`<path d="M${x-35*s} ${y+28*s}Q${x-27*s} ${y-12*s} ${x+5*s} ${y-10*s}Q${x+31*s} ${y-8*s} ${x+36*s} ${y+26*s}L${x+20*s} ${y+17*s}L${x+12*s} ${y+37*s}L${x} ${y+17*s}L${x-12*s} ${y+38*s}L${x-21*s} ${y+17*s}Z" fill="${fill}" stroke="#101728" stroke-width="${1.7*s}"/>`;
  return layer==='back'?tails:layer==='front'?bangs:tails+bangs;
}

function head(c,x,y,s,id,direction=0,expression='neutral'){
  if(direction===3) return hairShape(c,x,y,s,id,true)+`<path d="M${x-28*s} ${y+30*s}Q${x} ${y-4*s} ${x+28*s} ${y+30*s}Q${x+13*s} ${y+17*s} ${x} ${y+31*s}Q${x-14*s} ${y+17*s} ${x-28*s} ${y+30*s}" fill="${c.hair2}" opacity=".55"/>`;
  const shift=direction===1?-7*s:direction===2?7*s:0;
  const lx=x-13*s+shift, rx=x+13*s+shift, ey=y+41*s;
  const eyes=expression==='happy'
    ? `<path d="M${lx-7*s} ${ey}Q${lx} ${ey+6*s} ${lx+7*s} ${ey}" fill="none" stroke="#263047" stroke-width="${2.5*s}"/><path d="M${rx-7*s} ${ey}Q${rx} ${ey+6*s} ${rx+7*s} ${ey}" fill="none" stroke="#263047" stroke-width="${2.5*s}"/>`
    : `<ellipse cx="${lx}" cy="${ey}" rx="${6.5*s}" ry="${8*s}" fill="white"/><ellipse cx="${rx}" cy="${ey}" rx="${6.5*s}" ry="${8*s}" fill="white"/><ellipse cx="${lx}" cy="${ey+1*s}" rx="${4*s}" ry="${5.8*s}" fill="${c.eyes}"/><ellipse cx="${rx}" cy="${ey+1*s}" rx="${4*s}" ry="${5.8*s}" fill="${c.eyes}"/><circle cx="${lx-1.5*s}" cy="${ey-1.5*s}" r="${1.5*s}" fill="white"/><circle cx="${rx-1.5*s}" cy="${ey-1.5*s}" r="${1.5*s}" fill="white"/>`;
  const mouth=expression==='happy' ? `<path d="M${x-8*s+shift} ${y+60*s}Q${x+shift} ${y+70*s} ${x+8*s+shift} ${y+60*s}" fill="#d87983" stroke="#a45762" stroke-width="${1.5*s}"/>` : `<path d="M${x-5*s+shift} ${y+61*s}Q${x+shift} ${y+65*s} ${x+5*s+shift} ${y+61*s}" fill="none" stroke="#b66f73" stroke-width="${1.8*s}" stroke-linecap="round"/>`;
  const glasses=c.glasses?`<rect x="${lx-10*s}" y="${ey-9*s}" width="${20*s}" height="${17*s}" rx="${6*s}" fill="none" stroke="#253148" stroke-width="${2*s}"/><rect x="${rx-10*s}" y="${ey-9*s}" width="${20*s}" height="${17*s}" rx="${6*s}" fill="none" stroke="#253148" stroke-width="${2*s}"/><path d="M${lx+10*s} ${ey-1*s}H${rx-10*s}" stroke="#253148" stroke-width="${2*s}"/>`:'';
  return `${hairShape(c,x,y,s,id,false,'back')}<ellipse cx="${x}" cy="${y+37*s}" rx="${32*s}" ry="${40*s}" fill="#f3c8ae" stroke="#453340" stroke-width="${1.8*s}"/><ellipse cx="${x-25*s}" cy="${y+53*s}" rx="${7*s}" ry="${3*s}" fill="#e9949c" opacity=".32"/><ellipse cx="${x+25*s}" cy="${y+53*s}" rx="${7*s}" ry="${3*s}" fill="#e9949c" opacity=".32"/>${eyes}${mouth}${glasses}${hairShape(c,x,y,s,id,false,'front')}`;
}

function body(c,x,y,s,id,direction=0,step=0){
  const leg=7*s*step, skirt=['player_girl','aiko','mina','rina','emi','hana','teacher_hayashi','teacher_arai'].includes(c.id);
  const torso=`<path d="M${x-29*s} ${y+4*s}Q${x} ${y-10*s} ${x+29*s} ${y+4*s}L${x+24*s} ${y+72*s}Q${x} ${y+81*s} ${x-24*s} ${y+72*s}Z" fill="url(#uniform-${id})" stroke="#101725" stroke-width="${2*s}"/><path d="M${x-10*s} ${y+4*s}L${x} ${y+21*s}L${x+10*s} ${y+4*s}L${x+16*s} ${y+48*s}L${x-16*s} ${y+48*s}Z" fill="#f8f8fb"/><path d="M${x} ${y+17*s}L${x-5*s} ${y+49*s}L${x} ${y+61*s}L${x+5*s} ${y+49*s}Z" fill="${c.accent}"/><circle cx="${x+18*s}" cy="${y+28*s}" r="${5*s}" fill="${c.accent}" stroke="#f8d77a" stroke-width="${1.5*s}"/>`;
  const arms=`<path d="M${x-23*s} ${y+17*s}Q${x-40*s} ${y+46*s} ${x-29*s} ${y+71*s}" fill="none" stroke="url(#uniform-${id})" stroke-width="${14*s}" stroke-linecap="round"/><path d="M${x+23*s} ${y+17*s}Q${x+40*s} ${y+46*s} ${x+29*s} ${y+71*s}" fill="none" stroke="url(#uniform-${id})" stroke-width="${14*s}" stroke-linecap="round"/>`;
  const lower=skirt?`<path d="M${x-25*s} ${y+69*s}L${x-35*s} ${y+96*s}H${x+35*s}L${x+25*s} ${y+69*s}Z" fill="#3b4969" stroke="#101725" stroke-width="${1.8*s}"/><path d="M${x-15*s} ${y+95*s}L${x-15*s-leg} ${y+127*s+leg}H${x-3*s}L${x-1*s} ${y+96*s}Z" fill="#f3c8ae"/><path d="M${x+15*s} ${y+95*s}L${x+15*s+leg} ${y+127*s-leg}H${x+3*s}L${x+1*s} ${y+96*s}Z" fill="#f3c8ae"/>`:`<path d="M${x-23*s} ${y+70*s}L${x-19*s-leg} ${y+128*s+leg}H${x-3*s}L${x} ${y+76*s}Z" fill="#202b42"/><path d="M${x+23*s} ${y+70*s}L${x+19*s+leg} ${y+128*s-leg}H${x+3*s}L${x} ${y+76*s}Z" fill="#202b42"/>`;
  const shoes=`<ellipse cx="${x-11*s-leg}" cy="${y+130*s+leg}" rx="${12*s}" ry="${5.5*s}" fill="#111827"/><ellipse cx="${x+11*s+leg}" cy="${y+130*s-leg}" rx="${12*s}" ry="${5.5*s}" fill="#111827"/>`;
  return direction===3?torso+lower+shoes:arms+torso+lower+shoes;
}

