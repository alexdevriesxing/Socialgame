from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math, random

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'
ASSETS.mkdir(parents=True, exist_ok=True)

# Cohesive 16-bit-inspired palette
PAL = {
    'ink':'#1c1d2b','deep':'#2b2d42','navy':'#324a66','blue':'#4d76a8','sky':'#87c9d8',
    'cream':'#f4e9d8','paper':'#fff6e7','pink':'#e88ea4','rose':'#c75b7a','red':'#b8424b',
    'gold':'#e5b84b','orange':'#d47a43','green':'#4d8b68','mint':'#83b98b','grass':'#5f9d63',
    'wood':'#9a6548','wood2':'#6f4738','stone':'#7b8496','white':'#f8f7f4','black':'#11131e'
}

def px(draw, box, fill, outline=None, w=1):
    draw.rectangle(box, fill=fill, outline=outline, width=w)

def dither(draw, box, a, b, step=4):
    x0,y0,x1,y1=box
    draw.rectangle(box, fill=a)
    for y in range(y0,y1+1,step):
        for x in range(x0,y1+1,step):
            if ((x//step)+(y//step))%2==0:
                draw.rectangle((x,y,x+1,y+1), fill=b)

CHARACTERS = [
    ('player_boy','#2f466b','#5a382d','#f0c7a5','#dce7f2','#40597a'),
    ('player_girl','#7c3f68','#5b2e3e','#f1c8aa','#e7eff7','#536b8d'),
    ('aiko','#6b304e','#2e2431','#edc09e','#f2edf1','#5b6f91'),
    ('mina','#c05b3e','#592e24','#dba37f','#f0f3f7','#526f8e'),
    ('rina','#9a5c91','#493146','#f2c9aa','#e9edf4','#4f6482'),
    ('emi','#3c6f82','#263846','#d7a47c','#e6eef3','#495f7e'),
    ('hana','#d18a46','#6a442b','#f0c5a2','#f5eee7','#597292'),
    ('ren','#3e5b7a','#34281f','#d6a179','#eaf0f4','#465f7e'),
    ('haru','#5d3f7a','#2c2438','#edbd9a','#eff2f5','#4d6483'),
    ('daichi','#b45d43','#4f342a','#e3b28e','#eef2f5','#506884'),
    ('kenji','#467161','#293b35','#dfaa84','#edf1f4','#4a6280'),
    ('sora','#4e668e','#252b3a','#efc19e','#eaf0f5','#4d6382'),
    ('teacher_hayashi','#9a4f60','#403039','#efc4a5','#e9d8bd','#6b4d45'),
    ('teacher_mori','#475d73','#2b2a2a','#d5a27d','#e6dccd','#534a45'),
    ('teacher_arai','#7c5b8c','#493548','#edc0a0','#eadcc8','#614f55'),
    ('coach_kondo','#4f7650','#30261f','#d8a47c','#e2e6d9','#445c45'),
]

def draw_sprite_sheet(name, hair, hair_dark, skin, shirt, bottoms):
    fw, fh = 24, 32
    sheet = Image.new('RGBA',(fw*3,fh*4),(0,0,0,0))
    for row, direction in enumerate(['down','left','right','up']):
        for col in range(3):
            d=ImageDraw.Draw(sheet)
            ox,oy=col*fw,row*fh
            bob = 1 if col==1 else 0
            # shadow
            d.ellipse((ox+5,oy+27,ox+19,oy+31), fill=(20,20,30,90))
            # legs
            legshift = [-1,0,1][col]
            if direction in ('left','right'):
                d.rectangle((ox+8+legshift,oy+22+bob,ox+11+legshift,oy+28+bob),fill=bottoms)
                d.rectangle((ox+13-legshift,oy+22+bob,ox+16-legshift,oy+28+bob),fill=bottoms)
            else:
                d.rectangle((ox+7+legshift,oy+22+bob,ox+10+legshift,oy+28+bob),fill=bottoms)
                d.rectangle((ox+14-legshift,oy+22+bob,ox+17-legshift,oy+28+bob),fill=bottoms)
            # shoes
            d.rectangle((ox+6+legshift,oy+28+bob,ox+11+legshift,oy+29+bob),fill=PAL['ink'])
            d.rectangle((ox+13-legshift,oy+28+bob,ox+18-legshift,oy+29+bob),fill=PAL['ink'])
            # body uniform
            d.rectangle((ox+6,oy+13+bob,ox+18,oy+23+bob),fill=shirt)
            d.rectangle((ox+7,oy+15+bob,ox+17,oy+17+bob),fill='#d0d9e2')
            d.polygon([(ox+10,oy+15+bob),(ox+14,oy+15+bob),(ox+12,oy+20+bob)],fill=hair)
            # arms
            arm = 1 if col==1 else 0
            d.rectangle((ox+4,oy+14+bob+arm,ox+6,oy+22+bob+arm),fill=skin)
            d.rectangle((ox+18,oy+14+bob-arm,ox+20,oy+22+bob-arm),fill=skin)
            # neck/head
            d.rectangle((ox+10,oy+10+bob,ox+14,oy+14+bob),fill=skin)
            d.rectangle((ox+7,oy+3+bob,ox+17,oy+13+bob),fill=skin)
            # hair silhouette varies by direction
            if direction=='up':
                d.rectangle((ox+6,oy+2+bob,ox+18,oy+10+bob),fill=hair)
                d.rectangle((ox+7,oy+10+bob,ox+17,oy+12+bob),fill=hair_dark)
            else:
                d.rectangle((ox+6,oy+1+bob,ox+18,oy+6+bob),fill=hair)
                d.rectangle((ox+6,oy+5+bob,ox+8,oy+10+bob),fill=hair_dark)
                d.rectangle((ox+16,oy+5+bob,ox+18,oy+10+bob),fill=hair_dark)
                # fringe
                d.rectangle((ox+8,oy+5+bob,ox+11,oy+7+bob),fill=hair)
                d.rectangle((ox+13,oy+5+bob,ox+16,oy+8+bob),fill=hair)
                if direction=='down':
                    d.rectangle((ox+9,oy+8+bob,ox+10,oy+9+bob),fill=PAL['ink'])
                    d.rectangle((ox+14,oy+8+bob,ox+15,oy+9+bob),fill=PAL['ink'])
                    d.point((ox+12,oy+11+bob),fill=PAL['rose'])
            # outline accents
            d.line((ox+6,oy+13+bob,ox+6,oy+23+bob),fill=PAL['deep'])
            d.line((ox+18,oy+13+bob,ox+18,oy+23+bob),fill=PAL['deep'])
    sheet.save(ASSETS/f'{name}.png')

for c in CHARACTERS:
    draw_sprite_sheet(*c)

# Portrait atlas 4x4, 64x64 cells
atlas = Image.new('RGBA',(256,256),(0,0,0,0))
for idx,(name,hair,hair_dark,skin,shirt,bottoms) in enumerate(CHARACTERS):
    cell=Image.new('RGBA',(64,64),(0,0,0,0)); d=ImageDraw.Draw(cell)
    # background emblem
    d.rounded_rectangle((2,2,61,61),8,fill=PAL['paper'],outline=PAL['deep'],width=2)
    d.rectangle((5,41,58,58),fill=shirt)
    d.rectangle((20,31,44,45),fill=skin)
    d.ellipse((15,9,49,43),fill=skin)
    d.pieslice((13,5,51,39),180,360,fill=hair)
    d.rectangle((13,20,18,38),fill=hair_dark)
    d.rectangle((46,20,51,38),fill=hair_dark)
    d.polygon([(18,16),(28,8),(27,24)],fill=hair)
    d.polygon([(29,8),(43,12),(35,25)],fill=hair)
    d.rectangle((23,26,26,28),fill=PAL['ink'])
    d.rectangle((38,26,41,28),fill=PAL['ink'])
    d.rectangle((31,34,34,35),fill=PAL['rose'])
    d.rectangle((27,43,37,54),fill=hair)
    x=(idx%4)*64;y=(idx//4)*64
    atlas.alpha_composite(cell,(x,y))
atlas.save(ASSETS/'portraits.png')

# Pixel school map
W,H=1280,800
m=Image.new('RGB',(W,H),PAL['ink']); d=ImageDraw.Draw(m)
# Outer ground
for y in range(H):
    c = '#93c7b5' if y>390 else '#8094a7'
    d.line((0,y,W,y),fill=c)
# building rooms and hallway
def room(box, floor, wall='#374252', inner='#f5ead7'):
    x0,y0,x1,y1=box
    d.rectangle(box,fill=wall)
    d.rectangle((x0+8,y0+8,x1-8,y1-8),fill=inner)
    # floor grid
    for yy in range(y0+12,y1-8,16): d.line((x0+8,yy,x1-8,yy),fill=floor)
    for xx in range(x0+12,x1-8,16): d.line((xx,y0+8,xx,y1-8),fill=floor)

room((30,30,370,260),'#e0d0b8')
room((395,30,735,260),'#d9c8b1')
room((760,30,1100,260),'#e3d5bd')
room((1125,30,1250,260),'#d2c2aa')
# hallway
room((30,280,1250,390),'#aab4bf',wall='#303a48',inner='#c8d0d7')
# courtyard/cafe/gym lower
room((30,420,400,770),'#6cae72',wall='#405b4a',inner='#79b979')
room((425,420,780,770),'#d7b995',wall='#5c433a',inner='#efd8b8')
room((805,420,1250,770),'#c59a69',wall='#4a3b36',inner='#d8b383')

# doors openings in upper rooms and hall
for x in [170,535,900,1175]:
    d.rectangle((x-20,252,x+20,288),fill='#c8d0d7')
    d.rectangle((x-16,252,x+16,264),fill='#8a6248')
# Lower doors
for x in [210,600,1020]:
    d.rectangle((x-24,382,x+24,428),fill='#93c7b5' if x==210 else '#c8d0d7')
    d.rectangle((x-18,382,x+18,400),fill='#8a6248')

# Classroom details
def desk(x,y):
    d.rectangle((x,y,x+34,y+18),fill=PAL['wood2'])
    d.rectangle((x+2,y+2,x+32,y+14),fill=PAL['wood'])
    d.rectangle((x+5,y+18,x+10,y+24),fill=PAL['deep'])
    d.rectangle((x+24,y+18,x+29,y+24),fill=PAL['deep'])
for base in [40,405,770]:
    for yy in [90,140,190]:
        for xx in [base+40,base+115,base+190,base+265]: desk(xx,yy)
    d.rectangle((base+80,45,base+260,64),fill='#315c4a')
    d.rectangle((base+84,49,base+256,60),fill='#4a8067')
# labels
# library/archive room
for yy in range(55,240,34):
    d.rectangle((1140,yy,1235,yy+18),fill=PAL['wood2'])
    for xx in range(1145,1230,10):
        d.rectangle((xx,yy+2,xx+6,yy+15),fill=random.choice([PAL['red'],PAL['blue'],PAL['gold'],PAL['green']]))
# Hall lockers
for xx in range(50,1230,42):
    d.rectangle((xx,300,xx+30,360),fill='#55718a',outline=PAL['deep'])
    d.line((xx+4,315,xx+26,315),fill='#8195a7')
    d.point((xx+24,337),fill=PAL['gold'])
# Courtyard
# paths
for off in range(-10,11):
    d.line((210+off,430,210+off,760),fill='#c7b69a')
    d.line((45,590+off,390,590+off),fill='#c7b69a')
# fountain
for r,c in [(44,'#536d86'),(36,'#87c9d8'),(22,'#d6eef0')]:
    d.ellipse((210-r,590-r,210+r,590+r),fill=c)
d.rectangle((205,545,215,585),fill='#d5d0c4')
d.polygon([(210,530),(198,552),(222,552)],fill='#e6dfd2')
# trees
for x,y in [(80,470),(330,480),(75,690),(340,690)]:
    d.rectangle((x-4,y+15,x+4,y+42),fill=PAL['wood2'])
    for dx,dy,r in [(-12,5,16),(10,3,18),(0,-8,19)]:
        d.ellipse((x+dx-r,y+dy-r,x+dx+r,y+dy+r),fill='#4f8f58')
        d.rectangle((x+dx-3,y+dy-3,x+dx+3,y+dy+3),fill='#78b66d')
# Cafeteria tables
for y in [480,570,660]:
    for x in [470,610,715]:
        d.rectangle((x,y,x+60,y+25),fill=PAL['wood2'])
        d.rectangle((x+4,y+4,x+56,y+21),fill='#c98f5f')
        d.rectangle((x-8,y+5,x-1,y+20),fill=PAL['navy'])
        d.rectangle((x+61,y+5,x+68,y+20),fill=PAL['navy'])
# counter
for x in range(450,760,32):
    d.rectangle((x,438,x+28,460),fill='#8e5f4c',outline=PAL['deep'])
# Gym court
# wood stripes
for x in range(815,1245,24): d.rectangle((x,430,x+12,760),fill='#d0a675')
d.rectangle((835,450,1220,740),outline=PAL['white'],width=4)
d.line((1027,450,1027,740),fill=PAL['white'],width=3)
d.ellipse((977,545,1077,645),outline=PAL['white'],width=3)
# hoops
for x in [850,1205]:
    d.rectangle((x-10,570,x+10,610),outline=PAL['red'],width=3)
# signs
for x,label,color in [(90,'1-A',PAL['blue']),(455,'MATH',PAL['gold']),(815,'LIT',PAL['rose']),(1138,'LIB',PAL['green']),
                      (80,'COURT',PAL['green']),(485,'CAFE',PAL['orange']),(900,'GYM',PAL['red'])]:
    y=40 if x>400 and x<1120 else (40 if x>=1120 else (40 if x<400 and label=='1-A' else 430))
    d.rectangle((x,y,x+72,y+18),fill=color,outline=PAL['ink'])
# posters and bulletin board
for x in [360,710,1060]:
    d.rectangle((x,316,x+26,346),fill=random.choice([PAL['pink'],PAL['gold'],PAL['mint']]),outline=PAL['ink'])
d.rectangle((560,292,720,370),fill=PAL['wood2'],outline=PAL['ink'],width=3)
d.rectangle((567,299,713,363),fill='#d8c49f')
for i in range(8):
    x=575+(i%4)*34;y=307+(i//4)*25
    d.rectangle((x,y,x+24,y+16),fill=random.choice([PAL['paper'],PAL['pink'],PAL['sky'],PAL['gold']]))
# lighting/shadows
for x in range(0,W,32):
    d.line((x,0,x,H),fill=(0,0,0),width=1)
for y in range(0,H,32):
    d.line((0,y,W,y),fill=(0,0,0),width=1)
# restore subtle alpha grid by overlay
ov=Image.new('RGBA',(W,H),(0,0,0,0)); od=ImageDraw.Draw(ov)
for x in range(0,W,32): od.line((x,0,x,H),fill=(20,25,35,18))
for y in range(0,H,32): od.line((0,y,W,y),fill=(20,25,35,18))
m=Image.alpha_composite(m.convert('RGBA'),ov)
m.save(ASSETS/'school_map.png')

# UI icons
icons=Image.new('RGBA',(256,32),(0,0,0,0));di=ImageDraw.Draw(icons)
icon_colors=[PAL['gold'],PAL['pink'],PAL['blue'],PAL['green'],PAL['red'],PAL['sky'],PAL['orange'],PAL['mint']]
for i,c in enumerate(icon_colors):
    x=i*32
    di.rounded_rectangle((x+2,2,x+29,29),5,fill=PAL['paper'],outline=PAL['deep'],width=2)
    cx=x+16;cy=16
    if i==0: # charisma star
        pts=[]
        for k in range(10):
            a=-math.pi/2+k*math.pi/5;r=10 if k%2==0 else 4
            pts.append((cx+math.cos(a)*r,cy+math.sin(a)*r))
        di.polygon(pts,fill=c,outline=PAL['deep'])
    elif i==1: di.ellipse((cx-9,cy-7,cx-1,cy+1),fill=c);di.ellipse((cx+1,cy-7,cx+9,cy+1),fill=c);di.polygon([(cx-9,cy-2),(cx+9,cy-2),(cx,cy+10)],fill=c)
    elif i==2: di.rectangle((cx-9,cy-7,cx+9,cy+7),fill=c,outline=PAL['deep']);di.line((cx,cy-7,cx,cy+7),fill=PAL['paper'])
    elif i==3: di.polygon([(cx,cy-10),(cx+9,cy-2),(cx+6,cy+10),(cx-6,cy+10),(cx-9,cy-2)],fill=c,outline=PAL['deep'])
    elif i==4: di.polygon([(cx-10,cy+6),(cx-4,cy-8),(cx+1,cy-2),(cx+5,cy-10),(cx+10,cy+6)],fill=c,outline=PAL['deep'])
    elif i==5: di.ellipse((cx-10,cy-6,cx+10,cy+6),fill=c,outline=PAL['deep']);di.ellipse((cx-4,cy-3,cx+4,cy+3),fill=PAL['paper'])
    elif i==6: di.rectangle((cx-8,cy-10,cx+8,cy+10),fill=c,outline=PAL['deep']);di.line((cx-5,cy-4,cx+5,cy-4),fill=PAL['paper']);di.line((cx-5,cy+1,cx+5,cy+1),fill=PAL['paper'])
    else: di.polygon([(cx,cy-11),(cx+10,cy),(cx,cy+11),(cx-10,cy)],fill=c,outline=PAL['deep'])
icons.save(ASSETS/'ui_icons.png')

# Key art at logical 960x540 with chunky pixel detail
K=Image.new('RGB',(960,540),'#243146'); kd=ImageDraw.Draw(K)
# sunset bands
for y in range(540):
    t=y/540
    r=int(52+(226-52)*t);g=int(70+(158-70)*t);b=int(103+(135-103)*t)
    kd.line((0,y,960,y),fill=(r,g,b))
# sun
kd.ellipse((700,55,855,210),fill='#f6d177')
# distant city
random.seed(4)
for x in range(0,960,26):
    h=random.randint(40,120)
    kd.rectangle((x,330-h,x+24,330),fill=random.choice(['#35465d','#3d5068','#465970']))
    for yy in range(330-h+8,326,14):
        if random.random()>.4: kd.rectangle((x+5,yy,x+9,yy+5),fill='#e9c96c')
# school facade
kd.rectangle((115,190,845,430),fill='#d8c7a7',outline=PAL['ink'],width=8)
kd.rectangle((310,125,650,430),fill='#e8d8b8',outline=PAL['ink'],width=8)
kd.polygon([(285,130),(480,45),(675,130)],fill='#923f50',outline=PAL['ink'])
kd.rectangle((445,300,515,430),fill='#394b62',outline=PAL['ink'],width=6)
for yy in [170,245]:
    for xx in range(145,820,85):
        kd.rectangle((xx,yy,xx+50,yy+42),fill='#78aec0',outline=PAL['ink'],width=5)
        kd.line((xx+25,yy,xx+25,yy+42),fill=PAL['paper'],width=3)
# clock
kd.ellipse((448,85,512,149),fill=PAL['paper'],outline=PAL['ink'],width=5)
kd.line((480,117,480,97),fill=PAL['ink'],width=4);kd.line((480,117,497,126),fill=PAL['ink'],width=4)
# trees/cherry blossoms
for x in [60,885]:
    kd.rectangle((x-10,300,x+10,500),fill='#684534')
    for dx,dy,r in [(-35,-10,48),(20,-20,55),(0,-65,50),(45,-60,38),(-45,-65,35)]:
        kd.ellipse((x+dx-r,300+dy-r,x+dx+r,300+dy+r),fill='#d9789a',outline='#9a4f68',width=4)
        for _ in range(12):
            pxl=x+dx+random.randint(-r//2,r//2);pyl=300+dy+random.randint(-r//2,r//2)
            kd.rectangle((pxl,pyl,pxl+5,pyl+5),fill='#f5bfd0')
# foreground student silhouettes with colored hair/uniforms
def key_char(cx,cy,scale,hair,accent):
    kd.ellipse((cx-24*scale,cy+44*scale,cx+24*scale,cy+56*scale),fill='#1b2030')
    kd.rectangle((cx-11*scale,cy+22*scale,cx-2*scale,cy+52*scale),fill='#233044')
    kd.rectangle((cx+3*scale,cy+22*scale,cx+12*scale,cy+52*scale),fill='#233044')
    kd.rectangle((cx-22*scale,cy-22*scale,cx+22*scale,cy+28*scale),fill='#e8edf2',outline=PAL['ink'],width=max(2,scale*2))
    kd.polygon([(cx-8*scale,cy-18*scale),(cx+8*scale,cy-18*scale),(cx,cy+12*scale)],fill=accent)
    kd.ellipse((cx-18*scale,cy-70*scale,cx+18*scale,cy-28*scale),fill='#efc09c',outline=PAL['ink'],width=max(2,scale*2))
    kd.pieslice((cx-22*scale,cy-78*scale,cx+22*scale,cy-30*scale),180,360,fill=hair)
    kd.rectangle((cx-22*scale,cy-58*scale,cx-15*scale,cy-34*scale),fill=hair)
    kd.rectangle((cx+15*scale,cy-58*scale,cx+22*scale,cy-34*scale),fill=hair)
key_char(355,455,2,'#493146','#c75b7a')
key_char(590,455,2,'#34281f','#4d76a8')
# title plate kept text-free for localization; game draws title itself
kd.rounded_rectangle((180,20,780,112),18,fill=(25,28,44),outline='#f2d37c',width=6)
K.save(ASSETS/'keyart.png')

# App icon generated from the central school crest/key-art crop.
icon=K.crop((352,24,608,280)).resize((128,128),Image.Resampling.NEAREST)
icon.save(ASSETS/'favicon.png')

print('Generated assets:', ', '.join(sorted(p.name for p in ASSETS.iterdir())))
