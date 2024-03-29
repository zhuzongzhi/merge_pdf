const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const filePath = path.resolve('./PDFFiles');

//调用文件遍历方法
fileDisplay(filePath);

function fileDisplay(filePath){
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath,function(err,files){
      if(err){
          console.warn(err)
      }else{
          //遍历读取到的文件列表
          files.forEach(function(filename){
              //获取当前文件的绝对路径
              var filedir = path.join(filePath,filename);
              //根据文件路径获取文件信息，返回一个fs.Stats对象
              fs.stat(filedir,function(eror,stats){
                  if(eror){
                      console.warn('获取文件stats失败');
                  }else{
                      var isFile = stats.isFile();//是文件
                      var isDir = stats.isDirectory();//是文件夹
                      if (isFile) {
                        console.log({filedir});

                        let newPath = filePath.replace('PDFFiles', 'MergeFiles');
                        let newFile = filedir.replace('PDFFiles', 'MergeFiles');
                        const isExist = fs.existsSync(newPath);
                        if (!isExist) {
                          mkdirsSync(newPath);
                        }

                        let shell = `pdftk ${filedir} CCVD.pdf cat output ${newFile} `;
                        child_process.exec(shell, function (err) {
                          if (err) {
                            console.log(err);      //当成功是error是null
                            return false;
                          }
                        });

                      }
                      if(isDir){
                          fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                      }
                  }
              })
          });
      }
  });
}

// 递归创建目录 同步方法
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}
