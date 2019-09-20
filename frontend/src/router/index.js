import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui';
import SkillPicker from '@/components/SkillPicker';
import Login from '@/components/Login';
import Profile from '@/components/Profile';
import store from '@/store';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'SkillPicker',
      component: SkillPicker,
      meta: { auth: true, title: 'SkillPicker' },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { auth: true, title: 'Profile' },
    },
    {
      path: '*',
      redirect: '/',
    }
  ]
});

// console.log(router);
router.beforeEach((to, from, next) => {
  if (to.meta.auth && !store.getters.isLoggedIn) {
    Message.info('Please login to proceed.');
    next('login');
  } else {
    next();
  }
});

router.afterEach(() => {
  // scroll window to the top after router changes
  window.scrollTo(0, 0);
});

export default router;