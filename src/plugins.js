import AFTableColumn from 'af-table-column'
import TreeTable from "vue-table-with-tree-grid"
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  install(Vue) {
    //安装 af-table-column 表格自适应插件
    Vue.use(AFTableColumn)
    //注册 vue-table-with-tree-grid 表格树状结构
    Vue.component("tree-table", TreeTable)
    //使用 vue-quill-editor 文档
    Vue.use(VueQuillEditor)
  }
}