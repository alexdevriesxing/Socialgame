function characterAtlas(){
  const fw=192,fh=256,sw=1344,sh=1024,cols=4;
  let defs='',bodySvg='';
  CHARACTERS.forEach((c,index)=>{
    const id=`c${index}`;defs+=defsFor(c,id);const sx=(index%cols)*sw,sy=Math.floor(index/cols)*sh;
    for(let row=0;row<4;row++)for(let col=0;col<7;col++){
      const ox=sx+col*fw,oy=sy+row*fh,step=[-1,0,1,0,0,0,0][col],expression=['neutral','neutral','neutral','neutral','happy','determined','surprised'][col];
      const bob=col===3?-2:0;
      bodySvg+=`<g transform="translate(${ox} ${oy+bob})"><ellipse cx="96" cy="236" rx="45" ry="11" fill="#0b1020" opacity=".23" filter="url(#shadow-${id})"/>${body(c,96,92,1.03,id,row,step)}${head(c,96,28,1.03,id,row,expression)}</g>`;
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
