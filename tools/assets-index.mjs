// Rebuild assets/img/people/index.json from the files present. Run after dropping generated assets in.
import { readdirSync, writeFileSync } from 'node:fs';
const dir = 'assets/img/people';
const files = readdirSync(dir).filter(f => /\.(jpe?g|png|webp|mp4|webm)$/i.test(f)).sort();
writeFileSync(`${dir}/index.json`, JSON.stringify(files, null, 2) + '\n');
console.log(`${files.length} assets indexed:`, files.join(', ') || '(none)');
