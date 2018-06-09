const fs = require('fs');
const f = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';

/**
 * This patch is needed to allow the specified node types in the browser
 */
const node = {
  crypto: true,
  stream: true,
  path: true,
  os: true,
  vm: true
};

fs.readFile(f, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  const result = data.replace(/node: false/g, `node: ${JSON.stringify(node)}`);

  fs.writeFile(f, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
