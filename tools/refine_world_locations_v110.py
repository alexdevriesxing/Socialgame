from PIL import Image,ImageOps,ImageEnhance,ImageFilter,ImageDraw
from pathlib import Path
import hashlib,json

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/anime'
campus=Image.open(OUT/'campus.webp').convert('RGB')
CELL=(384,256)
PALETTES=[
 ((94,67,92),(231,188,203)),((76,104,127),(232,191,111)),((104,70,48),(221,163,104)),((22,24,58),(157,131,224)),
 ((69,119,83),(102,191,207)),((79,58,43),(133,205,220)),((33,22,45),(207,100,131)),((157,96,54),(230,211,173)),
 ((28,24,48),(221,169,77)),((72,34,74),(235,145,173)),((172,158,138),(188,146,95)),((74,109,96),(101,182,154)),
 ((225,230,222),(90,178,196)),((66,78,94),(101,152,209)),((94,140,104),(229,184,75)),((66,102,83),(135,201,216))]


def fit(image,size,box=None):return ImageOps.fit(image.crop(box) if box else image,size,Image.Resampling.LANCZOS)
def texture(index):
    crop_w=1152;max_x=campus.width-crop_w;x=int(max_x*(index/15));base=fit(campus,CELL,(x,0,x+crop_w,campus.height)).filter(ImageFilter.GaussianBlur(2.2))
    if index%2:base=ImageOps.mirror(base)
    color,accent=PALETTES[index];base=Image.blend(base,Image.new('RGB',CELL,color),.42)
    base=ImageEnhance.Contrast(base).enhance(1.08);base=ImageEnhance.Color(base).enhance(.86)
    return base,accent

def border(image,accent):
    draw=ImageDraw.Draw(image,'RGBA');draw.rounded_rectangle((3,3,380,252),10,outline=(*accent,190),width=3)
    for y in range(48):draw.rectangle((0,208+y,384,208+y),fill=(8,12,22,int(120*y/48)))
    return image

def home(index):
    im,a=texture(index);d=ImageDraw.Draw(im,'RGBA');d.rectangle((0,0,384,256),fill=(77,47,70,110));d.rounded_rectangle((18,104,182,226),14,fill=(105,72,91,245),outline=(244,207,219,235),width=4);d.rounded_rectangle((31,118,169,163),10,fill=(244,224,230,250));d.rectangle((45,161,169,222),fill=(77,100,139,235));d.rounded_rectangle((262,32,370,225),10,fill=(88,61,49,245),outline=(226,187,124,230),width=4);d.line((316,38,316,218),fill=(226,187,124,210),width=3);d.rounded_rectangle((190,142,276,178),7,fill=(133,92,59,240));d.ellipse((218,113,244,139),fill=(248,218,125,230));d.line((231,137,231,151),fill=(72,65,68,230),width=3);return border(im,a)
def shopping(index):
    im,a=texture(index);d=ImageDraw.Draw(im,'RGBA');d.rectangle((0,0,384,256),fill=(78,102,122,90));
    for x,c in [(4,(222,99,109)),(130,(74,135,177)),(256,(103,162,124))]:
        d.rounded_rectangle((x,42,x+124,202),8,fill=(229,218,197,245),outline=(244,228,188,220),width=3);d.rectangle((x+13,89,x+111,187),fill=(52,70,83,235))
        for s in range(8):d.polygon([(x+s*15,67),(x+s*15+15,67),(x+s*15+12,88),(x+s*15+3,88)],fill=(*c,240) if s%2==0 else (251,237,209,240))
        d.rectangle((x+22,112,x+102,121),fill=(242,203,96,190));d.rectangle((x+22,146,x+102,154),fill=(136,193,207,160))
    return border(im,a)
