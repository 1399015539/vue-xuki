<template class="wrapper">
  <el-container>
    <el-header class="header">
      <img src="../../assets/logo2.png" alt="" height="65">
    </el-header>
    <el-main class="main">
      <template>
        <div>
          <h1 style="text-align: center; margin: 60px">{{ this.list.name }}</h1>
          <template>
            <a-descriptions :column="1" style="text-align: center">
              <a-descriptions-item class="author">
                {{ this.list.author }}
              </a-descriptions-item>
              <a-descriptions-item>
                {{ this.list.university }}
              </a-descriptions-item>
            </a-descriptions>
            <a-descriptions :column="1">
              <a-descriptions-item>
                <p style="font-size: 15px;display: inline-block;font-weight : 900;line-height: 0px;color: #333;">摘要：</p>
                {{ this.list.foreword }}
              </a-descriptions-item>
              <a-descriptions-item>
                <p style="font-size: 15px;display: inline-block;font-weight : 900;line-height: 0px;color: #333;">
                  关键词：</p>
                {{ this.list.special }}
              </a-descriptions-item>
              <a-descriptions-item>
                <p style="font-size: 15px;display: inline-block;font-weight : 900;line-height: 0px;color: #333;">下载：</p>
                {{ this.list.downNum }} 次
              </a-descriptions-item>
              <a-descriptions-item>
                <p style="font-size: 15px;display: inline-block;font-weight : 900;line-height: 0px;color: #333;">收藏：</p>
                {{ this.list.storeNum }} 次
              </a-descriptions-item>
            </a-descriptions>
          </template>
        </div>
        <div class="button">
          <el-button type="success">
            <a-icon type="file-pdf" style="margin-left: -5px;margin-right: 0px;font-weight : 900;font-size: 15px;" />
            pdf下载
          </el-button>
          <el-button type="warning" style="margin-left: 30px">
            <a-icon type="ie-circle" style="margin-left: -5px;margin-right: 0px;font-weight : 900;font-size: 15px;" theme="filled" />
            html在线阅读</el-button>
          <el-button type="danger" style="margin-left: 30px">
            <a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96" style="margin-left: -5px;margin-right: 0px;font-weight : 900;font-size: 15px;" />
            收藏</el-button>
        </div>
        <canvas v-for="page in pages" :id="'the-canvas'+page" :key="page" />
      </template>
    </el-main>
  </el-container>
</template>

<script>
import { selectLiteratureById } from '@/service/literature'
import { Descriptions } from 'ant-design-vue'
// import PDFJS from 'pdfjs-dist'

export default {
  components: {
    'a-descriptions': Descriptions,
    'a-descriptions-item': Descriptions.Item
  },
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
      list: null,
      id: null,
      pages: '',
      listLoading: true,
      url: '',
      minHeight: 0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // _renderPage(num) {
    //   this.pdfDoc.getPage(num).then((page) => {
    //     const canvas = document.getElementById('the-canvas' + num)
    //     const ctx = canvas.getContext('2d')
    //     const dpr = window.devicePixelRatio || 1
    //     const bsr = ctx.webkitBackingStorePixelRatio ||
    //       ctx.mozBackingStorePixelRatio ||
    //       ctx.msBackingStorePixelRatio ||
    //       ctx.oBackingStorePixelRatio ||
    //       ctx.backingStorePixelRatio || 1
    //     const ratio = dpr / bsr
    //     const viewport = page.getViewport(screen.availWidth / page.getViewport(1).width)
    //     canvas.width = viewport.width * ratio
    //     canvas.height = viewport.height * ratio
    //     // canvas.style.width = viewport.width + 'px'
    //     canvas.style.width = 6 + 'rem' // 设置宽度
    //     // canvas.style.height = viewport.height + 'px'  //设置高度，可以不设
    //     ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    //     const renderContext = {
    //       canvasContext: ctx,
    //       viewport: viewport
    //     }
    //     page.render(renderContext)
    //     if (this.pages > num) {
    //       this._renderPage(num + 1)
    //     }
    //   })
    // },
    // _loadFile(url) {
    //   PDFJS.getDocument(url).then((pdf) => {
    //     this.pdfDoc = pdf
    //     this.pages = this.pdfDoc.numPages
    //     this.$nextTick(() => {
    //       this._renderPage(1)
    //     })
    //   })
    // },
    fetchData() {
      this.listLoading = true
      this.id = this.$route.query.detailRowMessage
      selectLiteratureById(this.id).then(response => {
        console.log('data:', response.data)
        this.list = response.data
        this.listLoading = false
      })
      // this._loadFile('http://localhost:9090/literature/pdf')
    }
  }
}
</script>

<style>

.el-header, .el-footer {
  background-color: #246fdd;
  color: white;
  line-height: 60px;
  flex: 0;
  font-size: 30px;
}

.el-main {
  background-color: white;
  color: #333;
  /*text-align: center;*/
  line-height: 30px;
  flex: 1;
  border: 1px solid #cbcbcb;
  margin: 40px 40px 40px 40px;
}

.ant-descriptions-item-content {
  display: inline-block;
  line-height: 30px;
  margin-left: 120px;
  margin-right: 120px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container {
  background-color: #eeeeee;
}

.button {
  text-align: right;
  margin-right: 120px;
  margin-top: 60px;
}

.el-button--warning {
  background-color: #dc6f45;
  color: white;
  border-color: #ff8350;
}

.el-button--danger {
  background-color: #d16690;
  color: white;
  border-color: #e36d9d;
}

</style>
