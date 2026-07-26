from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageDraw
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'anime'
OUT.mkdir(parents=True, exist_ok=True)
campus = Image.open(OUT / 'campus.webp').convert('RGB')
portraits = Image.open(OUT / 'portraits.webp').convert('RGBA')
CELL = (384, 256)
COLORS = [(232,142,173),(229,184,75),(216,137,87),(155,131,223),(116,185,133),(128,203,220),(207,100,131),(223,102,91),(221,169,77),(235,145,173),(188,146,95),(101,182,154),(90,178,196),(101,152,209),(229,184,75),(135,201,216)]


def fit(image, size, box=None):
    source = image.crop(box) if box else image
    return ImageOps.fit(source, size, Image.Resampling.LANCZOS)


def grade(image, brightness=1, contrast=1, saturation=1, tint=None, alpha=0):
    image = ImageEnhance.Brightness(image).enhance(brightness)
    image = ImageEnhance.Contrast(image).enhance(contrast)
    image = ImageEnhance.Color(image).enhance(saturation)
    if tint and alpha:
        image = Image.blend(image, Image.new('RGB', image.size, tint), alpha)
    return image


def framed(image, accent):
    image = image.copy()
    draw = ImageDraw.Draw(image, 'RGBA')
    width, height = image.size
    draw.rectangle((0, 0, width, 18), fill=(255,255,255,16))
    for offset in range(64):
        draw.rectangle((0, height-64+offset, width, height-64+offset), fill=(8,12,22,int(100*offset/64)))
    draw.rounded_rectangle((3,3,width-4,height-4), radius=10, outline=(*accent,150), width=2)
    return image


def base_crop(index):
    crop_width = 1152
    max_x = campus.width - crop_width
    x = int((max_x / 15) * index)
    base = fit(campus, CELL, (x, 0, x + crop_width, campus.height))
    return ImageOps.mirror(base) if index % 3 == 1 else base


