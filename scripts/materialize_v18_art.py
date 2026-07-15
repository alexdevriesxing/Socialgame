from PIL import Image, ImageStat
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen
from io import BytesIO
import hashlib
import json

RESPONSE_DAY = "Wed, 15 Jul 2026 "


def s3_url(tail, design, stamp, expires, signature, clock):
    credential = f"AKIAQYCGKMUHXSTDDERN/{stamp[:8]}/us-east-1/s3/aws4_request"
    params = [
        ("X-Amz-Algorithm", "AWS4-HMAC-SHA256"),
        ("X-Amz-Credential", credential),
        ("X-Amz-Date", stamp),
        ("X-Amz-Expires", expires),
        ("X-Amz-Signature", signature),
        ("X-Amz-SignedHeaders", "host"),
        ("response-expires", RESPONSE_DAY + clock + " GMT"),
    ]
    query = "&".join(f"{quote(k, safe='')}={quote(v, safe='')}" for k, v in params)
    return f"https://s3.amazonaws.com/document-export.canva.com/{tail}/{design}/1/thumbnail/0001.png?{query}"


def media_url(spec):
    (
        name,
        media_hash,
        media_height,
        media_width,
        design,
        csig,
        media_exp,
        osig,
        tail,
        stamp,
        s3_expires,
        s3_signature,
        clock,
    ) = spec
    fallback = s3_url(tail, design, stamp, s3_expires, s3_signature, clock)
    params = [
        ("brand", "BAGB1PhMIKI"),
        ("csig", csig),
        ("disableexport", "T"),
        ("exp", media_exp),
        ("fallback", fallback),
        ("osig", osig),
        ("page", "1"),
        ("signed", "brand,disableexport,fallback,page,version"),
        ("signer", "document-rpc"),
        ("version", "1"),
    ]
    query = "&".join(f"{quote(k, safe='')}={quote(v, safe='')}" for k, v in params)
    return (
        name,
        f"https://media.canva.com/v2/document-image/hash:{media_hash}/height:{media_height}/"
        f"id:{design}/type:B/width:{media_width}?{query}",
    )


def fetch(spec):
    name, url = media_url(spec)
    request = Request(url, headers={"User-Agent": "Sakura-Crest-GitHub-Asset-Builder/1.8"})
    with urlopen(request, timeout=90) as response:
        data = response.read()
    image = Image.open(BytesIO(data)).convert("RGBA")
    variance = sum(ImageStat.Stat(image.convert("RGB")).var)
    if variance < 50:
        raise RuntimeError(f"{name}: insufficient visual variance ({variance})")
    print(name, image.size, len(data), round(variance, 2))
    return image


