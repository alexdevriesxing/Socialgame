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
  const neutralEyes=`<ellipse cx="${lx}" cy="${ey}" rx="${6.5*s}" ry="${8*s}" fill="white"/><ellipse cx="${rx}" cy="${ey}" rx="${6.5*s}" ry="${8*s}" fill="white"/><ellipse cx="${lx}" cy="${ey+1*s}" rx="${4*s}" ry="${5.8*s}" fill="${c.eyes}"/><ellipse cx="${rx}" cy="${ey+1*s}" rx="${4*s}" ry="${5.8*s}" fill="${c.eyes}"/><circle cx="${lx-1.5*s}" cy="${ey-1.5*s}" r="${1.5*s}" fill="white"/><circle cx="${rx-1.5*s}" cy="${ey-1.5*s}" r="${1.5*s}" fill="white"/>`;
  const eyes=expression==='happy'
    ? `<path d="M${lx-7*s} ${ey}Q${lx} ${ey+6*s} ${lx+7*s} ${ey}" fill="none" stroke="#263047" stroke-width="${2.5*s}"/><path d="M${rx-7*s} ${ey}Q${rx} ${ey+6*s} ${rx+7*s} ${ey}" fill="none" stroke="#263047" stroke-width="${2.5*s}"/>`
    : expression==='determined'
      ? `${neutralEyes}<path d="M${lx-8*s} ${ey-13*s}L${lx+7*s} ${ey-9*s}M${rx-7*s} ${ey-9*s}L${rx+8*s} ${ey-13*s}" stroke="#3c2d3a" stroke-width="${2.5*s}" stroke-linecap="round"/>`
      : expression==='surprised'
        ? `<ellipse cx="${lx}" cy="${ey}" rx="${8*s}" ry="${10*s}" fill="white"/><ellipse cx="${rx}" cy="${ey}" rx="${8*s}" ry="${10*s}" fill="white"/><circle cx="${lx}" cy="${ey+1*s}" r="${4.5*s}" fill="${c.eyes}"/><circle cx="${rx}" cy="${ey+1*s}" r="${4.5*s}" fill="${c.eyes}"/>`
        : neutralEyes;
  const mouth=expression==='happy'
    ? `<path d="M${x-8*s+shift} ${y+60*s}Q${x+shift} ${y+70*s} ${x+8*s+shift} ${y+60*s}" fill="#d87983" stroke="#a45762" stroke-width="${1.5*s}"/>`
    : expression==='determined'
      ? `<path d="M${x-7*s+shift} ${y+64*s}H${x+7*s+shift}" fill="none" stroke="#8d5864" stroke-width="${2*s}" stroke-linecap="round"/>`
      : expression==='surprised'
        ? `<ellipse cx="${x+shift}" cy="${y+63*s}" rx="${4*s}" ry="${6*s}" fill="#9c5965"/>`
        : `<path d="M${x-5*s+shift} ${y+61*s}Q${x+shift} ${y+65*s} ${x+5*s+shift} ${y+61*s}" fill="none" stroke="#b66f73" stroke-width="${1.8*s}" stroke-linecap="round"/>`;
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

function characterAtlas(){
  const fw=192,fh=256,sw=1728,sh=1024,cols=4;
  let defs='',bodySvg='';
  CHARACTERS.forEach((c,index)=>{
    const id=`c${index}`;defs+=defsFor(c,id);const sx=(index%cols)*sw,sy=Math.floor(index/cols)*sh;
    for(let row=0;row<4;row++)for(let col=0;col<9;col++){
      const ox=sx+col*fw,oy=sy+row*fh,step=[-1,0,1,0,0,0,0,0,0][col],expression=['neutral','neutral','neutral','neutral','happy','determined','surprised','determined','happy'][col];
      const bob=col===3?-2:0;
      bodySvg+=`<g transform="translate(${ox} ${oy+bob})"><ellipse cx="96" cy="236" rx="45" ry="11" fill="#0b1020" opacity=".23" filter="url(#shadow-${id})"/>${body(c,96,92,1.03,id,row,step)}${head(c,96,28,1.03,id,row,expression)}${col===7?'<rect x="58" y="154" width="76" height="49" rx="6" fill="#f6f0df" stroke="#34435c" stroke-width="4"/><path d="M96 157V200" stroke="#d2b35b" stroke-width="3"/><path d="M66 171H89M103 171H126M66 183H89M103 183H126" stroke="#8ba0b7" stroke-width="3"/>':''}${col===8?'<path d="M44 145L52 129L60 145L77 148L64 160L68 177L52 168L36 177L40 160L27 148Z" fill="#f5d268"/><path d="M142 132L148 120L154 132L167 134L157 143L160 156L148 149L136 156L139 143L129 134Z" fill="#e88ea4"/>':''}</g>`;
    }
  });
  return svgUri(sw*2,sh*2,`<g transform="scale(.5)">${bodySvg}</g>`,defs);
}