def cafe(index):
    im,a=texture(index);d=ImageDraw.Draw(im,'RGBA');d.rectangle((0,0,384,256),fill=(86,55,37,125));d.rounded_rectangle((18,27,366,104),12,fill=(94,59,40,245),outline=(226,180,112,220),width=4);d.rectangle((34,47,350,88),fill=(42,34,34,235));
    for cx,cy in [(75,153),(190,166),(309,151)]:d.ellipse((cx-44,cy-17,cx+44,cy+17),fill=(137,91,56,245),outline=(236,197,133,220),width=3);d.rectangle((cx-4,cy+15,cx+4,cy+54),fill=(68,50,43,235));d.ellipse((cx-11,cy-10,cx+5,cy+6),fill=(248,239,221,245));d.arc((cx-2,cy-8,cx+17,cy+9),270,90,fill=(248,239,221,235),width=3)
    return border(im,a)
def arcade(index):
    im,a=texture(index);im=Image.blend(im,Image.new('RGB',CELL,(16,18,46)),.62);d=ImageDraw.Draw(im,'RGBA');d.rectangle((0,0,384,256),fill=(15,16,44,90));neon=[(155,131,223),(83,211,236),(236,93,166),(249,198,70)]
    for row,y in enumerate([28,126]):
      for col,x in enumerate([12,84,156,228,300]):
        c=neon[(row+col)%4];d.rounded_rectangle((x,y,x+62,y+92),8,fill=(28,34,66,250),outline=(*c,250),width=4);d.rounded_rectangle((x+9,y+12,x+53,y+52),5,fill=(8,14,32,255),outline=(137,225,244,220),width=2);d.ellipse((x+16,y+66,x+26,y+76),fill=(245,205,86,245));d.ellipse((x+37,y+66,x+47,y+76),fill=(236,93,166,245))
    d.rounded_rectangle((103,211,281,244),10,fill=(80,46,97,240),outline=(249,205,90,230),width=3);return border(im,a)
def park(index):
    im,a=texture(index);im=Image.blend(im,Image.new('RGB',CELL,(71,126,83)),.35);d=ImageDraw.Draw(im,'RGBA');d.polygon([(118,0),(235,0),(284,256),(168,256)],fill=(74,176,209,210));d.line((140,0,190,256),fill=(227,241,220,225),width=14)
    for x,y in [(42,62),(329,50),(52,184),(326,177)]:d.ellipse((x-31,y-34,x+31,y+24),fill=(79,155,89,240),outline=(184,224,164,180),width=2);d.rectangle((x-4,y+18,x+4,y+57),fill=(94,61,40,235))
    for x,y in [(90,174),(294,199)]:d.rounded_rectangle((x-38,y-7,x+38,y+8),5,fill=(133,88,53,240));d.rectangle((x-27,y+8,x-20,y+28),fill=(62,69,76,230));d.rectangle((x+20,y+8,x+27,y+28),fill=(62,69,76,230))
    return border(im,a)
def library(index):
    im,a=texture(index);im=Image.blend(im,Image.new('RGB',CELL,(76,51,36)),.42);d=ImageDraw.Draw(im,'RGBA')
    for x in [5,94,285]:d.rounded_rectangle((x,20,x+86,225),6,fill=(83,55,37,250),outline=(208,167,105,225),width=3);[d.line((x+7,y,x+79,y),fill=(47,34,29,240),width=3) for y in range(50,220,34)];
    for x in [12,101,292]:
      for row,y in enumerate(range(27,204,34)):
        for col in range(6):c=[(183,81,77),(78,124,165),(200,148,67),(98,150,101),(142,101,160)][(row+col)%5];d.rectangle((x+col*12,y,x+8+col*12,y+20),fill=(*c,240))
    d.rounded_rectangle((119,152,274,188),7,fill=(138,94,58,240),outline=(229,189,122,210),width=3);return border(im,a)
def cinema(index):
    im,a=texture(index);im=Image.blend(im,Image.new('RGB',CELL,(23,14,29)),.72);d=ImageDraw.Draw(im,'RGBA');d.rounded_rectangle((45,20,339,129),10,fill=(242,232,210,250),outline=(227,187,82,240),width=5);d.polygon([(192,0),(68,143),(316,143)],fill=(255,229,164,30))
    for row,y in enumerate([151,183,214]):
      for x in range(16+row*10,365,31):d.rounded_rectangle((x,y,x+24,y+28),6,fill=(112,42,65,245),outline=(194,88,123,210),width=2)
    return border(im,a)
