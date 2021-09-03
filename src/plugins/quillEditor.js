import VueQuillEditor from 'vue-quill-editor'; // 富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default Vue=> {
  Vue.use(VueQuillEditor);
}