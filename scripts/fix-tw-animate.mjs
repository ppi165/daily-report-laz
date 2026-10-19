import fs from 'node:fs';
import path from 'node:path';

const pkgPath = path.resolve(process.cwd(), 'node_modules/tw-animate-css/package.json');

if (fs.existsSync(pkgPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    if (pkg.exports?.['.'] && !pkg.exports['.'].import) {
      pkg.exports['.'].import = pkg.exports['.'].style;
      pkg.exports['.'].default = pkg.exports['.'].style;
      if (pkg.exports['./prefix']) {
        pkg.exports['./prefix'].import = pkg.exports['./prefix'].style;
        pkg.exports['./prefix'].default = pkg.exports['./prefix'].style;
      }
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
      console.log('✓ Patched tw-animate-css exports for Next.js Turbopack compatibility');
    }
  } catch (err) {
    console.warn('Warning: Could not patch tw-animate-css:', err);
  }
}