def sports(index):
    im,a=texture(index);im=Image.blend(im,Image.new('RGB',CELL,(172,106,58)),.38);d=ImageDraw.Draw(im,'RGBA');d.rectangle((18,24,366,236),fill=(190,125,74,225),outline=(251,244,219,235),width=5);d.line((192,24,192,236),fill=(251,244,219,225),width=5);d.ellipse((145,86,239,180),outline=(251,244,219,225),width=5);d.rectangle((44,58,57,188),fill=(65,77,91,235));d.rectangle((327,58,340,188),fill=(65,77,91,235));d.rounded_rectangle((130,4,254,30),5,fill=(31,45,68,240),outline=(234,196,88,225),width=3);return border(im,a)
def music(index):
    im,a=texture(index);im=Image.blend(im,Image.new('RGB',CELL,(22,17,40)),.72);d=ImageDraw.Draw(im,'RGBA');d.rectangle((32,78,352,220),fill=(50,31,50,245),outline=(225,177,78,225),width=4);d.rectangle((46,93,338,205),fill=(26,28,48,245));
    for x,c in [(66,(236,93,166)),(130,(83,211,236)),(194,(249,198,70)),(258,(155,131,223)),(322,(116,185,133))]:d.ellipse((x-8,20,x+8,36),fill=(*c,245));d.polygon([(x,35),(x-40,176),(x+40,176)],fill=(*c,42))
    d.ellipse((163,145,221,203),fill=(223,183,73,235),outline=(249,238,205,230),width=4);d.line((89,120,123,207),fill=(211,168,110,240),width=9);d.line((295,120,261,207),fill=(211,168,110,240),width=9);return border(im,a)
