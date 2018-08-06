const path = require('path')
const fs = require('fs')
const Koa = require('koa')
const app = new Koa()
const config = require(`./config`)
const gm = require('gm').subClass({imageMagick: true});

app.listen(config.port)
console.log(`server listening at port ${config.port}`)
console.log(`open http://localhost:${config.port}/ to lang`)

let sizeConfig = config.size

const filePath = path.resolve('./origin/')

function fileDisplay(filePath){
  // 根据文件路径读取文件，返回文件列表  
  fs.readdir(filePath,function(err,files){  
      if(err){  
          console.warn(err)  
      }else{  
          // 遍历读取到的文件列表  
          files.forEach(function(filename){  
              // 获取当前文件的绝对路径  
              var filedir = path.join(filePath,filename);  
              // 根据文件路径获取文件信息，返回一个fs.Stats对象  
              fs.stat(filedir,function(eror,stats){
                  if(eror){  
                      console.warn('获取文件stats失败');  
                  }else{  
                      // 是文件
                      var isFile = stats.isFile();
                      // 是文件夹   
                      var isDir = stats.isDirectory(); 
                      if(isFile){  
                        createImg(filename, filedir);
                      }  
                      if(isDir){  
                        createDir(filedir);
                        // 递归，如果是文件夹，就继续遍历该文件夹下面的文件 
                        fileDisplay(filedir);
                      }  
                  }  
              })  
          });  
      }  
  });  
} 

fileDisplay(filePath)

let createDir = (filedir) => {
    let x = filedir.split('/origin')

    sizeConfig.forEach((item) => {
        let dir = `${x[0]}/output`
        let newDir = `${item.output}${x[1]}`
        let y = newDir.split('/')
        y.forEach((d) => {
            dir = `${dir}/${d}`
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
        })
    })
}

let createImg = (filename, filedir) => {
    let w = ''
    let o = filename.split('.')
    let x = filedir.split('/origin')
    let y = x[1].split(filename)[0]

    gm(filedir).size((err, size) => {
        if (!size) {
            return
        }
        w = size.width

        sizeConfig.forEach((item) => {
            if (item.nameFormat) {
                outputPath = `${x[0]}/output/${item.output}${y}${o[0]}${item.nameFormat}.${o[1]}`
            }
            else {
                outputPath = `${x[0]}/output/${item.output}${x[1]}`
            }

            gm(filedir)
            .resize(Math.floor(w/item.scale))
            .noProfile()
            .write(outputPath, (err) => {
                if (err) {
                    console.log('失败啦🙂：', err)
                }
                else {
                    console.log(outputPath)
                }
            })
        })
    })
}