# usage: python3 tools/crop.py screens/check-desktop.png OUTDIR [slice_height]
import sys; from PIL import Image
src, out = sys.argv[1], sys.argv[2]; h = int(sys.argv[3]) if len(sys.argv) > 3 else 1100
im = Image.open(src); W, H = im.size; i = 0; y = 0
while y < H:
    im.crop((0, y, W, min(y + h, H))).save(f"{out}/{src.split('/')[-1][:-4]}-{i:02d}.png"); y += h; i += 1
print(i, "slices", W, H)
