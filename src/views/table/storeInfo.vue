<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-input
        v-model="searchName"
        clearable
        placeholder="输入用户id搜索"
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
      <el-table-column label="用户id">
        <template slot-scope="scope">
          {{ scope.row.userId }}
        </template>
      </el-table-column>
      <el-table-column label="文献id" align="center">
        <template slot-scope="scope">
          {{ scope.row.literatureId }}
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
      title="用户收藏编辑"
      :visible.sync="dialogFormVisible"
      width="500px"
      top="50px"
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model="form.id" auto-complete="off" :disabled="true" />
        </el-form-item>
        <el-form-item label="用户id" :label-width="formLabelWidth" prop="userId">
          <el-input ref="userId" v-model="form.userId" placeholder="请输入用户id" auto-complete="off" />
        </el-form-item>
        <el-form-item label="文献id" :label-width="formLabelWidth" prop="literatureId">
          <el-input ref="literatureId" v-model="form.literatureId" placeholder="请输入文献id" auto-complete="off" />
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
import { deleteStore, editStore, selectStoreList } from '@/service/store'

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
          callback(new Error('此输入内容不能为空'))
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
        userId: '',
        literatureId: ''
      },
      rules: {
        userId: [{ required: true, trigger: 'blur', message: '请输入用户id', validator: validateName }],
        literatureId: [{ required: true, trigger: 'blur', message: '请输入文献id', validator: validateName }]
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
      selectStoreList(this.searchName, (this.currentPage - 1) * this.pagesize, this.pagesize).then(response => {
        this.list = response.data
        this.pvData = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    handleAdd() {
      this.dialogFormVisible = true
      this.form.id = ''
      this.form.userId = ''
      this.form.literatureId = ''
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true
      this.form.id = row.id
      this.form.userId = row.userId
      this.form.literatureId = row.literatureId
    },

    // 修改、增加用户信息
    async handleSet() {
      if (this.form.userId !== '' && this.form.literatureId !== '') {
        await editStore(this.form)
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
          await deleteStore(id)
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