def location_cell(index):
    accent = COLORS[index]
    image = grade(base_crop(index), .90 + (index % 4) * .04, 1.08 + (index % 3) * .04, 1.02 + (index % 5) * .035, accent, .035)
    draw = ImageDraw.Draw(image, 'RGBA')
    if index == 0:
        draw.rounded_rectangle((22,132,150,218),12,fill=(105,72,91,235),outline=(238,198,210,220),width=3)
        draw.rounded_rectangle((34,143,142,181),9,fill=(242,221,228,240))
        draw.rounded_rectangle((276,52,358,222),8,fill=(88,61,49,235),outline=(220,181,120,220),width=3)
        draw.line((317,58,317,216),fill=(220,181,120,190),width=2)
    elif index == 1:
        for x, color in [(12,(225,110,115)),(142,(91,143,180)),(270,(109,160,126))]:
            draw.rectangle((x,54,x+100,66),fill=(*color,230))
            for stripe in range(6):
                draw.polygon([(x+stripe*16,66),(x+stripe*16+16,66),(x+stripe*16+12,80),(x+stripe*16+4,80)],fill=(*color,220) if stripe%2==0 else (250,239,216,220))
    elif index == 2:
        for cx, cy in [(90,152),(198,169),(304,150)]:
            draw.ellipse((cx-38,cy-15,cx+38,cy+15),fill=(118,76,50,220),outline=(222,177,120,200),width=2)
            draw.rectangle((cx-3,cy+12,cx+3,cy+45),fill=(65,48,43,220))
    elif index == 3:
        image = grade(image,.72,1.22,1.32,(25,19,56),.20)
        draw = ImageDraw.Draw(image,'RGBA')
        neon=[(155,131,223),(92,205,232),(232,104,164),(245,196,76)]
        for slot,x in enumerate([18,88,228,298]):
            color=neon[slot]
            draw.rounded_rectangle((x,64,x+60,177),7,fill=(27,35,62,245),outline=(*color,240),width=3)
            draw.rounded_rectangle((x+8,76,x+52,121),5,fill=(17,25,43,255),outline=(140,220,244,210),width=2)
            draw.ellipse((x+17,138,x+26,147),fill=(245,204,88,240))
            draw.ellipse((x+34,138,x+43,147),fill=(232,104,164,240))
    elif index == 4:
        draw.polygon([(145,0),(235,0),(270,256),(182,256)],fill=(88,184,210,155))
        draw.line((160,0,200,256),fill=(218,239,222,200),width=11)
        for x,y in [(52,190),(320,174),(80,72),(334,58)]:
            draw.ellipse((x-23,y-27,x+23,y+19),fill=(94,156,88,220))
            draw.rectangle((x-3,y+12,x+3,y+45),fill=(93,61,42,220))
    elif index == 5:
        for x in [12,272]:
            draw.rounded_rectangle((x,52,x+100,196),6,fill=(91,63,43,235),outline=(205,167,104,190),width=2)
            for y in range(70,190,28):
                draw.line((x+8,y,x+92,y),fill=(58,40,31,230),width=3)
    elif index == 6:
        image = grade(image,.62,1.24,.82,(34,19,38),.22)
        draw = ImageDraw.Draw(image,'RGBA')
        draw.rounded_rectangle((68,30,316,124),9,fill=(239,226,201,240),outline=(224,183,81,230),width=4)
        for row,y in enumerate([150,180,210]):
            for x in range(30+row*12,350,34):
                draw.rounded_rectangle((x,y,x+26,y+28),6,fill=(109,43,65,235),outline=(187,90,120,190),width=2)
    elif index == 7:
        draw.rectangle((26,48,358,229),fill=(196,134,82,100),outline=(249,243,221,220),width=4)
        draw.line((192,48,192,229),fill=(249,243,221,210),width=4)
        draw.ellipse((153,101,231,179),outline=(249,243,221,210),width=4)
    elif index == 8:
        image = grade(image,.70,1.25,1.25,(32,20,50),.18)
        draw = ImageDraw.Draw(image,'RGBA')
        draw.rounded_rectangle((50,60,334,150),10,fill=(26,30,47,240),outline=(222,174,74,230),width=3)
        draw.rectangle((65,145,320,205),fill=(66,43,57,230))
        for x,color in [(85,(232,104,164)),(145,(92,204,232)),(205,(245,196,76)),(265,(153,128,222))]:
            draw.ellipse((x-7,28,x+7,42),fill=(*color,235))
            draw.polygon([(x,41),(x-48,150),(x+48,150)],fill=(*color,35))
    elif index == 9:
        image = grade(image,.80,1.18,1.30,(70,37,79),.14)
        draw = ImageDraw.Draw(image,'RGBA')
        for y in [45,90]:
            draw.line((10,y,374,y+12),fill=(236,203,116,160),width=2)
            for x in range(35,370,48):
                color=[(239,199,94),(232,142,173),(130,203,220)][(x//48)%3]
                draw.ellipse((x-8,y-4,x+8,y+18),fill=(*color,230))
    elif index == 10:
        for x,color in [(28,(159,91,79)),(142,(91,126,155)),(256,(123,101,151))]:
            draw.rounded_rectangle((x,62,x+100,178),8,fill=(218,210,196,220),outline=(147,119,79,210),width=3)
            draw.rounded_rectangle((x+16,77,x+84,132),5,fill=(*color,220),outline=(239,229,198,220),width=4)
    elif index == 11:
        for x,y in [(30,118),(144,118),(258,118),(90,184),(220,184)]:
            draw.rounded_rectangle((x,y,x+94,y+42),6,fill=(162,118,80,220),outline=(222,187,132,200),width=2)
            draw.rectangle((x+18,y+42,x+25,y+66),fill=(82,66,59,220))
            draw.rectangle((x+69,y+42,x+76,y+66),fill=(82,66,59,220))
    elif index == 12:
        for x in [18,140]:
            draw.rounded_rectangle((x,55,x+100,196),6,fill=(232,231,221,225),outline=(78,118,132,220),width=2)
            for y in [75,110,145,180]:
                draw.line((x+6,y,x+94,y),fill=(78,118,132,190),width=2)
        draw.rounded_rectangle((265,75,365,205),8,fill=(65,130,142,230),outline=(238,199,95,210),width=3)
    elif index == 13:
        draw.rectangle((0,155,384,174),fill=(222,216,200,220))
        draw.line((0,202,384,202),fill=(72,80,90,230),width=6)
        draw.line((0,229,384,229),fill=(72,80,90,230),width=6)
        draw.polygon([(38,60),(346,60),(320,94),(64,94)],fill=(52,69,88,230),outline=(226,191,104,210))
    elif index == 14:
        draw.ellipse((137,72,247,182),fill=(91,177,204,180),outline=(241,232,193,220),width=6)
        draw.ellipse((170,103,214,147),fill=(236,220,167,220))
    else:
        draw.rectangle((22,44,362,222),outline=(238,231,204,210),width=4)
        draw.line((192,44,192,222),fill=(238,231,204,160),width=3)
        draw.ellipse((72,68,116,108),fill=(87,151,91,220))
        draw.ellipse((270,66,316,108),fill=(87,151,91,220))
    return framed(image, accent)


world = Image.new('RGB', (1536,1024), (17,22,34))
world_cells=[]
for index in range(16):
    cell=location_cell(index)
    world_cells.append(cell)
    world.paste(cell,((index%4)*384,(index//4)*256))
world.save(OUT/'world-locations.webp','WEBP',quality=90,method=6)

district=fit(campus,(1536,1024)).filter(ImageFilter.GaussianBlur(4.2))
district=grade(district,1.02,1.08,1.14,(47,81,94),.05)
draw=ImageDraw.Draw(district,'RGBA')
roads=[[(90,150),(420,250),(760,190),(1120,320),(1460,220)],[(110,700),(430,570),(760,650),(1100,520),(1450,700)],[(320,80),(360,400),(420,900)],[(760,80),(800,420),(820,940)],[(1180,70),(1140,430),(1200,930)]]
for points in roads:
    draw.line(points,fill=(238,220,176,190),width=28,joint='curve')
    draw.line(points,fill=(155,132,101,120),width=4,joint='curve')
draw.polygon([(920,0),(1120,0),(1060,300),(1130,620),(1050,1024),(870,1024),(945,650),(870,340)],fill=(77,166,197,120))
pins=[(210,250),(410,170),(625,260),(820,170),(1070,255),(1280,170),(290,500),(500,610),(710,470),(920,580),(1160,500),(1340,630),(610,785),(1040,800)]
for (x,y),color in zip(pins,COLORS):
    draw.ellipse((x-29,y-29,x+29,y+29),fill=(*color,235),outline=(255,246,221,235),width=5)
    draw.polygon([(x-12,y+19),(x+12,y+19),(x,y+55)],fill=(*color,235))
    draw.ellipse((x-9,y-9,x+9,y+9),fill=(255,246,221,240))
district.save(OUT/'district-map.webp','WEBP',quality=90,method=6)


def portrait(index,size=112):
    cell=portraits.crop(((index%4)*128,(index//4)*128,(index%4+1)*128,(index//4+1)*128))
    return fit(cell,(size,size))


def story_atlas(kind):
    atlas=Image.new('RGB',(800,600),(14,18,29))
    offset={'events':0,'rivals':2,'memories':4}[kind]
    for index in range(12):
        background=world_cells[(index*5+offset)%16].resize((200,200),Image.Resampling.LANCZOS)
        background=grade(background,.83,1.12,1.05,COLORS[index],.08)
        draw=ImageDraw.Draw(background,'RGBA')
        if kind=='events':
            mode=index%4
            if mode==0:
                for y in [34,64]:
                    draw.line((8,y,192,y+8),fill=(244,213,130,170),width=2)
                    for x in range(24,190,36):
                        color=COLORS[(index+x//36)%12]
                        draw.ellipse((x-5,y-3,x+5,y+10),fill=(*color,220))
            elif mode==1:
                draw.rectangle((24,126,176,177),fill=(61,42,58,220))
                draw.ellipse((76,106,124,154),fill=(224,187,83,220),outline=(251,242,214,220),width=3)
            elif mode==2:
                draw.polygon([(100,28),(154,58),(100,88),(46,58)],fill=(42,57,83,235),outline=(238,205,112,220))
                draw.rectangle((92,86,108,144),fill=(42,57,83,230))
            else:
                draw.rounded_rectangle((28,35,172,132),8,outline=(242,225,187,220),width=4)
                draw.line((42,154,158,154),fill=(232,195,94,210),width=5)
        else:
            person=portrait((index+2)%16,118)
            background.paste(person,(41,20),person if person.mode=='RGBA' else None)
            if kind=='rivals':
                draw.line((26,28,174,174),fill=(237,197,87,180),width=5)
                draw.line((174,28,26,174),fill=(126,202,220,150),width=5)
                draw.ellipse((82,134,118,170),fill=(31,43,65,220),outline=(240,210,120,220),width=3)
            else:
                draw.rounded_rectangle((18,18,182,176),12,outline=(249,231,190,210),width=5)
                draw.ellipse((22,22,62,62),fill=(246,190,204,120))
                draw.ellipse((138,22,178,62),fill=(139,201,218,110))
        for shade in range(45):
            draw.rectangle((0,155+shade,200,155+shade),fill=(7,11,20,int(160*shade/45)))
        draw.rounded_rectangle((2,2,197,197),radius=10,outline=(*COLORS[index],150),width=2)
        atlas.paste(background,((index%4)*200,(index//4)*200))
    return atlas


story_atlas('events').save(OUT/'events.webp','WEBP',quality=91,method=6)
story_atlas('rivals').save(OUT/'rivals.webp','WEBP',quality=91,method=6)
story_atlas('memories').save(OUT/'memories.webp','WEBP',quality=91,method=6)

manifest_path=OUT/'manifest.json'
manifest=json.loads(manifest_path.read_text())
manifest['version']='1.10.0'
manifest['source']='original commercial anime artwork with dedicated district, walkable-location, event, rival and memory assets'
manifest['proceduralFallbacks']=False
manifest['externalRuntimeDependency']=False
for name in ['keyart.webp','campus.webp','characters.webp','portraits.webp','objects.webp','district-map.webp','world-locations.webp','events.webp','rivals.webp','memories.webp']:
    path=OUT/name
    image=Image.open(path)
    data=path.read_bytes()
    manifest.setdefault('assets',{})[name]={'width':image.width,'height':image.height,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({name:manifest['assets'][name] for name in ['district-map.webp','world-locations.webp','events.webp','rivals.webp','memories.webp']},indent=2))