function portraits(){
  const cell=256;let defs='',bodySvg='';
  CHARACTERS.forEach((c,index)=>{
    const id=`p${index}`,x=(index%4)*cell,y=Math.floor(index/4)*cell;defs+=defsFor(c,id);
    bodySvg+=`<g transform="translate(${x} ${y})"><rect width="256" height="256" rx="28" fill="#eef2fb"/><circle cx="222" cy="32" r="92" fill="${c.accent}" opacity=".17"/><circle cx="34" cy="230" r="72" fill="#6db3c8" opacity=".14"/><path d="M28 256Q128 134 228 256Z" fill="url(#uniform-${id})"/><path d="M92 154L128 188L164 154L184 256H72Z" fill="#f8f8fb"/><path d="M128 180L114 230L128 252L142 230Z" fill="${c.accent}"/>${head(c,128,28,2.08,id,0,index%3===0?'happy':'neutral')}<path d="M18 236Q128 212 238 236" fill="none" stroke="white" stroke-width="4" opacity=".55"/></g>`;
  });
  return svgUri(512,512,`<g transform="scale(.5)">${bodySvg}</g>`,defs);
}

function mapPanel(x,y,season,index){
  const palettes={spring:['#78b77b','#f1aec1','#8ecfe0','#f9f1e9'],summer:['#62ab72','#f1d05e','#74c6dc','#fff4d8'],autumn:['#9a683f','#d88750','#cfa164','#f7ead8'],winter:['#d7e8ef','#a7c5d8','#edf7fb','#f4f7fa']};
  const [grass,leaf,water,wall]=palettes[season];let s=`<g transform="translate(${x} ${y})"><rect width="1280" height="800" rx="26" fill="#dbe4ee"/><rect x="24" y="24" width="1232" height="752" rx="24" fill="${wall}" stroke="#34435c" stroke-width="5"/>`;
  const rooms=[[42,42,350,228,'#eff3f7'],[374,42,350,228,'#eef5f8'],[706,42,350,228,'#f7f0e8'],[1080,42,152,228,'#e9dfd2']];
  rooms.forEach(([rx,ry,rw,rh,fill],ri)=>{s+=`<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="16" fill="${fill}" stroke="#34435c" stroke-width="4"/>`;
    for(let wx=rx+20;wx<rx+rw-45;wx+=68)s+=`<rect x="${wx}" y="${ry+17}" width="50" height="43" rx="6" fill="#bce2ee" stroke="white" stroke-width="3"/><path d="M${wx+25} ${ry+18}V${ry+59}" stroke="#7ba6bc" stroke-width="2"/>`;
    if(ri<3){for(let r=0;r<2;r++)for(let c=0;c<4;c++){const dx=rx+38+c*69,dy=ry+103+r*61;s+=`<rect x="${dx}" y="${dy}" width="51" height="27" rx="5" fill="#b77a4e" stroke="#684733" stroke-width="2"/><path d="M${dx+9} ${dy+27}V${dy+46}M${dx+42} ${dy+27}V${dy+46}" stroke="#5b6470" stroke-width="5"/>`;}s+=`<rect x="${rx+112}" y="${ry+69}" width="${rw-140}" height="13" rx="3" fill="#3d6a5d"/>`;}
  });
  s+=`<rect x="42" y="286" width="1190" height="104" rx="14" fill="#d6c9b7" stroke="#34435c" stroke-width="4"/>`;
  for(let yy=300;yy<384;yy+=24)s+=`<path d="M48 ${yy}H1226" stroke="#c3b39f"/>`;for(let xx=58;xx<1226;xx+=48)s+=`<path d="M${xx} 290V386" stroke="#c7b8a5"/>`;
  s+=`<rect x="42" y="420" width="360" height="338" rx="20" fill="${grass}" stroke="#34435c" stroke-width="4"/><rect x="426" y="420" width="354" height="338" rx="18" fill="#f2e4cf" stroke="#34435c" stroke-width="4"/><rect x="804" y="420" width="428" height="338" rx="18" fill="#d5aa70" stroke="#34435c" stroke-width="4"/><rect x="150" y="432" width="130" height="314" rx="38" fill="#ddd4c7"/><rect x="52" y="548" width="340" height="100" rx="40" fill="#ddd4c7"/><ellipse cx="214" cy="592" rx="66" ry="64" fill="#a5bbc9" stroke="#496a80" stroke-width="5"/><ellipse cx="214" cy="592" rx="47" ry="46" fill="${water}" stroke="#e5fbff" stroke-width="4"/><circle cx="214" cy="592" r="17" fill="#eaf0f4" stroke="#687a8d" stroke-width="4"/>`;
  [[74,468],[340,470],[76,700],[342,708]].forEach(([tx,ty])=>{s+=`<rect x="${tx-6}" y="${ty+18}" width="12" height="54" rx="4" fill="#79563c"/>`;for(let n=0;n<7;n++){const a=n/7*Math.PI*2,ox=Math.cos(a)*25,oy=Math.sin(a)*18;s+=`<circle cx="${tx+ox}" cy="${ty+oy}" r="28" fill="${season==='winter'?'#f0f8fb':leaf}" opacity=".93"/>`;}});
  for(let yy of [528,626])for(let xx of [466,590,714])s+=`<rect x="${xx}" y="${yy}" width="78" height="38" rx="8" fill="#a56d49" stroke="#684632" stroke-width="3"/><path d="M${xx+16} ${yy+38}V${yy+64}M${xx+62} ${yy+38}V${yy+64}" stroke="#5d6571" stroke-width="6"/>`;
  s+=`<rect x="832" y="448" width="372" height="50" rx="10" fill="#955e3e" stroke="#684632" stroke-width="3"/>`;for(let row=0;row<3;row++)for(let col=0;col<6;col++){const cx=850+col*58,cy=530+row*68;s+=`<rect x="${cx}" y="${cy}" width="44" height="30" rx="6" fill="#b97c4f" stroke="#694936" stroke-width="2"/>`;}
  const labels=[['HOMEROOM',60,246],['MATHEMATICS',393,246],['LITERATURE',725,246],['LIBRARY',1090,246],['COURTYARD',56,748],['CAFETERIA',442,748],['GYMNASIUM',824,748]];labels.forEach(([t,lx,ly])=>s+=`<text x="${lx}" y="${ly}" font-family="Trebuchet MS,Arial" font-size="18" font-weight="700" fill="#26354c">${t}</text>`);
  s+=`<rect x="1000" y="12" width="238" height="38" rx="19" fill="#19243a" opacity=".88"/><text x="1119" y="38" text-anchor="middle" font-family="Trebuchet MS,Arial" font-size="18" font-weight="700" fill="white">${season.toUpperCase()} • MAP ${index+1}</text></g>`;return s;
}
function schoolMaps(){const body=mapPanel(0,0,'spring',0)+mapPanel(1280,0,'summer',1)+mapPanel(0,800,'autumn',2)+mapPanel(1280,800,'winter',3);return svgUri(1280,800,`<g transform="scale(.5)">${body}</g>`);}

