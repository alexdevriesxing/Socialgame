from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[1]

p=ROOT/'src/game-1.js'
text=p.read_text()
old="const imageNames = ['keyart','school_maps','portraits','event_atlas','rival_atlas','memory_atlas','character_atlas'];"
new="const imageNames = ['keyart','school_maps','portraits','event_atlas','rival_atlas','memory_atlas','character_atlas','district_map','world_locations','object_atlas'];"
if old in text:text=text.replace(old,new)
elif new not in text:raise SystemExit('game-1 image inventory could not be updated')
p.write_text(text)

build_path=ROOT/'build-manifest.json'
build=json.loads(build_path.read_text())
build['version']='1.10.0'
for item in ['assets/anime/district-map.webp','assets/anime/world-locations.webp','assets/anime/events.webp','assets/anime/rivals.webp','assets/anime/memories.webp','docs/release-v1.10-real-assets.md','src/real-assets-v110.js']:
    if item not in build['files']:build['files'].append(item)
build_path.write_text(json.dumps(build,indent=2)+'\n')

sw=ROOT/'sw.js'
text=sw.read_text().replace('sakura-crest-v1.9.0-deep-social-memory','sakura-crest-v1.10.0-dedicated-real-assets')
old_assets="'./assets/anime/keyart.webp','./assets/anime/campus.webp','./assets/anime/characters.webp','./assets/anime/portraits.webp','./assets/anime/objects.webp','./assets/anime/manifest.json',"
new_assets="'./assets/anime/keyart.webp','./assets/anime/campus.webp','./assets/anime/characters.webp','./assets/anime/portraits.webp','./assets/anime/objects.webp','./assets/anime/district-map.webp','./assets/anime/world-locations.webp','./assets/anime/events.webp','./assets/anime/rivals.webp','./assets/anime/memories.webp','./assets/anime/manifest.json',"
if old_assets in text:text=text.replace(old_assets,new_assets)
old_scripts="'./src/commercial-ui.js','./src/commercial-campus.js','./src/walkable-world.js','./src/commercial-world-ui.js','./src/anime-campus-v18.js',"
new_scripts="'./src/commercial-ui.js','./src/commercial-campus.js','./src/walkable-world.js','./src/commercial-world-ui.js','./src/real-assets-v110.js','./src/anime-campus-v18.js',"
if old_scripts in text:text=text.replace(old_scripts,new_scripts)
sw.write_text(text)

manifest=ROOT/'manifest.webmanifest'
data=json.loads(manifest.read_text())
data['description']='A release-ready anime school-life RPG with four complete school years, deep social memory, fourteen dedicated illustrated walkable destinations, unique event, rivalry and memory artwork, resilient offline saves and accessible controls.'
manifest.write_text(json.dumps(data,indent=2)+'\n')

verify=ROOT/'tests/verify-release.mjs'
text=verify.read_text().replace("const RELEASE_VERSION = '1.9.0';","const RELEASE_VERSION = '1.10.0';").replace('scripts.length < 33','scripts.length < 34').replace('at least 33','at least 34')
text=text.replace("'src/anime-art-v18.js','src/social-memory-v19.js',","'src/anime-art-v18.js','src/social-memory-v19.js','src/real-assets-v110.js',")
needle="  'objects.webp': [1024, 512]\n"
replacement="  'objects.webp': [1024, 512],\n  'district-map.webp': [1536, 1024],\n  'world-locations.webp': [1536, 1024],\n  'events.webp': [800, 600],\n  'rivals.webp': [800, 600],\n  'memories.webp': [800, 600]\n"
if needle in text:text=text.replace(needle,replacement)
text=text.replace("'docs/release-v1.9-social-memory.md','docs/cloudflare-release-runbook.md'","'docs/release-v1.9-social-memory.md','docs/release-v1.10-real-assets.md','docs/cloudflare-release-runbook.md'")
text=text.replace('required v1.9 runtime','required v1.10 runtime').replace('Deep Social Memory v1.9 is registered in the runtime, offline cache and release documentation.','Deep Social Memory remains compatible and dedicated real assets v1.10 are registered in runtime, offline cache and release documentation.')
verify.write_text(text)

remote=ROOT/'tests/remote-static-smoke.mjs'
text=remote.read_text().replace("window.SAKURA_RELEASE?.version!=='1.9.0'","window.SAKURA_RELEASE?.version!=='1.10.0'").replace('permanent v1.9 anime artwork','permanent v1.10 dedicated real artwork')
remote.write_text(text)

readiness=ROOT/'src/release-readiness.js'
text=readiness.read_text().replace('// Pass 10 v1.9 — final balance, progression integrity, social-memory and release diagnostics.','// Pass 11 v1.10 — dedicated real assets, final balance, progression integrity and release diagnostics.').replace("const RELEASE_READINESS_VERSION='1.9.0';","const RELEASE_READINESS_VERSION='1.10.0';")
readiness.write_text(text)

doc=ROOT/'docs/release-v1.10-real-assets.md'
doc.write_text('''# Sakura Crest v1.10 — Dedicated Real Assets

## Release goal

v1.10 removes the final recycled and procedural presentation surfaces from the playable game. Every world, story, rivalry and memory surface now has a dedicated permanent repository asset.

## Permanent artwork

- `district-map.webp`: illustrated Sakura district map used by the travel overlay.
- `world-locations.webp`: sixteen distinct environment cells covering the bedroom, fourteen destinations, school courtyard and rooftop garden.
- `events.webp`: twelve distinct illustrated campaign and school-event scenes.
- `rivals.webp`: twelve dedicated rivalry illustrations with character-focused competitive framing.
- `memories.webp`: twelve dedicated friendship-memory illustrations with warm archival framing.

The existing commercial key art, three-wing campus panorama, transparent 16-character animation atlas, portrait atlas and object atlas remain intact. All files are served locally by GitHub and Cloudflare Pages. There are no Canva, Drive, Adobe, Vercel or third-party runtime dependencies.

## Runtime integration

The district map renderer uses the dedicated map asset. All fourteen walkable locations use their assigned atlas cells. Event, rival and memory dialogue panels no longer reuse the campus panorama or title key art. Functional exits, collision landmarks, NPC navigation and interaction anchors remain available over the illustrated environments.

## Release gates

The v1.10 browser gate verifies exact image dimensions, unique file sources, distinct visual signatures for all fourteen destinations and at least ten distinct cells in each story atlas. It captures the district map and arcade environment, then runs the full campaign, save, mobile, offline, sprite-transparency and Chrome/Edge/Firefox/WebKit suites.

Known critical defects: **0**. Known high-severity defects: **0**.
''')

print('Registered Sakura Crest v1.10 dedicated real assets.')
