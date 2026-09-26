// Rebuild assets/img/people/index.json from the files present. Run after dropping generated assets in.
import { readdirSync, writeFileSync } from 'node:fs';
for (const dir of ['assets/img/people', 'assets/img/textures']) {
  const files = readdirSync(dir).filter(f => /\.(jpe?g|png|webp|mp4|webm)$/i.test(f)).sort();
  writeFileSync(`${dir}/index.json`, JSON.stringify(files, null, 2) + '\n');
  console.log(`${dir}: ${files.length} indexed:`, files.join(', ') || '(none)');
}