const EVENT_DATA=[
['NEW BEGINNINGS','#f7b9ca','#7ac1de','Cherry petals and club banners fill the front courtyard.'],
['RAINY CONNECTIONS','#7f99c7','#bfd9e8','Warm classroom lights glow through a silver afternoon.'],
['FASTER TOGETHER','#68af79','#f1cf63','Team ribbons sweep across the athletics field.'],
['SAKURA FESTIVAL','#d96578','#f0b34f','Lanterns turn the academy into a night of possibility.'],
['MIDTERM MOMENTUM','#6a75a5','#d7c98c','Books, notes and shared snacks cover every library table.'],
['SUMMER LIGHTS','#2d4f8f','#efb85a','Festival lights reflect in the fountain after sunset.'],
['COMMUNITY DAY','#4f8e69','#e2ba67','Teams carry supplies through a bright neighborhood morning.'],
['AUTUMN SPOTLIGHT','#b76445','#df9f58','The gym stage waits behind a curtain of amber leaves.'],
['CREST FORUM','#435d91','#d18ea8','Debate banners frame a crowded assembly hall.'],
['WINTER TRIALS','#7299b6','#e6f1f6','Cold windows and steady footsteps define the endurance week.'],
['LEGACY THREADS','#8b6ca8','#d8b1c6','Yearbooks, photographs and letters cover the archive tables.'],
['YEAR-END GALA','#242a4b','#e0b84f','The ranking board shines above the final celebration.']];
function eventAtlas(){let body='';EVENT_DATA.forEach(([title,a,b,caption],i)=>{const x=(i%4)*400,y=Math.floor(i/4)*400;body+=`<g transform="translate(${x} ${y})"><defs><linearGradient id="ev${i}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="400" fill="url(#ev${i})"/><circle cx="328" cy="74" r="76" fill="white" opacity=".22"/><path d="M0 252Q80 205 158 246T318 234T400 250V400H0Z" fill="#263b58" opacity=".9"/><path d="M88 247V131H312V247M117 247V166H283V247M156 247V198H244V247" fill="#f5efe5" stroke="#32445d" stroke-width="7"/><path d="M189 132V90H211V132" fill="#32445d"/><circle cx="200" cy="83" r="17" fill="#f4d26a" stroke="#32445d" stroke-width="6"/>`;for(let p=0;p<22;p++){const px=(p*73+i*37)%390,py=25+(p*47)%180,rot=(p*29)%180;body+=`<ellipse cx="${px}" cy="${py}" rx="7" ry="3" fill="white" opacity=".6" transform="rotate(${rot} ${px} ${py})"/>`;}
body+=`<rect x="20" y="286" width="360" height="94" rx="18" fill="#121a2b" opacity=".88"/><text x="40" y="320" font-family="Trebuchet MS,Arial" font-size="24" font-weight="800" fill="#f6d875">${esc(title)}</text><text x="40" y="347" font-family="Trebuchet MS,Arial" font-size="13" fill="white">${esc(caption)}</text><text x="40" y="369" font-family="Trebuchet MS,Arial" font-size="12" fill="#c9d8eb">SAKURA CREST STORY EVENT</text></g>`;});return svgUri(800,600,`<g transform="scale(.5)">${body}</g>`);}


