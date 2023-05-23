const path = require('path');
const fs = require('fs-extra');

const sourceDir = path.join(__dirname,'netlify' ,'functions', 'pdf-gen', 'bin');
console.log(process.env['LAMBDA_TASK_ROOT'])
const destinationDir = path.join(process.env.LAMBDA_TASK_ROOT, 'src', 'bin');

fs.copySync(sourceDir, destinationDir);

console.log('Binaries moved successfully!');
