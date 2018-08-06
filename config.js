module.exports = {
    // 环境名称
    env: 'dev',
    // 服务端口号
    port: 4444,
    // 要输出的图片的规格参数
    size: [{            
      output: 'demo2',
      scale: 2,
      nameFormat: ''
    }, {
      output: 'demo1',
      scale: 1.5,
      nameFormat: '@2x'
    }, {
      output: 'demo0',
      scale: 1,
      nameFormat: '@3x'
    }]
  }
  