function rivalAtlas(){
  const rivals=CHARACTERS.filter(c=>['aiko','mina','rina','emi','hana','ren','haru','daichi','kenji','sora'].includes(c.id));
  let defs='',bodySvg='';
  rivals.forEach((c,index)=>{
    const id=`r${index}`,x=(index%4)*400,y=Math.floor(index/4)*400;defs+=defsFor(c,id);
    const accent=index<5?'#e88ea4':'#87c9d8';
    bodySvg+=`<g transform="translate(${x} ${y})"><linearGradient id="rv${index}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${accent}"/><stop offset="1" stop-color="#243a62"/></linearGradient><rect width="400" height="400" fill="url(#rv${index})"/><circle cx="318" cy="72" r="82" fill="white" opacity=".16"/><path d="M0 270Q100 220 190 258T400 242V400H0Z" fill="#18243a" opacity=".92"/><path d="M24 260H376M64 232V150H336V232M138 232V186H262V232" fill="none" stroke="#f6efe5" stroke-width="10" opacity=".75"/><g transform="translate(190 78)">${body(c,0,116,1.12,id,0,0)}${head(c,0,0,1.12,id,0,'determined')}</g><path d="M48 52L132 136M352 52L268 136" stroke="#f5cf67" stroke-width="8" stroke-linecap="round" opacity=".72"/><circle cx="48" cy="52" r="12" fill="#f5cf67"/><circle cx="352" cy="52" r="12" fill="#f5cf67"/><rect x="24" y="310" width="352" height="66" rx="18" fill="#101827" opacity=".9"/><text x="200" y="344" text-anchor="middle" font-family="Trebuchet MS,Arial" font-size="24" font-weight="800" fill="white">${esc(c.id.replace('teacher_','').toUpperCase())}</text><text x="200" y="368" text-anchor="middle" font-family="Trebuchet MS,Arial" font-size="13" fill="#f6d875">RESPECTFUL RIVALRY</text></g>`;
  });
  return svgUri(800,600,`<g transform="scale(.5)">${bodySvg}</g>`,defs);
}


