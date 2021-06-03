import Vue from 'vue'
import {
  Container,
  Header,
  Main,
  Footer,
  Button
} from 'element-ui'

import { ElementTiptapPlugin } from './element-tiptap/index.ts'
import 'element-tiptap/lib/index.css'
import 'element-ui/lib/theme-chalk/index.css'

export default ({ app }) => {
  Vue.use(Container)
  Vue.use(Header)
  Vue.use(Main)
  Vue.use(Footer)
  Vue.use(Button)
  Vue.use(ElementTiptapPlugin)
}
