<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-input
        v-model="searchName"
        clearable
        placeholder="输入用户名称搜索"
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
      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sex === 1">男</span>
          <span v-else-if="scope.row.sex === 2">女</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.role === 1">管理员</span>
          <span v-else-if="scope.row.role === 2">普通用户</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
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
      title="用户编辑"
      :visible.sync="dialogFormVisible"
      width="500px"
      top="50px"
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model="form.id" auto-complete="off" :disabled="true" />
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
          <el-input ref="name" v-model="form.name" placeholder="请输入用户名" auto-complete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input ref="password" v-model="form.password" placeholder="请输入密码" auto-complete="off" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <div class="boy">
            <input v-model="form.sex" type="radio" name="radios" value="1"><label>男</label>
          </div>
          <div class="girl">
            <input v-model="form.sex" type="radio" name="radios" value="2"><label>女</label>
          </div>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="role" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!--                <el-input v-model="form.role" auto-complete="off"></el-input>-->
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" auto-complete="off" />
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phone" auto-complete="off" />
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
import { search, selectUserList } from '@/service/table'
import { deleteUser, editUser } from '@/service/validate'

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
          callback(new Error('用户名不能为空'))
        }
      } catch (err) {
        this.$message.error(err.message)
      }
    }
    const validatePassword = (rule, value, callback) => {
      try {
        if (value) {
          callback()
        } else {
          callback(new Error('密码不能为空'))
        }
      } catch (err) {
        this.$message.error(err.message)
      }
    }
    const validateSex = (rule, value, callback) => {
      try {
        if (value) {
          callback()
        } else {
          callback(new Error('请选择性别'))
        }
      } catch (err) {
        this.$message.error(err.message)
      }
    }
    return {
      currentPage: 1, // 初始页
      pagesize: 5, //    每页的数据
      total: 0,
      roles: [{
        value: '1',
        label: '管理员'
      }, {
        value: '2',
        label: '普通用户'
      }],
      role: '',
      searchName: '',
      dialogFormVisible: false,
      form: {
        id: '',
        name: '',
        password: '',
        sex: '',
        role: '',
        email: '',
        phone: ''
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入用户名', validator: validateName }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        sex: [{ required: true, trigger: 'blur', validator: validateSex }]
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
      selectUserList(this.searchName, (this.currentPage - 1) * this.pagesize, this.pagesize).then(response => {
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
      this.form.name = ''
      this.form.password = ''
      this.form.sex = ''
      this.form.role = ''
      this.form.email = ''
      this.form.phone = ''
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true
      this.form.id = row.id
      this.form.name = row.name
      this.form.password = row.password
      this.form.sex = row.sex
      if (row.role === 1) {
        this.role = '管理员'
      } else if (row.role === 2) {
        this.role = '普通用户'
      }
      this.form.role = row.role
      this.form.email = row.email
      this.form.phone = row.phone
    },

    // 修改、增加用户信息
    async handleSet() {
      if (this.form.name !== '' && this.form.password !== '' && this.form.sex !== '' && this.role !== '') {
        if (this.role === '管理员') {
          this.form.role = 1
        } else if (this.role === '普通用户') {
          this.form.role = 2
        } else {
          this.form.role = this.role
        }
        await editUser(this.form)
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
          await deleteUser(id)
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
