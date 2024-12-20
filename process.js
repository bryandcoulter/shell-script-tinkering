const { exec } = require('child_process');

exec('cp -r silverlake-customer-poc test && node name-replace.js && node file-content.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});