/**
 * Created by admin on 2017/3/27.
 */
const exec = require('child_process').exec
const pkg = require('./package.json')
const fs = require('fs')
const path = require('path')

for (let k in pkg.dependencies) {
  let WorkPath = path.join(__dirname, 'node_modules', k)
  fs.exists(path.join(WorkPath, 'binding.gyp'), (Has) => {
    if (Has) {
      let CMDStr = 'nw-gyp rebuild --target=' + pkg.devDependencies.nw
      exec(CMDStr, {cwd: WorkPath}, (err, stdout, stderr) => {
        if (err) {
          console.log('get weather api error:' + stderr)
        } else {
          console.log(k + '\t rebuild')
          if (k === 'java') {
            exec('node postInstall', {cwd: WorkPath}, (err, stdout, stderr) => {
              if (err) {
                console.log('get weather api error:' + stderr)
              } else {
                console.log(k + '\t rebuild over')
              }
            })
          }
        }
      })
    }
  })
}