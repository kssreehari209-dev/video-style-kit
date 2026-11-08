# Clips Natural Earth land (world-atlas land-10m.json, public domain) to each map's frame and writes src/mapdata.json.
# Usage: python tools/make_maps.py <path to land-10m.json>
import json, math, sys
topo = json.load(open(sys.argv[1], encoding="utf8"))
sc, tr = topo["transform"]["scale"], topo["transform"]["translate"]
arcs = []
for a in topo["arcs"]:
    x = y = 0; pts = []
    for dx, dy in a:
        x += dx; y += dy
        pts.append((x * sc[0] + tr[0], y * sc[1] + tr[1]))
    arcs.append(pts)
def ring(idx):
    out = []
    for i in idx:
        seg = arcs[i] if i >= 0 else arcs[~i][::-1]
        out += seg[1:] if out else seg
    return out
rings = []
for g in topo["objects"]["land"]["geometries"]:
    polys = g["arcs"] if g["type"] == "MultiPolygon" else [g["arcs"]]
    for p in polys:
        rings += [ring(r) for r in p]

merc = lambda lat: math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))

def clip(poly, inside, cross):
    out = []
    for i, p in enumerate(poly):
        q = poly[i - 1]
        if inside(p):
            if not inside(q): out.append(cross(q, p))
            out.append(p)
        elif inside(q):
            out.append(cross(q, p))
    return out

def sh(poly, x0, y0, x1, y1):
    def ix(v):
        return lambda a, b: (v, a[1] + (b[1] - a[1]) * (v - a[0]) / (b[0] - a[0]))
    def iy(v):
        return lambda a, b: (a[0] + (b[0] - a[0]) * (v - a[1]) / (b[1] - a[1]), v)
    for ins, cr in ((lambda p: p[0] >= x0, ix(x0)), (lambda p: p[0] <= x1, ix(x1)), (lambda p: p[1] >= y0, iy(y0)), (lambda p: p[1] <= y1, iy(y1))):
        if not poly: return poly
        poly = clip(poly, ins, cr)
    return poly

def simplify(pts, eps):
    # Drops points closer than eps to the last kept one; enough at these zooms.
    out = [pts[0]]
    for p in pts[1:]:
        if abs(p[0] - out[-1][0]) + abs(p[1] - out[-1][1]) >= eps: out.append(p)
    return out

MAPS = {
    # name: west lon, east lon, center lat. The frame is 1920 x 1080 in Mercator.
    "arabian": (47.0, 83.0, 15.0),
    "capecod": (-73.2, -67.2, 42.0),
    "magellan": (-76.0, -66.0, -53.0),
    "newhampshire": (-72.6, -68.6, 43.0),
    "sydney": (149.6, 153.6, -33.9),
    "ningaloo": (106.0, 126.0, -23.0),
    "cook": (-166.0, -154.0, -21.0),
    "pacific": (138.0, 228.0, -20.0),
}
res = {}
for name, (w, e, clat) in MAPS.items():
    k = 1920 / (e - w)
    cy = merc(clat)
    proj = lambda lon, lat: ((lon - w) * k, 540 - (merc(max(-85, min(85, lat))) - cy) * k)
    d = []
    # Maps that run past 180 E also need the western-hemisphere land moved 360 degrees east.
    pool = rings + ([[(p[0] + 360, p[1]) for p in r] for r in rings if max(p[0] for p in r) <= 0] if e > 180 else [])
    for r in pool:
        lons = [p[0] for p in r]
        if max(lons) < w - 1 or min(lons) > e + 1: continue
        pr = [proj(*p) for p in r]
        c = sh(pr, -60, -60, 1980, 1140)
        if len(c) < 3: continue
        c = simplify(c, 0.7)
        if len(c) < 3: continue
        d.append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in c) + "Z")
    res[name] = {"west": w, "east": e, "clat": clat, "d": "".join(d)}
    print(name, len(d), "shapes", len(res[name]["d"]) // 1024, "KB")
json.dump(res, open("src/mapdata.json", "w"))
