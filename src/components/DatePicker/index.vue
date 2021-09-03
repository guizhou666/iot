<template>
  <el-date-picker
    :picker-options="pickerOptions"
    value-format="yyyy-MM-dd HH:mm:ss"
    v-model="value"
    placeholder="年/月/日"
    @change="changeTime"
    size="small"
  ></el-date-picker>
</template>

<script>
export default {
  props: {
    // 默认选全天
    fullday: {
      type: Boolean,
      default: false
    },
    date: {
      type: String
    },
    disabledDate: {
      type: Object
    }
  },
  data() {
    return {
      value: this.date,
      pickerOptions: {
        disabledDate: time => {
          let { compareTime, type } = this.disabledDate
          if (compareTime) {
            compareTime = new Date(compareTime).getTime()
            if (type == 'start') {
              return time.getTime() > compareTime
            } else {
              return time.getTime() < compareTime
            }
          }
        }
      }
    }
  },
  watch: {
    value(newVal) {
      this.$emit('change', newVal)
    },
    date(newVal) {
      this.value = newVal
    }
  },
  computed: {
    dateValue: {
      get() {
        return this.date
      },
      set() {}
    }
  },
  methods: {
    changeTime(v) {
      let time
      if (v) {
        if (this.fullday) {
          time = v.split(' ')[0] + ' 23:59:59'
        } else {
          time = v
        }
        this.$emit('change', time)
      }
    }
  }
}
</script>

<style>
</style>