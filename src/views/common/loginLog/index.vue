<template>
  <div class="main">
    <FilterForm @onSearch="onSearch"></FilterForm>
    <div class="app-content-wrap">
    <CommonTable
      class="table"
      :dataList="tableData"
      :getListHandle="_getLoginLogs"
      :tableConfig.sync="tableConfig"
    >
    </CommonTable>
    </div>
  </div>
</template>

<script>
import { AppMainHeader, CommonTable } from "@/components";
import { getLoginLog } from "@/api/logs";
import FilterForm from "./FilterForm";
export default {
  name: "PersonalFile",
  components: { AppMainHeader, FilterForm, CommonTable },
  data() {
    return {
      searchParams: {},
      tableData: [],
      tableConfig: {
        id: "assetsCenter-categoryAssets",
        pageSize: 5,
        pageNum: 1,
        total: 0,
        border: false,
        pageSizeOptions: [5, 10, 100, 200, 500],
        loading: false,
        showPagination: true,
        showOperationBtn: true,
        showCheckbox: false,
        headers: [
          { title: this.$t('log.logTime'), field: "createdTime" },
          { title: this.$t('log.username'), field: "userAccount" },
          { title: this.$t('log.name'), field: "realName" },
          { title: "APPID", field: "appId" },
          { title: "IP", field: "client" },
          { title: this.$t('log.behavior'), field: "loginInfo" },
        ],
      },
    };
  },
  created() {
    this._getLoginLogs();
  },
  mounted() {},
  methods: {
    async _getLoginLogs() {
      this.tableConfig.loading = true;
      this.searchParams.size = this.tableConfig.pageSize;
      this.searchParams.current = this.tableConfig.pageNum;
      const { code, data, msg } = await getLoginLog(this.searchParams);
      if (code === "200") {
        this.tableData = data.records;
        this.tableConfig.total = data.total;
        this.tableConfig.loading = false;
      }
    },
    onSearch(params) {
      this.tableConfig.current = 1;
      Object.assign(this.searchParams, params);
      this._getLoginLogs();
    },
  },
};
</script>

<style lang="scss">
.text {
  @include font_color("font_color1");
}
</style>
