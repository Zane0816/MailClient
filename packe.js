/**
 * Created by admin on 2017/4/10.
 */
let pkg = require('./package.json')
const exec = require('child_process').exec

const fs = require('fs')
const path = require('path')
pkg.main = 'app/index.html'//修改入口文件
delete pkg['node-remote'] //移除远地址限制
pkg.window.icon = 'app/logo.png'//修改icon路径
delete  pkg.scripts //移除运行脚本
delete pkg.devDependencies//移除开发所需组件
// delete pkg.build//移除打包配置
pkg.build.nsis.installDirectory = process.env.Arch==='win32' ? '$PROGRAMFILES32\\${_APPNAME}' : '$PROGRAMFILES64\\${_APPNAME}'

fs.writeFile(path.join(__dirname, 'dist/package.json'), JSON.stringify(pkg), (err) => {//写入配置文件
  if (!err) {
    console.log('writeDone')
    InstallNodeModules()
  }
})

/**
 * 安装必要组,js件
 */
function InstallNodeModules () {
  console.log('InstallNodeModules....')
  exec('npm i', {cwd: path.join(__dirname, 'dist')}, (err, stdout, stderr) => {
    console.log(stdout)
    if (!err) {
      // RebuildNodeModules()
    }
  })
}

/**
 * 重新编译模块
 */
function RebuildNodeModules () {
  console.log('RebuildNodeModules....')
  fs.readdir(path.join(__dirname, 'dist/node_modules'), (err, paths) => {
    if (!err) {
      paths.forEach((p) => {
        let WorkPath = path.join(__dirname, 'dist/node_modules', p)
        fs.exists(path.join(WorkPath, 'binding.gyp'), (Has) => {//如果存在binding.gyp则需要编译
          if (Has) {
            exec('nw-gyp rebuild --target=0.14.7 --arch=ia32', {cwd: WorkPath}, (err, stdout, stderr) => {
              console.log(stdout)
              if (!err) {
                console.log(p + '\t rebuild')
              }
            })
          }
        })
      })
    }
  })
}