const MEMORY_DATA=[
  ['aiko','ROOFTOP WITHOUT AN AGENDA','#f1a1b8','#6f86bd','A quiet hour that did not need to become useful.'],
  ['mina','BEFORE THE STARTING GUN','#f2bd65','#73a9c8','A dawn lap with no stopwatch and no crowd.'],
  ['rina','AFTER THE GALLERY EMPTIES','#d7789e','#725f9e','One spotlight remained for the art nobody reviewed.'],
  ['emi','POWER-DOWN PICNIC','#84b8a1','#6179aa','A paper map proved friendship works offline.'],
  ['hana','PEER SUPPORT: CLOSED','#e8a4b1','#89a6b7','Two cups of tea and no advice required.'],
  ['ren','ONE LAST EMPTY GYM','#d07e55','#466f98','The scoreboard began at zero and ended forgotten.'],
  ['haru','THE SONG AFTER THE ENCORE','#6f6aa2','#d18da8','A final chord left unwritten on purpose.'],
  ['daichi','THIRTY SECONDS OF DEAD AIR','#4f78a8','#e29a63','Silence stopped feeling like a verdict.'],
  ['kenji','THE COOPERATIVE ENDING','#5f8d84','#6c6fa7','A strategy game where everybody repaired the city.'],
  ['sora','THE EMPTY PODIUM','#46638d','#b28aa8','A winning argument rewritten with generosity.']
];
function memoryAtlas(){
  let defs='',bodySvg='';
  MEMORY_DATA.forEach(([characterId,title,a,b,caption],index)=>{
    const c=CHARACTERS.find(ch=>ch.id===characterId),id=`m${index}`,x=(index%4)*400,y=Math.floor(index/4)*400;defs+=defsFor(c,id);
    const sceneType=index%5;
    let environment='';
    if(sceneType===0)environment='<path d="M0 245H400V400H0Z" fill="#253851"/><path d="M22 248H378" stroke="#f5d77a" stroke-width="5"/><path d="M55 226V154H345V226" fill="none" stroke="#eef1f5" stroke-width="7"/><circle cx="320" cy="82" r="54" fill="#ffe6a5" opacity=".75"/>';
    if(sceneType===1)environment='<path d="M0 248H400V400H0Z" fill="#3f7458"/><ellipse cx="200" cy="302" rx="174" ry="58" fill="none" stroke="#ead4a4" stroke-width="12"/><path d="M0 250Q100 210 200 245T400 240" fill="#35634e"/>';
    if(sceneType===2)environment='<path d="M0 260H400V400H0Z" fill="#202b43"/><rect x="28" y="52" width="112" height="150" rx="9" fill="#f4eee5"/><rect x="260" y="52" width="112" height="150" rx="9" fill="#f4eee5"/><circle cx="200" cy="42" r="20" fill="#f5d56d"/><path d="M200 62V132" stroke="#f5d56d" stroke-width="5"/>';
    if(sceneType===3)environment='<path d="M0 260H400V400H0Z" fill="#597e5e"/><circle cx="80" cy="98" r="58" fill="#8bb477"/><circle cx="320" cy="98" r="58" fill="#8bb477"/><path d="M80 130V258M320 130V258" stroke="#70523a" stroke-width="14"/><path d="M130 280H270" stroke="#e7d4a3" stroke-width="12"/>';
    if(sceneType===4)environment='<path d="M0 250H400V400H0Z" fill="#2a354d"/><rect x="44" y="65" width="312" height="150" rx="12" fill="#e9e6df"/><path d="M66 100H334M66 135H334M66 170H334" stroke="#9cb1c2" stroke-width="5"/><rect x="150" y="226" width="100" height="34" rx="8" fill="#9b6b4c"/>';
    bodySvg+=`<g transform="translate(${x} ${y})"><linearGradient id="mm${index}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient><rect width="400" height="400" fill="url(#mm${index})"/>${environment}<g transform="translate(200 74)">${body(c,0,119,1.05,id,0,0)}${head(c,0,0,1.05,id,0,'happy')}</g><rect x="18" y="305" width="364" height="77" rx="18" fill="#101827" opacity=".91"/><text x="200" y="337" text-anchor="middle" font-family="Trebuchet MS,Arial" font-size="19" font-weight="800" fill="#f5d268">${esc(title)}</text><text x="200" y="361" text-anchor="middle" font-family="Trebuchet MS,Arial" font-size="11" fill="white">${esc(caption)}</text></g>`;
  });
  return svgUri(800,600,`<g transform="scale(.5)">${bodySvg}</g>`,defs);
}

