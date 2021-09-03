<template>
  <ul class="ipAdress">
    <el-input ref="topInput" class="top_input" v-model="ip"></el-input>
    <li v-for="(item,index) in ipAdress" :key="index">
      <input
        type="text"
        class="bottom_input"
        @input="checkIpVal(item,index)"
        @keyup="turnIpPOS(item,index,$event)"
        v-model="item.value"
        ref="ipInput"
        @blur="setDefaultVal(item)"
      />
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      ipAdress: [
        {
          value: ''
        },
        {
          value: ''
        },
        {
          value: ''
        },
        {
          value: ''
        }
      ],
      ip: ''
    }
  },
  props: {
    defaultValue: {
      type: String
    }
  },
  watch: {
    ipAdress: {
      handler(newVal) {
        this.ip = newVal.map(v => v.value).join('.')
        this.$emit('input', this.ip)
      },
      immediate: true,
      deep: true
    },
    defaultValue: {
      handler(val) {
        if (val) {
          let ip = val.split('.')

          this.ipAdress = [
            {
              value: ip[0]
            },
            {
              value: ip[1]
            },
            {
              value: ip[2]
            },
            {
              value: ip[3]
            }
          ]
        }
      },
      immediate: true
    }
  },
  methods: {
    checkIpVal(item, index) {
      let self = this
      //确保每个值都处于0-255
      let val = item.value
      //当输入的是空格时，值赋为空
      val = val.trim()
      val = parseInt(val, 10)
      if (isNaN(val)) {
        val = ''
      } else {
        val = val < 0 ? 0 : val
        val = val > 255 ? 255 : val
      }
      item.value = val
    },
    turnIpPOS(index, event) {
      let self = this
      let e = event || window.event
      //左箭头向左跳转，左一不做任何措施
      if (e.keyCode == 37) {
        if (index == 0) {
        } else {
          self.$refs.ipInput[index - 1].focus()
        }
      }
      //删除键把当前数据删除完毕后会跳转到前一个input，左一不做任何处理
      if (e.keyCode == 8) {
        let val = item.value
        if (index == 0) {
        } else {
          self.$refs.ipInput[index - 1].focus()
        }
      }
      //右箭头、回车键、空格键、冒号均向右跳转，右一不做任何措施
      if (e.keyCode == 39 || e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 190) {
        if (index == 3) {
        } else {
          self.$refs.ipInput[index + 1].focus()
        }
      }
    },
    setDefaultVal(item) {
      // this.$refs.topInput.blur()

      //当input失去焦点，而ip没有赋值时，会自动赋值为0
      let self = this
      let val = item.value
      if (val == '') {
        item.value = '0'
      }
    }
  }
}
</script>

<style lang='scss'>
.ipAdress {
  display: flex;
  justify-self: center;
  margin: 0;
  align-items: center;
  justify-content: space-around;
  padding: 0;
  position: relative;
  width: 100%;
  .top_input {
    color: transparent;
    position: absolute;
    font-size: 14px;
    display: inline-block;
    width: 100%;
    left: 0;
  }
  .el-input__inner {
    color: transparent;
  }
}
.ipAdress li {
  width: 25%;
  list-style: none;
  position: relative;
  margin: 0;
}
ul[class='ipAdress'] input[class='bottom_input'] {
  border: none;
  width: 100%;
  height: 23px;
  text-align: center;
  background: transparent;
  color: #333;
}
.ipAdress li:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 9px;
  right: 8px;
  border-radius: 50%;
  background: #7b7b7b;
  width: 2px;
  height: 2px;
}
/*只需要3个div*/
.ipAdress li:last-child div {
  display: none;
}
/*取消掉默认的input focus状态*/
.ipAdress input:focus {
  outline: none;
}
</style>