<template>
  <p class="verifyCanvs-wrap" id="verifyCanvs-box">
    <span id="verify"></span>
    <canvas width="100" height="40" id="verifyCanvas"></canvas>
    <img id="code_img" @click="changeVerifyCode" />
  </p>
</template>

<script>
export default {
  data() {
    return {
      nums: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      colors: [],
    }
  },
  mounted() {
    this.drawCode()
  },
  methods: {
    drawCode() {
      var canvas = document.getElementById('verifyCanvas') //获取HTML端画布
      var context = canvas.getContext('2d') //获取画布2D上下文
      context.fillStyle = 'cornflowerblue' //画布填充色
      context.fillRect(0, 0, canvas.width, canvas.height)
      // 创建渐变
      var gradient = context.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop('0', 'magenta')
      gradient.addColorStop('0.5', 'blue')
      gradient.addColorStop('1.0', 'red')
      //清空画布
      context.fillStyle = gradient //设置字体颜色
      context.font = '25px Arial' //设置字体
      var rand = new Array()
      var x = new Array()
      var y = new Array()
      for (var i = 0; i < 4; i++) {
        rand[i] = this.nums[Math.floor(Math.random() * this.nums.length)]
        x[i] = i * 16 + 10
        y[i] = Math.random() * 20 + 20
        context.fillText(rand[i], x[i], y[i])
      }
      let checkCode = rand.join('').toUpperCase()
      //   把得到的验证码发送出去
      this.$emit('getCheckCode', checkCode)
      //画3条随机线
      for (var i = 0; i < 3; i++) {
        this.drawline(canvas, context)
      }

      // 画30个随机点
      for (var i = 0; i < 30; i++) {
        this.drawDot(canvas, context)
      }
      this.convertCanvasToImage(canvas)
    },

    // 随机线
    drawline(canvas, context) {
      context.moveTo(
        Math.floor(Math.random() * canvas.width),
        Math.floor(Math.random() * canvas.height)
      ) //随机线的起点x坐标是画布x坐标0位置，y坐标是画布高度的随机数
      context.lineTo(
        Math.floor(Math.random() * canvas.width),
        Math.floor(Math.random() * canvas.height)
      ) //随机线的终点x坐标是画布宽度，y坐标是画布高度的随机数
      context.lineWidth = 0.5 //随机线宽
      context.strokeStyle = 'rgba(50,50,50,0.3)' //随机线描边属性
      context.stroke() //描边，即起点描到终点
    },
    // 随机点(所谓画点其实就是画1px像素的线，方法不再赘述)
    drawDot(canvas, context) {
      var px = Math.floor(Math.random() * canvas.width)
      var py = Math.floor(Math.random() * canvas.height)
      context.moveTo(px, py)
      context.lineTo(px + 1, py + 1)
      context.lineWidth = 0.2
      context.stroke()
    },
    // 绘制图片
    convertCanvasToImage(canvas) {
      document.getElementById('verifyCanvas').style.display = 'none'
      var image = document.getElementById('code_img')
      image.src = canvas.toDataURL('image/png')
      return image
    },
    changeVerifyCode() {
      document.getElementById('verifyCanvas').remove()
      const canvas = document.createElement('canvas')
      canvas.setAttribute('width', 100)
      canvas.setAttribute('height', 40)
      canvas.setAttribute('id', 'verifyCanvas')

      document
        .getElementById('verifyCanvs-box')
        .insertBefore(canvas, document.getElementById('code_img'))

      this.drawCode()
    },
  },
}
</script>

<style scoped>
.verifyCanvs-wrap {
  margin: 0;
  width: fit-content;
}
#verify {
  height: 34px;
  vertical-align: top;
  font-size: 16px;
}

#code_img {
  width: 100px;
  height: 40px;
  cursor: pointer;
  vertical-align: top;
  border-radius: 2px;
}
</style>