<template>
  <div class="upload-wrap">
    <div class="loading-upload" v-if="showLoading">
      <i class="el-icon-loading" style="color: #1f77d0"></i>
      <span style="color: #1f77d0">上传中,请等待...</span>
      <span class="cancel" @click="cancelUpload">取消</span>
    </div>
    <!-- 图片上传 -->
    <div class="content-wrap" v-if="uploadConfig.type == 'img'">
      <el-upload
        class="avatar-uploader"
        action="#"
        :http-request="uplodaImg"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <slot v-if='uploadConfig.showButton' name='button'></slot>
        <template v-else>
          <img v-show="imageUrl" :src="imageUrl" class="avatar" />
          <i v-show="!imageUrl" class="el-icon-plus avatar-uploader-icon"></i>
        </template>
      </el-upload>
    </div>
    <!-- 文件上传列表 -->
    <div class="content-wrap" v-if="uploadConfig.type == 'file'">
      <div class="header">
        <el-upload
          v-if="!uploadConfig.showModal"
          ref="uploader"
          class="add"
          action="#"
          :http-request="_upload_file"
          :on-preview="_handle_preview"
          :before-remove="_before_remove"
          multiple
          :file-list="$data._file_list"
          :show-file-list="false"
        >
          <span class="el-icon-plus">添加</span>
        </el-upload>
        <div class="add" v-else>
          <span class="el-icon-plus" @click="add">添加</span>
        </div>
      </div>
      <el-table :data="$data._file_list" border stripe style="width: 100%">
        <el-table-column
          v-if="uploadConfig.fileListConfig.showCheckbox"
          type="selection"
          width="55"
        ></el-table-column>
        <template v-for="(_item, _index) in uploadConfig.fileListConfig.headers">
          <el-table-column
            v-if="!_item.tdTemplate"
            :prop="_item.field"
            :label="_item.title"
            :key="_index"
            :width="_item.width"
          ></el-table-column>
          <el-table-column
            v-if="_item.tdTemplate"
            :prop="_item.field"
            :label="_item.title"
            :key="_index"
            :width="_item.width"
          >
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <slot
                  :row="scope.row"
                  :name="uploadConfig.fileListConfig.headers[_index].tdTemplate"
                ></slot>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <!-- 文件上传别针 -->
    <!-- <div class="content-wrap" v-if="uploadConfig.type == 'filePin'">
      <div class="header">
        <el-upload
          v-if="!uploadConfig.showModal"
          class="add"
          action="#"
          :http-request="_upload_file"
          :on-preview="_handle_preview"
          :before-remove="_before_remove"
          multiple
          :file-list="$data._file_list"
          :show-file-list="false"
        >
          <i class="iconfont iconfujian1"></i>
        </el-upload>
        <div class="add" v-else>
          <span class="el-icon-plus" @click="add">添加</span>
        </div>
      </div>
    </div> -->
    <div class="content-wrap" v-if="uploadConfig.type == 'filePin'">
      <el-upload
        class="upload-demo"
        :http-request="_upload_file"
        action="#"
        :on-preview="_handle_preview"
        :before-remove="_before_remove"
        multiple
        :limit="3"
        :file-list="$data._file_list"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { upload, getImg } from '@/api/file'
