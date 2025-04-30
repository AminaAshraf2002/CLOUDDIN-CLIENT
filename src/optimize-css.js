const cssnano = require('cssnano');
const postcss = require('postcss');
const fs = require('fs');

async function optimizeCSS(cssPath) {
  const css = fs.readFileSync(cssPath, 'utf8');
  const result = await postcss([
    cssnano({
      preset: 'default'
    })
  ]).process(css, { from: cssPath });

  fs.writeFileSync(cssPath, result.css);
}

// Example usage
optimizeCSS('src/styles.css');