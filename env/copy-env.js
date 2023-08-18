const fs = require('fs');
var path = require('path');

const exportEnv = (env) =>{
    const fileName = `./env/.${env.replace("''", '')}.env`
    fs.copyFileSync(fileName, ".env")
}

module.exports = exportEnv;