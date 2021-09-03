<template>
  <div class="commonTable__wrap">
    <div class="commonTable__wrap__content">
      <!-- 按钮操作 -->
      <div class="commonTable__header--btnGroup" v-if="_tableConfig.showOperationBtn">
        <slot name="operationBtn"></slot>
      </div>
      <!-- 表格 -->
      <el-table
        ref="common-table"
        class="commonTable__body"
        :data="dataList"
        width="100%"
        v-loading="_tableConfig.loading"
        :border="_tableConfig.border"
        @selection-change="_handle_selection_change"
        @row-click="_handle_row_click"
        @cell-click="cellClick"
        :cell-style="columnStyle"
        :header-cell-style="headerStyle"
        :row-style="rowStyle"
      >
        <el-table-column
          v-if="_tableConfig.showCheckbox"
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <template v-for="(_item, _index) in _tableConfig.headers">
          <el-table-column
            v-if="!_item.tdTemplate"
            :prop="_item.field"
            :label="_item.title"
            :key="_index"
            :width="_item.width"
            :show-overflow-tooltip="_item.toolTip"
            :sortable="_item.sortable"
            align="_item.align"
          >
            <span class="ellipsis" :title="scope.row[_item.field]" slot-scope="scope">{{
              scope.row[_item.field] | isNull
            }}</span>
          </el-table-column>
          <el-table-column
            v-if="_item.tdTemplate"
            :prop="_item.field"
            :label="_item.title"
            :key="_index"
            :width="_item.width"
            :sortable="_item.sortable"
            :show-overflow-tooltip="_item.toolTip"
            :align="_item.tdTemplate == 'operation' ? 'center' : _item.align"
          >
            <template slot-scope="scope">
              <span v-if="_item.tdTemplate === 'operation'" class="commonTable__btnGroup">
                <slot :row="scope.row" :index="scope.$index" :name="_item.tdTemplate"></slot>
              </span>
              <slot v-else :row="scope.row" :index="scope.$index" :name="_item.tdTemplate"></slot>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        v-if="_tableConfig.showPagination"
        class="commonTable__pagination"
        :page-sizes="_tableConfig.pageSizeOptions"
        :page-size="_tableConfig.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="_tableConfig.total"
        :current-page.sync="_tableConfig.pageNum"
        @size-change="_handlePageSizeChange"
        @current-change="_handleCurrentPage"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ufastTable',
  props: {
    dataList: {
      type: Array,
      default: []
    },
    tableConfig: {
      type: Object,
      // 配置表格 （默认表格）
      default: {
        showPagination: true,
        pageNum: 1,
        total: 0,
        loading: false,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30, 40, 50],
        headers: []
      }
    },
    getListHandle: {
      type: Function,
      default: function () {}
    },
    selectKey: {
      type: Object,
      default() {
        return {
          id: 'id',
          name: ['name']
        }
      }
    }
  },
  data() {
    return {
      _tableConfig: {},
      _data_list: [],
      _selectList: {
        ids: [],
        names: []
      },
      headerStyle: {
        background: '#f6f7fb',
        color: '#424345',
        height: '56px'
      },
      rowStyle: {
        height: '60px'
      }
    }
  },
  watch: {
    tableConfig(val) {
      this._tableConfig = this.tableConfig
    },
    _tableConfig(val) {
      this.tableConfig = val
      this.$emit('update:tableConfig', val)
    },
    dataList(val) {
      this._data_list = val
      this._handle_pipe()
    },
    immediate: true,
    deep: true
  },
  created() {
    this._tableConfig = this.tableConfig
    this._data_list = this.dataList
  },
  methods: {
    _handle_pipe() {
      var _pipe_name_arr = []
      for (let _i = 0; _i < this._tableConfig['headers'].length; _i++) {
        if (this._tableConfig['headers'][_i].pipe) {
          _pipe_name_arr.push({
            [this._tableConfig['headers'][_i].field]: this._tableConfig['headers'][_i].pipe
          })
        }
      }
      _pipe_name_arr.forEach((_v, _i) => {
        if (_v[Object.keys(_v)[0]].indexOf('date|') != -1) {
          let _a = _v[Object.keys(_v)[0]].split('|')
          if (this.dataList) {
            this.dataList.forEach((_ele, _j) => {
              let _date = new Date(Number(_ele[Object.keys(_v)[0]]))
              _ele[Object.keys(_v)[0]] =
                _ele[Object.keys(_v)[0]] && this._conversion_date(_date, _a[1])
            })
          }
        } else {
          if (this._data_list) {
            this._data_list.forEach((_e, _j) => {
              _e[Object.keys(_v)[0]] = eval(_v[Object.keys(_v)[0]])[_e[Object.keys(_v)[0]]]
            })
          }
        }
      })
    },
    _handlePageSizeChange(_page_size) {
      this._tableConfig.pageSize = _page_size
      this._tableConfig.pageNum = 1
      this.getListHandle()
    },
    _handleCurrentPage(_page_num) {
      this._tableConfig.pageNum = _page_num
      this.getListHandle()
    },
    _conversion_date(_date, _type) {
      var _y = _date.getFullYear()
      var _m = _date.getMonth() + 1
      var _d = _date.getDate()
      var _hou = _date.getHours() < 10 ? '0' + _date.getHours() : _date.getHours()
      var _min = _date.getMinutes() < 10 ? '0' + _date.getMinutes() : _date.getMinutes()
      var _sec = _date.getSeconds() < 10 ? '0' + _date.getSeconds() : _date.getSeconds()
      if (_m < 10) {
        _m = '0' + _m
      }
      if (_d < 10) {
        _d = '0' + _d
      }
      if (_type == 'yyyy-MM-dd') {
        return _y + '-' + _m + '-' + _d
      }
      if (_type == 'yyyy-MM-dd hh:mm:ss') {
        return _y + '-' + _m + '-' + _d + ' ' + _hou + ':' + _min + ':' + _sec
      }
    },
    _handle_row_click(row) {
      this.$emit('row-click', row)
    },
    //表单内点击事件（可允许表单内一行多个不同的点击事件）
    cellClick(row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event)
    },
    //点击列
    columnStyle(row, column, rowIndex, columnIndex) {
      for (let i = 0; i < this._tableConfig.headers.length; i++) {
        if (!!this._tableConfig.headers[i].clickable) {
          if (row.column.label == this._tableConfig.headers[i].title) {
            return 'color: #1396c2; cursor: pointer;'
          } else {
            continue
          }
        }
      }
    },
    _handle_selection_change(_val) {
      this._selectList = _val
      this.$emit('handleSelectChange', _val, this._selectList)
    },
    getParams(type, row, msg) {
      let params, content, nameList
      const { id, name } = this.selectKey
      let selectList = type == 'batch' ? this._selectList : [row]
      // 判断selectkey中的name是不是数组
      nameList = selectList.map((item) => {
        if (item[name[0]]){
          return item[name[0]]
        } else {
          return item[name[1]]
        }
      })

      params = { ids: selectList.map((item) => item[id]) }
      content = `${msg}` + `${nameList.join(',')}` + '?'
      return { params, content }
    },

    // 作废
    invalid(type, row, message) {
      const h = this.$createElement
      return new Promise((resolve, reject) => {
        let { params, content } = this.getParams(type, row, '确定删除')
        return this.$confirm(
          h('span',{ class: 'operation__title' }, [
            h('span', content),
            message ? h('span', { class: 'confirmTips' }, `(${message})`) : null
          ]),
          '提示',
          {
            confirmButtonText: '确定',
            confirmButtonClass: 'el-icon-finished',
            cancelButtonText: '取消',
            cancelButtonClass: 'el-icon-refresh-left',
            type: 'error'
          }
        )
          .then(() => {
            resolve(params)
          })
          .catch(() => {})
      })
    },
    disabled(type, row, message) {
      const h = this.$createElement
      return new Promise((resolve, reject) => {
        let { params, content } = this.getParams(type, row, '确定禁用')
        return this.$confirm( h('span',{ class: 'operation__title' }, [
            h('span', content),
            message ? h('span', { class: 'confirmTips' }, `(${message})`) : null
          ]), '提示', {
          confirmButtonText: '确定',
          confirmButtonClass: 'el-icon-finished',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-icon-refresh-left',
          type: 'warning'
        })
          .then(() => {
            resolve({ ...params, isEnabled: 0 })
          })
          .catch(() => {})
      })
    },
    enabled(type, row, message) {
      const h = this.$createElement
      return new Promise((resolve, reject) => {
        let { params, content } = this.getParams(type, row, '确定启用')
        return this.$confirm(
           h('span',{ class: 'operation__title' }, [
            h('span', content),
            message ? h('span', { class: 'confirmTips' }, `(${message})`) : null
          ]),
          '提示', {
          confirmButtonText: '确定',
          confirmButtonClass: 'el-icon-finished',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-icon-refresh-left',
          type: 'warning'
        })
          .then(() => {
            resolve({ ...params, isEnabled: 1 })
          })
          .catch(() => {})
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
.commonTable__wrap {
  .commonTable__wrap__content {
    overflow: hidden;
    .commonTable__header--btnGroup {
      margin-bottom: 16px;
      background: #fff;
    }
    .commonTable__body {
      color: #777;
    }
    .commonTable__pagination {
      float: right;
      padding: 0 15px;
      margin-top: 18px;
      margin-bottom: 25px;
    }
    .ellipsis {
      @include textOverflow;
    }
  }
  .commonTable__btnGroup ::v-deep {
    @include flex(space-around);
    & .el-link {
      max-width: 80px;
      @include textOverflow(1, block);
    }
  }
}
.el-message-box__wrapper {
  .confirmTips {
    color: red;
    margin-left: 9px;
    font-size: 12px;
  }
  .operation__title {
    display: block;
    word-break: break-all;
  }
}
</style>

<style>
.el-tooltip__popper {
  max-width: 800px;
  line-height: 180%;
}
</style>