function keyArt(){
  const defs=`<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#78c9ee"/><stop offset=".56" stop-color="#e4f4fb"/><stop offset="1" stop-color="#fbe6e2"/></linearGradient><linearGradient id="ground" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4f9564"/><stop offset="1" stop-color="#286147"/></linearGradient><filter id="ks"><feDropShadow dx="0" dy="12" stdDeviation="12" flood-opacity=".3"/></filter>`;
  let b=`<rect width="1920" height="1080" fill="url(#sky)"/><circle cx="1580" cy="170" r="112" fill="#fff7cf" opacity=".78"/><path d="M0 694Q320 620 610 682T1180 656T1920 680V1080H0Z" fill="url(#ground)"/><path d="M560 700V334H1360V700M650 700V424H1270V700M850 700V512H1070V700" fill="#f7f2e8" stroke="#30435f" stroke-width="18" filter="url(#ks)"/><path d="M928 335V235H992V335" fill="#30435f"/><circle cx="960" cy="206" r="54" fill="#f6d168" stroke="#30435f" stroke-width="16"/><path d="M960 164V206L995 228" fill="none" stroke="#30435f" stroke-width="10" stroke-linecap="round"/><path d="M574 420H1346" stroke="#b8dbe7" stroke-width="30" stroke-dasharray="92 20"/>`;
  for(let i=0;i<95;i++){const x=(i*197)%1910,y=28+(i*83)%520,r=5+(i%4),rot=(i*31)%180;b+=`<ellipse cx="${x}" cy="${y}" rx="${r+4}" ry="${r}" fill="${i%3?'#f3a9bc':'#fff0f4'}" opacity=".72" transform="rotate(${rot} ${x} ${y})"/>`;}
  const positions=[[610,620,2,.95],[780,585,7,1.08],[960,555,0,1.26],[1150,585,4,1.08],[1320,620,10,.95]];
  positions.forEach(([x,y,idx,s],n)=>{const c=CHARACTERS[idx],id=`k${n}`;b+=`<g>${defsFor(c,id)}<ellipse cx="${x}" cy="${y+330*s}" rx="${92*s}" ry="${22*s}" fill="#132238" opacity=".25"/>${body(c,x,y+125*s,s*1.5,id,0,0)}${head(c,x,y,s*1.5,id,0,n===2?'happy':'neutral')}</g>`;});
  b+=`<g filter="url(#ks)"><path d="M150 92H904Q956 92 956 144V386Q956 438 904 438H150Q98 438 98 386V144Q98 92 150 92Z" fill="#ffffff" opacity=".94"/><path d="M126 352H928V416H126Z" fill="#253654"/><text x="527" y="213" text-anchor="middle" font-family="Trebuchet MS,Arial" font-size="116" font-weight="900" fill="#244a88" stroke="white" stroke-width="8" paint-order="stroke">SOCIAL</text><text x="527" y="328" text-anchor="middle" font-family="Trebuchet MS,Arial" font-size="116" font-weight="900" fill="#e45d8a" stroke="white" stroke-width="8" paint-order="stroke">SUMMIT</text><text x="527" y="395" text-anchor="middle" font-family="Trebuchet MS,Arial" font-size="29" font-weight="800" letter-spacing="7" fill="#f7d26c">RISE TO THE TOP</text><path d="M468 75L487 28L519 66L552 20L579 67L613 31L625 79Z" fill="#f4c84e" stroke="#9b6d13" stroke-width="6"/></g><rect x="1350" y="850" width="490" height="150" rx="32" fill="#14223a" opacity=".9"/><text x="1595" y="902" text-anchor="middle" font-family="Trebuchet MS,Arial" font-size="27" font-weight="800" fill="#f4cf63">FOUR YEARS • FORTY-EIGHT CHAPTERS</text><text x="1595" y="947" text-anchor="middle" font-family="Trebuchet MS,Arial" font-size="21" fill="white">Friendships • Clubs • Rankings • Prom</text><text x="1595" y="979" text-anchor="middle" font-family="Trebuchet MS,Arial" font-size="17" fill="#bcd8ee">A FAMILY-FRIENDLY SCHOOL-LIFE RPG</text>`;
  return svgUri(960,540,`<g transform="scale(.5)">${b}</g>`,defs);
}

