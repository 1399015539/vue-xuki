<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-input
        v-model="searchName"
        clearable
        placeholder="输入日志内容搜索"
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
      <el-button sizi="mini" type="primary" icon="el-icon-plus" @click="handleAdd()">新增</el-button>
      <el-button style="float: right" icon="el-icon-refresh" s-i-z-i="mini" @click="fetchData()">刷新</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="pvData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="日志内容">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.creattime }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog
      title="日志编辑"
      :visible.sync="dialogFormVisible"
      width="500px"
      top="50px"
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model="form.id" auto-complete="off" :disabled="true" />
        </el-form-item>
        <el-form-item label="日志内容" :label-width="formLabelWidth" prop="content">
          <el-input ref="content" v-model="form.content" placeholder="请输入日志内容" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="=dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSet()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { search } from '@/service/table'
import { deleteLog, editLog, selectLogList } from '@/service/log'

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
    const validateName = (rule, value, callback) => {
      try {
        if (value) {
          callback()
        } else {
          callback(new Error('日志内容不能为空'))
        }
      } catch (err) {
        this.$message.error(err.message)
      }
    }
    return {
      currentPage: 1, // 初始页
      pagesize: 5, //    每页的数据
      total: 0,
      searchName: '',
      dialogFormVisible: false,
      form: {
        id: '',
        content: '',
        creattime: ''
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入日志内容', validator: validateName }]
      },
      pvData: [],
      formLabelWidth: '80px',
      list: null,
      listLoading: true
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
      selectLogList(this.searchName, (this.currentPage - 1) * this.pagesize, this.pagesize).then(response => {
        this.list = response.data
        this.pvData = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    searchUser(searchName) {
      this.listLoading = true
      search(searchName).then(res => {
        this.list = res
        this.pvData = res
        this.listLoading = false
      })
    },
    handleAdd() {
      this.dialogFormVisible = true
      this.form.id = ''
      this.form.content = ''
      this.form.creattime = ''
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true
      this.form.id = row.id
      this.form.content = row.content
      this.form.creattime = row.creattime
    },

    // 修改、增加用户信息
    async handleSet() {
      if (this.form.content !== '') {
        await editLog(this.form)
        this.dialogFormVisible = false
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
        this.fetchData()
      } else {
        this.$notify({
          title: '警告',
          message: '请注意输入信息是否完整！',
          type: 'warning'
        })
      }
    },
    handleDelete({ id }) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteLog(id)
          this.$message({
            type: 'success',
            message: '删除成功!',
            showClose: true
          })
          this.fetchData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            showClose: true
          })
        })
    }
  }
}
</script>
