import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import IndexPage from './pages/index'
import DetailPage from './pages/detail'

Vue.use(VueRouter)
let router = new VueRouter({
	mode: 'hash',
	routes: [
		{
			path: '/',
			component: IndexPage
		},
		{
			path: '/detail/:id',
			component: DetailPage
		}
	]
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
	template: '<App/>',
  components: { App }
})
