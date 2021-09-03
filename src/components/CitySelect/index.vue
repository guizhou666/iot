<template>
  <div style="display:flex" class="city-select">
    <el-select filterable clearable ref="province" :style="'width:' + width" v-model.trim="provinceId" placeholder="请选择省份" :disabled="disabled">
      <el-option v-for="obj in item1" :value="obj.code" :key="obj.code" :label="obj.name"></el-option>
    </el-select>
    <el-select clearable ref="city" :style="'width:' + width"  v-model.trim="cityId" placeholder="请选择地市" :disabled="disabled">
      <el-option v-for="obj in item2" :value="obj.code" :key="obj.code" :label="obj.name"></el-option>
    </el-select>
    <el-select clearable ref="area" :style="'width:' + width"  v-model.trim="countyId" placeholder="请选择地区" :disabled="disabled">
      <el-option v-for="obj in item3" :value="obj.code" :key="obj.code" :label="obj.name"></el-option>
    </el-select>
    <template v-if="showAddress">
      <el-input v-model.trim="address" maxlength="50" placeholder="请输入详细地址" :style="'width:' + (100%-width)"></el-input>
    </template>
  </div>
</template>

<script>
import CityJSON from './ChinaCityJSON'
export default {
  data() {
    return {
      provinceId: '',
      cityId:'',
      countyId: '',
      address: '',
      item1: [],
      item2: [],
      item3: [],
      timer:0,
      initial: false
    };
  },
  mounted() {
    this.item1 = this.getCityByCode();
  },
  props: {
    val: {
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
	    default: '20%'
    },
    showAddress: {
      type: Boolean,
	    default: true
    },
  },
  watch: {
    provinceId() {
      this.item2 = [];
      if(!this.initial) {
        this.cityId = '';
      }
      if(this.provinceId){
        this.item2 = this.item2.concat(this.getCityByCode(this.provinceId));
      }
      setTimeout(()=>{
        this.onChange();
      },10);
    },
    cityId() {
      this.item3 = [];
      if(!this.initial) {
        this.countyId = '';
      }
      if(this.cityId){
        this.item3 = this.item3.concat(this.getCityByCode(this.cityId));
      }
      setTimeout(()=>{
        this.onChange();
      },10);
    },
    countyId() {
      setTimeout(()=>{
        this.onChange();
      },10);
    },
    address() {
      setTimeout(()=>{
        this.onChange();
      },10);
    },
    val() {
      if('undefined' === typeof(this.val) || '' === this.val){
        return;
      }else if(false === this.val){
        //传入false表示重置
        this.provinceId = '';
        return;
      }
      let ret = this.getCityByCode(this.val);
      if (3 === ret.length) {
        this.provinceId = ret[0];
        setTimeout(() => {
          this.cityId = ret[1];
          setTimeout(()=>{
            this.countyId = ret[2];
          },10);
        }, 10);
      }
    }
  },
  methods: {
    setValue({provinceId,cityId,countyId,address}) {
      this.initial =  true
      this.provinceId = provinceId
      this.cityId = cityId
      this.countyId = countyId
      this.address = address
      setTimeout(()=>{
        this.initial = false
      },100)
    },
    getCityByCode(code) {
      let tmp = [],
        ret = [];
      if ('undefined' === typeof code || '' === code) {
        tmp = CityJSON;
      } else {
        for (let i = 0; i < CityJSON.length; i++) {
          if (('' + code).substr(0, 2) === CityJSON[i].code.substr(0, 2)) {
            if ('0000' === ('' + code).substr(2)) {
              //如果查询的是省级，返回市级
              tmp = CityJSON[i].children || [];
              break;
            } else {
              for (let j = 0; j < CityJSON[i].children.length; j++) {
                if (
                  ('' + code).substr(0, 4) ==
                  CityJSON[i].children[j].code.substr(0, 4)
                ) {
                  tmp = CityJSON[i].children[j].children || [];
                  if ('00' === ('' + code).substr(4)) {
                    //如果查询是市级，则返回县级
                    break;
                  } else {
                    ret = [CityJSON[i].code, CityJSON[i].children[j].code];
                    for (let k = 0; k < tmp.length; k++) {
                      if (code === tmp[k].code) {
                        ret.push(tmp[k].code);
                      }
                    }
                    return ret;
                  }
                }
              }
            }
          }
        }
      }
      tmp.forEach(v => {
        ret.push({
          code: v.code,
          name: v.name
        });
      });
      return ret;
    },
    onChange(){
      let ret = {
        provinceId: this.provinceId,
        cityId: this.cityId,
        countyId: this.countyId,
        provinceName: this.$refs.province.selected.label || '',
        cityName: this.$refs.city.selected.label || '',
        countyName: this.$refs.area.selected.label || '',
        address: this.address
      };
      ret.fullAddress = ret.provinceName + ret.cityName + ret.countyName + ret.address;
      clearTimeout(this.timer);
      this.timer = setTimeout(()=>{
        this.$emit('change', ret);
      },50);
    }
  }
};
</script>
<style lang="scss">
.city-select {
  & .el-select {
    margin-right: 10px;
  }
}
</style>