def festival(index):
    im,a=texture(index);im=Image.blend(im,Image.new('RGB',CELL,(70,30,73)),.48);d=ImageDraw.Draw(im,'RGBA')
    for y in [35,74]:d.line((8,y,376,y+12),fill=(240,207,116,190),width=2);[(d.ellipse((x-9,y-4,x+9,y+19),fill=(*[(239,199,94),(232,142,173),(130,203,220)][(x//44)%3],240))) for x in range(28,378,44)]
    for x,c in [(8,(211,84,79)),(132,(79,135,177)),(256,(206,144,68))]:d.rectangle((x,151,x+116,231),fill=(236,216,190,245),outline=(102,69,51,230),width=3);[(d.rectangle((x+s*15,130,x+s*15+8,154),fill=(*c,245) if s%2==0 else (252,237,211,245))) for s in range(8)]
    return border(im,a)
def museum(index):
    im,a=texture(index);im=Image.blend(im,Image.new('RGB',CELL,(209,201,187)),.58);d=ImageDraw.Draw(im,'RGBA')
    for x,c in [(12,(159,91,79)),(136,(91,126,155)),(260,(123,101,151))]:d.rounded_rectangle((x,28,x+112,181),9,fill=(232,226,213,245),outline=(147,119,79,230),width=4);d.rounded_rectangle((x+18,48,x+94,126),6,fill=(*c,225),outline=(250,239,210,230),width=5);d.rectangle((x+38,147,x+74,155),fill=(61,69,83,230))
    d.ellipse((147,181,237,239),fill=(116,137,128,235),outline=(225,194,117,235),width=4);return border(im,a)
def study(index):
    im,a=texture(index);im=Image.blend(im,Image.new('RGB',CELL,(68,105,91)),.40);d=ImageDraw.Draw(im,'RGBA')
    for x,y in [(18,70),(143,70),(268,70),(78,155),(213,155)]:d.rounded_rectangle((x,y,x+98,y+46),7,fill=(163,116,77,245),outline=(226,188,128,220),width=3);d.rectangle((x+18,y+46,x+26,y+78),fill=(75,61,56,235));d.rectangle((x+72,y+46,x+80,y+78),fill=(75,61,56,235));d.ellipse((x+39,y-18,x+59,y+4),fill=(246,213,112,230));d.line((x+49,y+2,x+49,y+19),fill=(68,64,69,235),width=3)
    return border(im,a)
def convenience(index):
    im,a=texture(index);im=Image.blend(im,Image.new('RGB',CELL,(224,233,228)),.62);d=ImageDraw.Draw(im,'RGBA')
    for x in [8,126]:d.rounded_rectangle((x,26,x+108,218),6,fill=(239,241,233,250),outline=(71,118,132,235),width=3);[d.line((x+7,y,x+101,y),fill=(71,118,132,190),width=3) for y in [58,94,130,166,202]]
    for x in [15,133]:
      for row,y in enumerate([36,72,108,144,180]):
        for col in range(6):c=[(222,109,99),(225,170,79),(108,164,129),(111,145,176)][(row+col)%4];d.rectangle((x+col*15,y,x+11+col*15,y+17),fill=(*c,240))
    d.rounded_rectangle((254,48,376,222),9,fill=(64,132,143,245),outline=(238,199,95,230),width=4);d.rectangle((273,73,357,126),fill=(20,40,53,240));d.rounded_rectangle((270,168,360,205),7,fill=(145,94,62,240));return border(im,a)
def station(index):
    im,a=texture(index);im=Image.blend(im,Image.new('RGB',CELL,(55,72,91)),.46);d=ImageDraw.Draw(im,'RGBA');d.polygon([(24,37),(360,37),(332,84),(52,84)],fill=(49,65,84,245),outline=(226,190,103,230));
    for x in [58,188,318]:d.rectangle((x,82,x+9,190),fill=(73,82,94,240))
    d.rectangle((0,143,384,167),fill=(225,220,207,240));d.line((0,201,384,201),fill=(67,76,88,245),width=8);d.line((0,233,384,233),fill=(67,76,88,245),width=8)
    for x in range(8,384,34):d.rectangle((x,193,x+6,242),fill=(91,71,56,235))
    d.rounded_rectangle((14,97,120,139),7,fill=(30,46,67,245),outline=(232,194,97,225),width=3);d.rounded_rectangle((264,97,370,139),7,fill=(30,46,67,245),outline=(232,194,97,225),width=3);return border(im,a)
def courtyard(index):
    im,a=texture(index);im=Image.blend(im,Image.new('RGB',CELL,(84,138,96)),.32);d=ImageDraw.Draw(im,'RGBA');d.ellipse((116,45,268,197),fill=(83,181,210,195),outline=(246,236,199,235),width=7);d.ellipse((161,90,223,152),fill=(235,219,164,235));
    for x,y in [(45,68),(337,65),(50,190),(334,188)]:d.ellipse((x-28,y-30,x+28,y+22),fill=(90,158,91,235));d.rectangle((x-4,y+17,x+4,y+54),fill=(90,61,42,230))
    return border(im,a)
def rooftop(index):
    im,a=texture(index);im=Image.blend(im,Image.new('RGB',CELL,(52,101,84)),.36);d=ImageDraw.Draw(im,'RGBA');d.rectangle((18,34,366,232),fill=(84,134,101,165),outline=(242,232,201,235),width=5);d.line((192,34,192,232),fill=(242,232,201,180),width=4)
    for x,y in [(52,58),(306,55),(68,180),(300,183)]:d.rounded_rectangle((x,y,x+54,y+42),8,fill=(111,78,53,240));d.ellipse((x+5,y-25,x+49,y+18),fill=(85,154,91,235))
    return border(im,a)

builders=[home,shopping,cafe,arcade,park,library,cinema,sports,music,festival,museum,study,convenience,station,courtyard,rooftop]
atlas=Image.new('RGB',(1536,1024),(15,19,29))
for index,builder in enumerate(builders):atlas.paste(builder(index),((index%4)*384,(index//4)*256))
path=OUT/'world-locations.webp';atlas.save(path,'WEBP',quality=92,method=6)
manifest_path=OUT/'manifest.json';manifest=json.loads(manifest_path.read_text());data=path.read_bytes();manifest['assets']['world-locations.webp']={'width':1536,'height':1024,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()};manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
print(manifest['assets']['world-locations.webp'])
