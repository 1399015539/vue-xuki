<template>
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
      tooltip-effect="dark"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="author" align="center">
        <template slot-scope="scope">
          {{ scope.row.author }}
        </template>
      </el-table-column>
      <el-table-column label="university" align="center">
        <template slot-scope="scope">
          {{ scope.row.university }}
        </template>
      </el-table-column>
      <el-table-column label="foreword" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.foreword }}
        </template>
      </el-table-column>
      <el-table-column label="special" align="center">
        <template slot-scope="scope">
          {{ scope.row.special }}
        </template>
      </el-table-column>
      <el-table-column label="downNum" align="center">
        <template slot-scope="scope">
          {{ scope.row.downNum }}
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
      title="文献内容编辑"
      :visible.sync="dialogFormVisible"
      width="500px"
      top="50px"
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model="form.id" auto-complete="off" :disabled="true" />
        </el-form-item>
        <el-form-item label="name" :label-width="formLabelWidth" prop="name">
          <el-input ref="name" v-model="form.name" placeholder="请输入文献名称" auto-complete="off" />
        </el-form-item>
        <el-form-item label="author" :label-width="formLabelWidth" prop="author">
          <el-input ref="author" v-model="form.author" placeholder="请输入文献作者" auto-complete="off" />
        </el-form-item>
        <el-form-item label="university" :label-width="formLabelWidth" prop="university">
          <el-input ref="university" v-model="form.university" placeholder="请输入文献作者所在学校" auto-complete="off" />
        </el-form-item>
        <el-form-item label="foreword" :label-width="formLabelWidth" prop="foreword">
          <el-input ref="foreword" v-model="form.foreword" placeholder="请输入文献概要" auto-complete="off" />
        </el-form-item>
        <el-form-item label="special" :label-width="formLabelWidth" prop="special">
          <el-input ref="special" v-model="form.special" placeholder="请输入文献所属类型" auto-complete="off" />
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
import { deleteLiterature, editLiterature, selectLiteratureList } from '@/service/literature'

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
          callback(new Error('内容不能为空'))
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
        name: '',
        author: '',
        university: '',
        foreword: '',
        special: '',
        downNum: ''
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入文献名称', validator: validateName }],
        author: [{ required: true, trigger: 'blur', message: '请输入文献作者', validator: validateName }],
        university: [{ required: true, trigger: 'blur', message: '请输入文献作者所在学校', validator: validateName }],
        foreword: [{ required: true, trigger: 'blur', message: '请输入文献概要', validator: validateName }],
        special: [{ required: true, trigger: 'blur', message: '请输入文献所属类型', validator: validateName }]
      },
      pvData: [],
      formLabelWidth: '90px',
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
      selectLiteratureList(this.searchName, (this.currentPage - 1) * this.pagesize, this.pagesize).then(response => {
        this.list = response.data
        this.pvData = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    handleAdd() {
      this.dialogFormVisible = true
      this.form.id = ''
      this.form.name = ''
      this.form.author = ''
      this.form.university = ''
      this.form.foreword = ''
      this.form.special = ''
      this.form.downNum = ''
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true
      this.form.id = row.id
      this.form.name = row.name
      this.form.author = row.author
      this.form.university = row.university
      this.form.foreword = row.foreword
      this.form.special = row.special
      this.form.downNum = row.downNum
    },

    // 修改、增加用户信息
    async handleSet() {
      if (this.form.name !== '' && this.form.author !== '' && this.form.university !== '' && this.form.foreword !== '' && this.form.special !== '') {
        await editLiterature(this.form)
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
          await deleteLiterature(id)
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
