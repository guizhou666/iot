<template>
  <div class="supportitem__wrap">
    <el-checkbox-group v-model="supportItem">
      <el-checkbox v-for="item in supportList" :key="item.label" :label="label">{{
        item.label
      }}</el-checkbox>
    </el-checkbox-group>

    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item v-for="item in config" :title="item.title" :key="item.title">
        <el-radio-group v-model="configValue[item.key]">
          <el-radio
            class="config__radioGroup"
            v-for="data in item.data"
            :key="data.key"
            :label="data.key"
          >
            <span> username: {{ data.username }} </span>
            <span> password: {{ data.password }} </span>
            <span>
              connectedstring:
              {{ data.connectedstring }}
            </span>
          </el-radio>
        </el-radio-group>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  data() {
    return {
      supportItem: [],
      supportList: [
        {
          key: '1',
          label: '支持sweger文档功能'
        },
        {
          key: '2',
          label: '支持注册/配置中心nacos'
        },
        {
          key: '3',
          label: '支持注册/配置中心consul'
        },
        {
          key: '4',
          label: '支持数据库（postgresql）'
        },
        {
          key: '1',
          label: '支持sweger文档功能'
        },
        {
          key: '2',
          label: '支持注册/配置中心nacos'
        },
        {
          key: '3',
          label: '支持注册/配置中心consul'
        },
        {
          key: '4',
          label: '支持数据库（postgresql）'
        },
        {
          key: '1',
          label: '支持sweger文档功能'
        },
        {
          key: '2',
          label: '支持注册/配置中心nacos'
        },
        {
          key: '3',
          label: '支持注册/配置中心consul'
        },
        {
          key: '4',
          label: '支持数据库（postgresql）'
        },
        {
          key: '1',
          label: '支持sweger文档功能'
        },
        {
          key: '2',
          label: '支持注册/配置中心nacos'
        },
        {
          key: '3',
          label: '支持注册/配置中心consul'
        },
        {
          key: '4',
          label: '支持数据库（postgresql）'
        }
      ],
      config: [
        {
          key: 'dataBase',
          title: '数据库相关配置',
          data: [
            {
              key: 1,
              username: 'root',
              password: 'root',
              connectedstring: 'jdbc:mysql://192.106.18.1730.3306/hsvs?usnicodexxxx'
            },
            {
              key: 2,
              username: 'root',
              password: 'root',
              connectedstring: 'jdbc:mysql://192.106.18.1730.3306/hsvs?usnicodexxxx'
            },
            {
              key: 3,
              username: 'root',
              password: 'root',
              connectedstring: 'jdbc:mysql://192.106.18.1730.3306/hsvs?usnicodexxxx'
            }
          ]
        },
        {
          key: 'nacos',
          title: '注册/配置中心nacos配置',
          data: [
            {
              key: 4,
              username: 'root',
              password: 'root',
              connectedstring: 'jdbc:mysql://192.106.18.1730.3306/hsvs?usnicodexxxx'
            },
            {
              key: 5,
              username: 'root',
              password: 'root',
              connectedstring: 'jdbc:mysql://192.106.18.1730.3306/hsvs?usnicodexxxx'
            },
            {
              key: 6,
              username: 'root',
              password: 'root',
              connectedstring: 'jdbc:mysql://192.106.18.1730.3306/hsvs?usnicodexxxx'
            }
          ]
        },
        {
          key: 'consul',
          title: '注册/配置中心consul配置',
          data: [
            {
              key: 7,
              username: 'root',
              password: 'root',
              connectedstring: 'jdbc:mysql://192.106.18.1730.3306/hsvs?usnicodexxxx'
            },
            {
              key: 8,
              username: 'root',
              password: 'root',
              connectedstring: 'jdbc:mysql://192.106.18.1730.3306/hsvs?usnicodexxxx'
            },
            {
              key: 9,
              username: 'root',
              password: 'root',
              connectedstring: 'jdbc:mysql://192.106.18.1730.3306/hsvs?usnicodexxxx'
            }
          ]
        },
        {
          key: 'redis',
          title: 'Redis相关配置',
          data: [
            {
              key: 11,
              username: 'root',
              password: 'root',
              connectedstring: 'jdbc:mysql://192.106.18.1730.3306/hsvs?usnicodexxxx'
            },
            {
              key: 12,
              username: 'root',
              password: 'root',
              connectedstring: 'jdbc:mysql://192.106.18.1730.3306/hsvs?usnicodexxxx'
            },
            {
              key: 13,
              username: 'root',
              password: 'root',
              connectedstring: 'jdbc:mysql://192.106.18.1730.3306/hsvs?usnicodexxxx'
            }
          ]
        }
      ],
      configValue: {
        dataBase: {},
        consul: {},
        nacos: {},
        redis: {}
      }
    }
  }
}
</script>

 <style lang="scss" scoped>
.supportitem__wrap {
  .el-checkbox-group ::v-deep {
    width: 80%;
    display: flex;
    flex-wrap: wrap;
    .el-checkbox {
      width: 20%;
      margin: 10px 0;
    }
  }
  .el-radio-group {
    width: 100%;
    .config__radioGroup ::v-deep {
      margin: 10px 0;
      display: flex;
      .el-radio__label {
        width: 70%;
        display: flex;
        justify-content: space-between;
        span {
          display: inline-block;
        }
      }
    }
  }
}
</style>>
