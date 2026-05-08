"""Extract icons from osanpo-icon.zip to assets/icons/, replacing existing files."""
import sys, zipfile, unicodedata, os, shutil
sys.stdout.reconfigure(encoding='utf-8')

ZIP      = 'C:/Users/kojac/Downloads/osanpo-icon.zip'
OUT_DIR  = 'assets/icons'

os.makedirs(OUT_DIR, exist_ok=True)

z = zipfile.ZipFile(ZIP)
png_files = [f for f in z.namelist() if f.endswith('.png')]

extracted = 0
for zpath in png_files:
    base = os.path.basename(zpath)
    # Normalize to NFC
    base_nfc = unicodedata.normalize('NFC', base)
    out_path = os.path.join(OUT_DIR, base_nfc)
    with z.open(zpath) as src, open(out_path, 'wb') as dst:
        shutil.copyfileobj(src, dst)
    extracted += 1

print(f"Extracted {extracted} icons to {OUT_DIR}/")

# Verify counts
on_disk = [f for f in os.listdir(OUT_DIR) if f.endswith('.png')]
print(f"Total PNGs now in {OUT_DIR}/: {len(on_disk)}")