CAMPUS = [
    ("campus-00", "1170641146", 473, 421, "DAHPet35Uak", "AAAAAAAAAAAAAAAAAAAAABNEcuc48bvqrKw5vWSrXWgELo5w971riKirgD1EbfLe", "1784144563", "AAAAAAAAAAAAAAAAAAAAAKYHxcGqckWJ0fmk8C7NGdteFXEq7WAY2LajnJRVWylN", "35Uak", "20260714T202917Z", "83606", "4d79c09bcbc801ccdfd2e76a1fee57ca7e90c8be216d5db28778423ccce74d93", "19:42:43"),
    ("campus-01", "648118278", 473, 421, "DAHPerAOpEY", "AAAAAAAAAAAAAAAAAAAAAPaYG4HRlrcrbjFBRxs6byNGcYViofOHsfbhLV3gcwA2", "1784144616", "AAAAAAAAAAAAAAAAAAAAAMC-pXfeXTSMPVpbX9Qath3Ppp3YrxJPrP6ZsJkgMJF4", "AOpEY", "20260714T231745Z", "73551", "a1937762c7a2905aebe63fe506ecabb3757d7d42725867f455d05c69f24d915f", "19:43:36"),
    ("campus-02", "1346884943", 473, 421, "DAHPev8qArA", "AAAAAAAAAAAAAAAAAAAAAKsnR6ZRmWqZ85MlyLLRciES3GVcZdg0VKz3bG95cfC7", "1784144653", "AAAAAAAAAAAAAAAAAAAAAHJiny7z8nHNm4EI6pjPyYFSWO73AT2cAr5NXkH2vp7T", "8qArA", "20260715T095728Z", "35205", "269d84224c005e83dc6ec1fa72212a8cff004f66c92381b9b2ae629faaff9ccf", "19:44:13"),
    ("campus-03", "-1171134058", 473, 421, "DAHPeiwqNIc", "AAAAAAAAAAAAAAAAAAAAAN1_bwPvABogMzTgczFH9ziNpJc8rSuPc6WV772PQmaf", "1784144688", "AAAAAAAAAAAAAAAAAAAAAD9moKhLXPZMjBFP9YxsB2x3Ech1BAYR3ial2Z9Z4wDA", "wqNIc", "20260715T084510Z", "39578", "3b9ae395c454387105ef3817385c79bc41e22969d8405bd5da71be8e3945fbaf", "19:44:48"),
    ("campus-04", "-2049822724", 473, 421, "DAHPeug0dOM", "AAAAAAAAAAAAAAAAAAAAAEEv4pwEURhGw3Tvn_9AuAXEwfZUEpWCgUy2fXCYLnP3", "1784144725", "AAAAAAAAAAAAAAAAAAAAACnhVNTD7F9AjQjMGbn1mUvx8zvBOiORvsODhftVcVH0", "g0dOM", "20260715T041420Z", "55865", "57a4d179e7bc553df46e292c98805960ec82895260cf42fb8f9e2b1300953dbf", "19:45:25"),
    ("campus-05", "-661946401", 473, 421, "DAHPekwsGbA", "AAAAAAAAAAAAAAAAAAAAAEGDcOlhIDJ8ywvhNpztUr717vqfHAdAVOS2Uvb9okv3", "1784144768", "AAAAAAAAAAAAAAAAAAAAAHXeXTJOVhdRVOyMftnUssckecxYIPjQSBjZhBpk090Z", "wsGbA", "20260714T224204Z", "75844", "ef2b456948fa080ffe38562900eea9f326a255e2cb093fedd9412d0fe1e55c44", "19:46:08"),
]

KEYART = [
    ("keyart-00", "-1560537190", 335, 595, "DAHPev3sEwM", "AAAAAAAAAAAAAAAAAAAAAH5WJy-06Rc9NeKf-GzAQ0VD0HFNv2e1yr91g9KTgpJc", "1784144807", "AAAAAAAAAAAAAAAAAAAAAA2QV1ynPhpDwaMM0MMSb6tTwRee9NYKsqVfKC2HxB3c", "3sEwM", "20260715T081523Z", "41484", "93dec489b31d69899669bfd00c614ca06ef30835020400353ddad32f450ac18b", "19:46:47"),
    ("keyart-01", "-202538217", 335, 595, "DAHPesiU8Y4", "AAAAAAAAAAAAAAAAAAAAAN0wh-D15AnOuC3WiN0Z8Q89es3FKuYpO1t9WcQPXwyO", "1784144856", "AAAAAAAAAAAAAAAAAAAAAEfb_KK4WPSTTuARJZtjQKC4k8FR9qgQ1ITFEsTCfX_C", "iU8Y4", "20260714T191033Z", "88623", "8919123e3eb2478bcc458962c64c9b5e6642f469c2346ff94d06d00ccbe76d4e", "19:47:36"),
    ("keyart-10", "-1968902200", 335, 595, "DAHPesIdN2g", "AAAAAAAAAAAAAAAAAAAAAE9u5qG6eGqzyNFK4u7_HRYzK0SfUmj-BHaQmh_vszQl", "1784144911", "AAAAAAAAAAAAAAAAAAAAADgO8YUYN6cHdretBnQMq22gGEhPj1daT3faRC-NWGAN", "IdN2g", "20260715T133645Z", "22306", "84616b8c90f610e3298863df648d64f9ea66fbca3731f0c10e79818ba8a7d7de", "19:48:31"),
    ("keyart-11", "1020098306", 335, 595, "DAHPetLEbFE", "AAAAAAAAAAAAAAAAAAAAABpyz7VV-7qDLg66Hqd7ZXXoWnxssf4uUllVGF3axvmh", "1784144981", "AAAAAAAAAAAAAAAAAAAAAA6sxez_xcHOLA8bT4fZppBMSs0PuuccFFbtlccsDBX-", "LEbFE", "20260715T064550Z", "47031", "0779d078bc6bfeb51d9564fe353d776ccd270058964e3facbc0563bbe8aed450", "19:49:41"),
]

