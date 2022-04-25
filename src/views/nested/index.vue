<template xmlns:font-size="http://www.w3.org/1999/xhtml">
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-input
        v-model="searchName"
        clearable
        placeholder="输入文献名字搜索"
        style="width: 200px; margin-right: 10px"
      />
      <el-button
        sizi="mini"
        type="success"
        icon="el-icon-search"
        @click="fetchData()"
      >搜索
      </el-button>
      <el-button
        sizi="mini"
        type="warning"
        icon="el-icon-refresh-left"
        @click="searchName = ''"
      >重置
      </el-button>
      <el-button style="float: right" icon="el-icon-refresh" s-i-z-i="mini" @click="fetchData()">刷新</el-button>
    </div>
    <template element-loading-text="Loading">
      <a-list
        item-layout="horizontal"
        :data-source="pvData"
        size="large"
      >
        <a-list-item slot="renderItem" slot-scope="item" style="flex-direction: column;align-items: start;">
          <div style="margin-bottom: 8px;">
            <a-list-item-meta :description="item.author + `${item.university? ' | ' + item.university :''}`">
              <template #title>
                <div style="padding-bottom: 10px;">
                  <a style="font-size: 20px; color: cornflowerblue;" @click="tasksShow(item.id)" >{{ item.name }}</a>
                </div>
              </template>
            </a-list-item-meta>
          </div>
          <template #actions>
            <div style="margin-left: -48px">
              <span v-for="icon in actions" :key="icon.class" style="margin-right: 8px">
                <i :class="icon.class" style="margin-right: 8px"/>
                {{ item[icon.key] }}
              </span>
            </div>
          </template>
          <p>
            {{ item.foreword }}
          </p>
        </a-list-item>
      </a-list>
    </template>
    <el-pagination
      style="margin: 12px 0"
      background
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { selectLiteratureList } from '@/service/literature'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      currentPage: 1, // 初始页
      pagesize: 5, //    每页的数据
      total: 0,
      searchName: '',
      dialogFormVisible: false,
      pvData: [],
      list: null,
      listLoading: true,
      actions: [
        { class: 'el-icon-download', key: 'downNum' },
        { class: 'el-icon-star-on', key: 'storeNum' }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(size) {
      this.pagesize = size
      this.fetchData()
      console.log(this.pagesize) // 每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      this.fetchData()
      console.log(this.currentPage) // 点击第几页
    },
    fetchData() {
      this.listLoading = true
      selectLiteratureList(this.searchName, (this.currentPage - 1) * this.pagesize, this.pagesize).then(response => {
        console.log('data:', this.pvData)
        this.list = response.data
        this.pvData = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    tasksShow(id) {
      console.log('点击了这一行', id)
      const routeUrl = this.$router.resolve({
        path: '/literatureDataInfo',
        query: {
          detailRowMessage: id
        }
      })
      window.open(routeUrl.href, '_blank')
    }
  }
}
</script>

<style scoped>
</style>
