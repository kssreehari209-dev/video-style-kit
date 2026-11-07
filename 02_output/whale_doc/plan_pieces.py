import json, os, re
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Exact shot starts in frames, read from the source durations.
def durs(path):
    return [int(x) for x in re.findall(r"^    dur: (\d+),", open(path, encoding="utf8").read(), re.M)]

a = durs("src/SectionsA.tsx")
b = durs("src/SectionsB.tsx")
cuts = [0, 210, 400, 600, 840, 1050]  # section 1
for d in a + b:
    cuts.append(cuts[-1] + d)
assert cuts[-1] == 12150, cuts[-1]
print("shots", len(cuts) - 1)

LO, HI = 30 * 30, 40 * 30
best = {0: (0, 0, [0])}  # frame -> (over-limit frames, pieces, path)
for c in cuts:
    if c not in best:
        continue
    for n in cuts:
        d = n - c
        if d <= 0 or d > HI + 150 or d < LO - 150:
            continue
        over = max(0, LO - d) + max(0, d - HI)
        cand = (best[c][0] + over, best[c][1] + 1, best[c][2] + [n])
        if n not in best or cand[:2] < best[n][:2]:
            best[n] = cand
over, count, path = best[12150]
print("frames outside 30-40 s:", over, "pieces:", count)
# Clips split on the cut frame, the middle of the camera move: each clip ends mid-move
# and the next opens on the very next frame of that same move.
pieces = [[path[i], path[i + 1] - 1] for i in range(len(path) - 1)]
for i, (s, e) in enumerate(pieces, 1):
    print(i, s, e, round((e - s + 1) / 30, 2), "s", f"{s // 1800}:{(s // 30) % 60:02d}")
json.dump(pieces, open("pieces.json", "w"))