CHARACTERS = [
    ("character-00", "748250787", 344, 580, "DAHPeopgdsE", "AAAAAAAAAAAAAAAAAAAAAOLvihzbAQ1xBt4afjLtmV1zcJeva4YgrMxda0GhxtLc", "1784145029", "AAAAAAAAAAAAAAAAAAAAAM_ZryWRIEKajC_QgYqTWaEHJhYsTR_kLFZwDR0C8J7u", "pgdsE", "20260714T204216Z", "83293", "404f64f430e132ea7814290fb4b9d0608a77cd46d9447e57d678ae509c81cc59", "19:50:29"),
    ("character-01", "-2010786087", 344, 580, "DAHPep2sc3U", "AAAAAAAAAAAAAAAAAAAAAIz5pxdoHfCmbiABiBVInfonr5oLeDPnJFrog--1HdK9", "1784145072", "AAAAAAAAAAAAAAAAAAAAAI_pO-KdDkC4PMU8xEpYqNitDPmnOXPu0PTEaEQTImVw", "2sc3U", "20260714T224145Z", "76167", "1788880730bedf35339ac2c6f9f33595e4669a3f92e51da6e2da4da6d1aa8d64", "19:51:12"),
    ("character-02", "-1168037741", 344, 580, "DAHPegObO_U", "AAAAAAAAAAAAAAAAAAAAAGs2Gwu8pBRb2FoYLYF4aqMIVZlNh9WSJDrQwubxwZ1j", "1784145119", "AAAAAAAAAAAAAAAAAAAAAG8t8uBPW2wDGrePex2wGGEOwX8-BcliZkjZESKgyxLo", "ObO_U", "20260715T181223Z", "5976", "035396049f1a3d49a8be15fa1a34ee0694088f73408bd148b28b69c5dae5b6e9", "19:51:59"),
    ("character-03", "1592427590", 344, 580, "DAHPerjSDJQ", "AAAAAAAAAAAAAAAAAAAAAMBpcyAkMZC-LP2EINMmzVxBcS8sL5eao6rOqCsLdEnc", "1784145157", "AAAAAAAAAAAAAAAAAAAAAKOAKIZq-jN-riIde4_MVVibeYTvrCqBG48gzSxRGvWq", "jSDJQ", "20260715T170148Z", "10249", "94471b559ff9328250b097f3feb6a5922f2e990da6d354385a0aeda28afdd96e", "19:52:37"),
    ("character-10", "-2050541117", 344, 580, "DAHPemrsbS8", "AAAAAAAAAAAAAAAAAAAAAFsO3Zw4Gvr4KPQbaDow-BP0MsK612-CecTbtWx3OqfN", "1784145199", "AAAAAAAAAAAAAAAAAAAAAH6Lfu-I3-nBos_Ce1DzpbNxv8oSL4jqNu_9khGSd-md", "rsbS8", "20260715T025737Z", "60942", "852683f50a5db13bf99d66a39d154d7e3fd33f080cb3d150d0b9278013bdcfa9", "19:53:19"),
    ("character-11", "-735066417", 344, 580, "DAHPeltVkTc", "AAAAAAAAAAAAAAAAAAAAAP1vAWKkHRNlIDGJoK_IUbmMtAQEZEG247XWlCq-c6E6", "1784145238", "AAAAAAAAAAAAAAAAAAAAABe8BurJO7GuYj__lDsx36x0OPGGNN4wJRjsituuLzv6", "tVkTc", "20260714T214954Z", "79444", "1004b6fefb610081a3e3d964aa6b67d00b3b3e3fbf6d0fd62ac6c219b0f7a483", "19:53:58"),
    ("character-12", "485896589", 344, 580, "DAHPesR-YLg", "AAAAAAAAAAAAAAAAAAAAAClS-cFX0dX0ujdmJvGgeQKcE7oc6W4nuwPEMD8ULCGb", "1784145273", "AAAAAAAAAAAAAAAAAAAAANiLzZfqJizfno_GkCqikHPtIKnWZsBa57tQcNmgNRsQ", "R-YLg", "20260715T114318Z", "29475", "c444120c2a9f26a56a04516ab1934e54c17e3a02aad5ae728630492dc273ff4e", "19:54:33"),
    ("character-13", "1906744792", 344, 580, "DAHPevzJo3s", "AAAAAAAAAAAAAAAAAAAAAD1Zqaj9-jlj7gsccCBSA1Xb_yMh6rarMprUU6sAbtt-", "1784145311", "AAAAAAAAAAAAAAAAAAAAANlVJyLsCWBb0_hbT98S0Bren4JEUbzxapQWNW2jsNgs", "zJo3s", "20260715T002529Z", "70182", "f082e3ff8f5f7f76b4c3f1b52fa5caa459f3bd39ab6e16db0f416fb36a5a57ff", "19:55:11"),
    ("character-20", "1999618341", 344, 580, "DAHPekJOFzk", "AAAAAAAAAAAAAAAAAAAAAEUUkGA1txo_mNmeoOehlPfIB7F0zPK7WNutR8wTcIn5", "1784145347", "AAAAAAAAAAAAAAAAAAAAADjeTLUxo00fpsYgOByKTcrI9GZxhsl1DB4cSLEkpgTi", "JOFzk", "20260714T224536Z", "76211", "8db31db1ff0b093f47a5d595d76647c0babc1b7997f81b755e0f1ef9a3cdb669", "19:55:47"),
    ("character-21", "-1107723620", 344, 580, "DAHPepHwHFU", "AAAAAAAAAAAAAAAAAAAAAOhvppsv7FSb2TDWfydCu7eplDhCGVxhjF5rYjgvh83k", "1784145392", "AAAAAAAAAAAAAAAAAAAAAJNye0uMbYh9mHp-yyEwmJfmVT2YH9AgnHkok5tO0-H", "HwHFU", "20260715T015608Z", "64824", "187d94e7a3cf8a047749d7d6dcc2cc8982c3304ae8b9dd9c74e31e2d824354a9", "19:56:32"),
    ("character-22", "-1971239352", 344, 580, "DAHPejOs_Bg", "AAAAAAAAAAAAAAAAAAAAAHSywAqxb3JHkcYiwRML5uSf8ocZ18WiYNmeYsU9f7T8", "1784145432", "AAAAAAAAAAAAAAAAAAAAALKfBDpR950AJvJUc8BeKeOESots0EDPtF7JpX_zDMBD", "Os_Bg", "20260715T002922Z", "70070", "b63f01a6994d637504558acc8a35fd4eb112eb2fe0581955825cff82d1cd721e", "19:57:12"),
    ("character-23", "1679011250", 344, 580, "DAHPehFR2yM", "AAAAAAAAAAAAAAAAAAAAAOuAQxPmrf_j-IyzlWfmPyrAsykeacYoJ4UEa91Kja-L", "1784145472", "AAAAAAAAAAAAAAAAAAAAAKeWg7UGX0iM6yd9sLx45maTunPLXO-tsw0utNlT_j9P", "FR2yM", "20260715T092329Z", "38063", "9cf05fdc76956db25810206b7071e59ae88b2b27c51e32b2ad9d4c0f873a08d7", "19:57:52"),
    ("character-30", "-886413490", 344, 580, "DAHPenpJZLg", "AAAAAAAAAAAAAAAAAAAAAAsRtiFE_zIM6avj1nTKxPCfFhYvxZZHkJYb1N87oAxR", "1784145505", "AAAAAAAAAAAAAAAAAAAAAIUn9hib0OGOLaTPM2HawSt_42_k-QAtOjsA3vdLVX5c", "pJZLg", "20260715T082751Z", "41434", "f9d08ee4d3804d01e03db0751c8d6909e602e035a39d10fb717bae3f19752c8f", "19:58:25"),
    ("character-31", "1268785156", 344, 580, "DAHPetUSKxM", "AAAAAAAAAAAAAAAAAAAAAPqj6fvRae5Ul0EY1_St9VqF7c6t0bYAvfjZu8BsmBDS", "1784145542", "AAAAAAAAAAAAAAAAAAAAACixoTu6UzNuqfvnYNwAZe6sp09iiHtJz4fEUvx56srR", "USKxM", "20260715T021432Z", "63870", "b2924128c80938f114bd0a653f223fd9492cf0151a58cb0322c1c3be463bea66", "19:59:02"),
    ("character-32", "-1620159256", 344, 580, "DAHPel6U9GM", "AAAAAAAAAAAAAAAAAAAAADRaxnnoOsr647F6xu6V4ie2qNdAkyvh9WWRRonotROc", "1784145592", "AAAAAAAAAAAAAAAAAAAAANgiJUoxI9vFJnutP5szlayAH-ZhibPjSs4GJphmmPaR", "6U9GM", "20260715T180713Z", "6759", "10178b7ab7123aa203091e7346a437b1c23b6b637235b2123d94a1b975c05e64", "19:59:52"),
    ("character-33", "-62388235", 344, 580, "DAHPe7k-hg0", "AAAAAAAAAAAAAAAAAAAAALl-E7JzyqhFbLgs8Fp4XCqxe6rFt6ankqHSQs7Xv5o_", "1784145686", "AAAAAAAAAAAAAAAAAAAAAJjO7qbmAzO8GWQofWxjq4lazoBHwIBDmTP_-b_i2fHA", "k-hg0", "20260715T062646Z", "48880", "d57d553d1acbc0e72c338a1b2a0bc876410864441349d14ca6170f33b42c6ad7", "20:01:26"),
]

