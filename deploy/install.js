const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting installation...');

const installDir = path.join(__dirname);

exec('npm install --production', { cwd: installDir }, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error: ${error}`);
    fs.writeFileSync(path.join(__dirname, 'install-log.txt'), `Error: ${error}`);
    return;
  }
  
  console.log(`✅ npm install complete`);
  
  // Generate Prisma
  console.log('📦 Generating Prisma Client...');
  exec('npx prisma generate', { cwd: installDir }, (error2, stdout2, stderr2) => {
    if (error2) {
      console.error(`❌ Prisma Error: ${error2}`);
      fs.writeFileSync(path.join(__dirname, 'install-log.txt'), `Prisma Error: ${error2}`);
      return;
    }
    
    console.log('✅ Installation complete!');
    console.log('🗑️  Self-destructing in 3 seconds...');
    
    // Delete this file after running
    setTimeout(() => {
      try {
        fs.unlinkSync(path.join(__dirname, 'install.js'));
        console.log('✅ install.js deleted');
      } catch(e) {}
    }, 3000);
  });
});