function tileset(){let b='<rect width="1024" height="512" fill="#eef2f5"/>';const colors=['#e9dcc8','#d4c4ae','#85b77e','#6ea770','#a9d3e2','#d3a56e','#b7794e','#f4eee4','#3f6b5e','#c2d7df','#d9e5ec','#78879a','#f1b7c8','#d58859','#e9c969','#7b69a8'];for(let i=0;i<32;i++){const x=(i%8)*128,y=Math.floor(i/8)*128,c=colors[i%colors.length];b+=`<rect x="${x+3}" y="${y+3}" width="122" height="122" rx="12" fill="${c}" stroke="#34435c" stroke-width="4"/>`;for(let n=0;n<5;n++)b+=`<path d="M${x+18+n*21} ${y+18}V${y+110}" stroke="white" opacity=".13" stroke-width="5"/>`;b+=`<text x="${x+64}" y="${y+72}" text-anchor="middle" font-family="Arial" font-size="14" font-weight="700" fill="#26354c">${String(i+1).padStart(2,'0')}</text>`;}return svgUri(512,256,`<g transform="scale(.5)">${b}</g>`);}
function uiIcons(){const labels=['MAP','DAY','TASK','RANK','FRIEND','CLUB','BAG','SAVE','MUSIC','STAR','HEART','BOOK','BELL','CROWN','CHAT','HOME'];let b='<rect width="1024" height="512" fill="#172238"/>';labels.forEach((label,i)=>{const x=(i%8)*128,y=Math.floor(i/8)*256;b+=`<g transform="translate(${x} ${y})"><rect x="16" y="34" width="96" height="96" rx="24" fill="#f4f0e8" stroke="#e0b84f" stroke-width="5"/><circle cx="64" cy="82" r="27" fill="${i%2?'#e35f83':'#4f79ad'}"/><path d="M43 83H85M64 62V104" stroke="white" stroke-width="8" stroke-linecap="round"/><text x="64" y="166" text-anchor="middle" font-family="Trebuchet MS,Arial" font-size="16" font-weight="800" fill="white">${label}</text></g>`;});return svgUri(512,256,`<g transform="scale(.5)">${b}</g>`);}

function createArtSources(){return {keyart:keyArt(),school_maps:schoolMaps(),portraits:portraits(),event_atlas:eventAtlas(),rival_atlas:rivalAtlas(),memory_atlas:memoryAtlas(),character_atlas:characterAtlas(),tileset:tileset(),ui_icons:uiIcons()};}
const artCharacterIds = CHARACTERS.map(character=>character.id);