OBJECTS = (
    "objects",
    "-1349043651",
    316,
    632,
    "DAHPc0zzMdQ",
    "AAAAAAAAAAAAAAAAAAAAAMySinyJe75C9Ts5ALf6XsaeZmTlOFn5vjiUVaDU-nEe",
    "1784145858",
    "AAAAAAAAAAAAAAAAAAAAAB-0aQrqPKmVd9B7o99hKzCIA3-VgfbVduVYLUTpR0Ag",
    "zzMdQ",
    "20260714T230007Z",
    "75851",
    "e2032812ebc2011825842f334236b6560894c5f31bb5fb64056fe901cad1a39d",
    "20:04:18",
)


def main():
    output = Path("assets/anime")
    output.mkdir(parents=True, exist_ok=True)

    keyart = Image.new("RGBA", (960, 540))
    for index, spec in enumerate(KEYART):
        tile = fetch(spec).resize((480, 270), Image.Resampling.LANCZOS)
        keyart.paste(tile, ((index % 2) * 480, (index // 2) * 270))

    campus = Image.new("RGBA", (4096, 768))
    for index, spec in enumerate(CAMPUS):
        tile = fetch(spec).resize((683 if index < 5 else 681, 768), Image.Resampling.LANCZOS)
        x = index * 683
        campus.paste(tile, (x, 0))

    characters = Image.new("RGBA", (1728, 1024))
    for index, spec in enumerate(CHARACTERS):
        tile = fetch(spec).resize((432, 256), Image.Resampling.LANCZOS)
        characters.paste(tile, ((index % 4) * 432, (index // 4) * 256))

    objects = fetch(OBJECTS).resize((1024, 512), Image.Resampling.LANCZOS)

    portraits = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    for index in range(16):
        sheet_x = (index % 4) * 432
        sheet_y = (index // 4) * 256
        frame = characters.crop((sheet_x + 5 * 48, sheet_y, sheet_x + 6 * 48, sheet_y + 64))
        bbox = frame.getchannel("A").getbbox()
        if bbox:
            frame = frame.crop(bbox)
        frame.thumbnail((112, 120), Image.Resampling.LANCZOS)
        cell = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
        cell.alpha_composite(frame, ((128 - frame.width) // 2, 128 - frame.height))
        portraits.alpha_composite(cell, ((index % 4) * 128, (index // 4) * 128))

    images = {
        "keyart.webp": keyart,
        "campus.webp": campus,
        "characters.webp": characters,
        "portraits.webp": portraits,
        "objects.webp": objects,
    }
    quality = {
        "keyart.webp": 90,
        "campus.webp": 90,
        "characters.webp": 90,
        "portraits.webp": 92,
        "objects.webp": 90,
    }
    manifest = {
        "version": "1.8.0",
        "source": "original generated commercial anime artwork reconstructed from authenticated lossless tiles",
        "proceduralFallbacks": False,
        "externalRuntimeDependency": False,
        "assets": {},
    }
    for name, image in images.items():
        path = output / name
        image.save(path, "WEBP", quality=quality[name], method=6)
        data = path.read_bytes()
        manifest["assets"][name] = {
            "width": image.width,
            "height": image.height,
            "bytes": len(data),
            "sha256": hashlib.sha256(data).hexdigest(),
        }
        print(name, image.size, len(data), manifest["assets"][name]["sha256"])

    (output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")


if __name__ == "__main__":
    main()
