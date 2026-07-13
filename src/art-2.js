function characterAtlas(){
  const fw=192,fh=256,sw=576,sh=1024,cols=4;
  let defs='',bodySvg='';
  CHARACTERS.forEach((c,index)=>{
    const id=`c${index}`;defs+=defsFor(c,id);const sx=(index%cols)*sw,sy=Math.floor(index/cols)*sh;
    for(let row=0;row<4;row++)for(let col=0;col<3;col++){
      const ox=sx+col*fw,oy=sy+row*fh,step=[-1,0,1][col];
      bodySvg+=`<g transform="translate(${ox} ${oy})"><ellipse cx="96" cy="236" rx="45" ry="11" fill="#0b1020" opacity=".23" filter="url(#shadow-${id})"/>${body(c,96,92,1.03,id,row,step)}${head(c,96,28,1.03,id,row)}</g>`;
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

const EVENT_DATA=[['NEW BEGINNINGS','#f7b9ca','#7ac1de','Cherry petals and club banners fill the front courtyard.'],['RAINY CONNECTIONS','#7f99c7','#bfd9e8','Warm classroom lights glow through a silver afternoon.'],['FASTER TOGETHER','#68af79','#f1cf63','Team ribbons sweep across the athletics field.'],['SAKURA FESTIVAL','#d96578','#f0b34f','Lanterns turn the academy into a night of possibility.'],['MIDTERM MOMENTUM','#6a75a5','#d7c98c','Books, notes and shared snacks cover every library table.'],['SUMMER LIGHTS','#2d4f8f','#efb85a','Festival lights reflect in the fountain after sunset.'],['AUTUMN SPOTLIGHT','#b76445','#df9f58','The gym stage waits behind a curtain of amber leaves.'],['YEAR-END GALA','#242a4b','#e0b84f','The ranking board shines above the final celebration.']];