export default {
  name: 'ufastUpload',
  props: {
    uploadConfig: {
      type: Object,
      default: {}
    },
    size: {
      type: String,
      default: '100'
    },
    testStepId: {}
  },
  data() {
    return {
      iconVal: '',
      _file_list: [],
      fileIndex: [],
      imageUrl: '',
      showLoading: false,
      CancelToken: axios.CancelToken.source()
    }
  },
  created() {
    if (this.uploadConfig.defaultImg) {
      this.imageUrl = this.uploadConfig.defaultImgkey
    }
  },
  watch: {
    'uploadConfig.dataList'(res) {
      this.$data._file_list = res
    },
    'uploadConfig.filekey'(res) {
      res && this.getImg(res)
    }
  },
  methods: {
    uplodaImg(val) {
      let fd = new FormData()
      fd.append('file', val.file)
      upload(fd).then((file) => {
        if (file.code == '200') {
          this.getImg(file.data.filekey).then((res) => {
            this.$emit('handleFileList', file.data)
          })
        }
      })
    },
    // 查找图片
    getImg(filekey) {
      return new Promise((resolve, reject) => {
        getImg(filekey).then((res) => {
          this.imageUrl = URL.createObjectURL(res)
          resolve(res)
        })
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    _upload_file(val) {
      let CancelToken = axios.CancelToken
      let fd = new FormData()
      fd.append('file', val.file)
      if (val.file.name.length > 30) {
        this.$message.error('文件名称过长')
        return
      }
      this.showLoading = true
      // 开启loading
      // const loading = this.$loading({
      //   lock: true,
      //   text: '上传中,请等待...',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)',
      //   target: 'body'
      // })
      this.$http
        .post(`/service/107/uploadBypath?filepath=${this.uploadConfig.address}`, fd, {
          cancelToken: this.CancelToken.token
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.$message.success('上传成功')
            this.showLoading = false
            this.$data._file_list.push({
              index: this.$data._file_list.length,
              contentName: val.file.name,
              showSize: this.kbMb(val.file.size),
              contentSize: val.file.size,
              contentUrl: res.data.data.filekey
            })
          }
          this.$emit('fileList', this.$data._file_list)
        })
    },
    // 取消上传
    cancelUpload() {
      // var CancelToken = this.$http.CancelToken;
      // var source = CancelToken.source();
      // source.cancel('我被取消了');
      this.CancelToken.cancel()
      this.$nextTick(() => {
        // this.$refs.uploader.abort();
        // this.cancel();
        this.showLoading = false
      })
    },
    // 上传成功
    _handle_img_success() {
      this.$refs.headimgUpload.clearValidate() // 关闭校验
    },
    _handle_img_success(res, file) {
      this.iconVal = URL.createObjectURL(file.raw)
    },
    _handle_preview() {},
    _before_remove() {},
    //对上传图片的大小、格式进行限制
    beforeAvatarUpload(file) {
      const fileType = this.uploadConfig.fileType.split(',')
      const matchType = fileType.some((type) => {
        let fileType = type.toLowerCase()
        if(fileType == 'jpg') fileType = 'jpeg'
        return file.type === 'image/' + fileType
      })

      const limit = this.uploadConfig.limit || 5
      const outLimit = file.size / 1024 / 1024 > limit
      if (!matchType) {
        this.$message.warning(`只支持${this.uploadConfig.fileType}格式图片`)
        return false
      } else if (outLimit) {
        this.$message.warning(`请上传${limit}M以内的图片!`)
        return false
      }
    },
    // 添加
    add() {
      this.$emit('showModal', true)
    },
    //处理字节大小
    kbMb(size) {
      if (size > 1024 && size < 1048576) {
        return (size / 1024).toFixed(2) + 'KB'
      } else if (size >= 1048576) {
        return (size / 1048576).toFixed(2) + 'MB'
      } else {
        return size + 'B'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/variables.scss';
.upload-wrap {
  width: 100%;
  .loading-upload {
    width: 100vw;
    height: 100vh;
    line-height: 100vh;
    text-align: center;
    top: 0%;
    left: 0%;
    position: fixed;
    z-index: 999;
    background: rgba(0, 0, 0, 0.8);
    // opacity: 50%;
    .cancel {
      color: #b3b1b1;
      cursor: pointer;
      margin-left: 10px;
    }
  }
  .header {
    overflow: hidden;
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 20px 0 0;
    background: #f7f7f7;
    border-top: 1px solid #dddee2;
    border-left: 1px solid #dddee2;
    border-right: 1px solid #dddee2;
    .title {
      float: left;
    }
    .add {
      float: right;
      cursor: pointer;
      //   font-size: $font-size-medium;
      //   color: $color-theme;
    }
  }
}
// 上传upload
.avatar-uploader {
  ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}
.avatar-uploader {
  ::v-deep .el-upload:hover {
    border-color: #409eff;
  }
}
::v-deep .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  line-height: 130px;
  text-align: center;
}
.avatar {
  width: 130px;
  height: 130px;
  display: block;
}
// 进度条
.isshows {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background: rgba(0, 0, 0, 0.2);
  left: 0;
  text-align: center;
  z-index: 999;
}
.processCircle {
  position: fixed;
  top: 45%;
  background: transparent;
  left: 45%;
  text-align: center;
  z-index: 999;
}
.cancelUpload {
  position: fixed;
  top: 43%;
  left: calc(45% + 126px);
  text-align: center;
  z-index: 999;
  cursor: pointer;
}
.header {
  overflow: hidden;
  padding: 0 20px 0 0;
  .add {
    float: right;
    cursor: pointer;
    // font-size: $font-size-medium;
    // color: $color-theme;
  }
}
::v-deep .el-table--border {
  border-bottom: 1px solid #dfe6ec;
}
::v-deep .operation {
  cursor: pointer;
  //   font-size: $font-size-medium;
  //   color: $color-theme;
}
::v-deep .el-form-item__content {
  margin-left: 48px;
}
</style>
