import Vue from 'vue'
import router from './router'
import store from './store'
import './assets/CSS/base.scss'
import './assets/font/iconfont.css'
// 引入进度条
import 'nprogress/nprogress.css'
import VueQuillEditor from 'vue-quill-editor'

// require styles 引入富文本插件样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 引入全局的element-ui
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

// 引入eCharts
import myCharts from './components/echarts/myEcharts'
// 图片懒加载
import VueLazyload from 'vue-lazyload'
import App from './App.vue'

/*
  在单独引入element-ui组件的时候,有些组件是可以直接引入和use使用的,但是有一些例如Message和MessageBox是有区别的
  由于Vue.use是vue安装插件的一个方法,如果插件是一个对象，必须提供 install 方法。如果插件是一个函数，它会被作为 install方法。install 方法调用时，会将 Vue 作为参数传入。
  因此,例如Message和MessageBox其实是一个对象,所以无法直接使用use,必须为他提供一个install方法才能传入use,例如
   Message.install = function (Vue, options) {
       Vue.prototype.$message = Message
   }
  当然了,也可以在引入后直接使用挂到vue的prototype原型上进行全局使用,例如
    Vue.prototype.$msgbox = MessageBox
  那么调用的时候就
  this.$msgbox.alert('提示内容', '提示标题', {
   confirmButtonText: '确定',
     callback: action => {
   }})

  还有就是也可以不在全局使用,就是你在哪个组件用就在哪个组件引入即可,就不要挂载到原型上或者传入install方法
 */
import {
  Button,
  Select,
  Input,
  Checkbox,
  Form,
  FormItem,
  Row,
  Col,
  Tooltip,
  Menu, Submenu, MenuItem, MenuItemGroup,
  RadioGroup,
  RadioButton,
  Container,
  Aside,
  Table,
  Main,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Header,
  TableColumn,
  Card,
  Breadcrumb,
  BreadcrumbItem,
  Radio,
  Option,
  DatePicker,
  TimePicker,
  Popover,
  Tag,
  Pagination,
  Image,
  Upload,
  Dialog,
  Tabs,
  TabPane,
  Avatar,
  Message,
  MessageBox
} from 'element-ui'
Message.install = function (Vue, options) {
  Vue.prototype.$message = Message
}
MessageBox.install = function (Vue, options) {
  Vue.prototype.$confirm = MessageBox.confirm
}
Vue.use(Button)
Vue.use(Select)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tooltip)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Table)
Vue.use(Main)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Header)
Vue.use(TableColumn)
Vue.use(Card)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Radio)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Popover)
Vue.use(Tag)
Vue.use(Pagination)
Vue.use(Image)
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Avatar)
Vue.use(Message)
Vue.use(MessageBox)

Vue.use(myCharts)
Vue.use(VueLazyload, {
  loading: require('./assets/images/photo_err.gif'),
  error: require('./assets/images/photo_err.gif')
})
Vue.use(VueQuillEditor, {})

// Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
