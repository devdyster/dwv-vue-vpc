import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
require('jquery')
require('popper.js')
require('bootstrap')
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import 'bootstrap/dist/css/bootstrap.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolder , faImage ,faArrowLeft,faUpload,faSync} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faFolder)
library.add(faImage)
library.add(faArrowLeft)
library.add(faUpload)
library.add(faSync)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
