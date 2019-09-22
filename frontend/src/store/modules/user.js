import _ from 'lodash';
import { Message } from 'element-ui';
import $request from '@/lib/request';

// user const
const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';
const REGISTER = 'REGISTER';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const REGISTER_FAILURE = 'REGISTER_FAILURE';
const ADD_SKILL = 'ADD_SKILL';
const ADD_SKILL_SUCCESS = 'ADD_SKILL_SUCCESS';
const ADD_SKILL_FAILURE = 'ADD_SKILL_FAILURE';
// endpoints
const LOGIN_ENDPOINT = 'user/login/';
const REGISTER_ENDPOINT = 'user/register/';
const ADD_SKILL_ENDPOINT = 'user/ID/addskill/';

const storedToken = localStorage.getItem('accessToken');
const storedUsername = localStorage.getItem('userName');
const storedUserID = localStorage.getItem('userID');
const storedUserSkills = JSON.parse(localStorage.getItem('userSkills'));

function _get_title_from_skill(skills) {
  var skills_titles = [];
  skills.forEach(element => {
    skills_titles.push(element.title);
  });
  return skills_titles;
};

// initial state
const state = {
  isLoggedIn: false,
  username: '',
  userid: 0,
  userskills: null,
  pendingLogin: false,
  isRegistered: false,
  pendingRegister: false,
  pendingAddSkill: false,
};

// getters
const getters = {
  isLoggedIn: state => state.isLoggedIn || !_.isEmpty(storedToken),
  username: state => state.username || (!_.isEmpty(storedToken) && storedUsername),
  userid: state => state.userid || (!_.isEmpty(storedToken) && storedUserID),
  userskills: state => state.userskills || (!_.isEmpty(storedToken) && storedUserSkills),
  pendingLogin: state => state.pendingLogin,
  isRegistered: state => state.isRegistered,
  pendingRegister: state => state.pendingRegister,
  pendingAddSkill: state => state.pendingAddSkill,
};

// actions
const actions = {
  login({
    commit,
  }, userInfo) {
    commit(LOGIN);
    return new Promise((resolve) => {
      $request.post(LOGIN_ENDPOINT, userInfo).then(({ id, token, username, skills}) => {
        // console.log("login res", username, storedUsername, skills);
        commit(LOGIN_SUCCESS, {
          id,
          token,
          username,
          skills
        });
        resolve();
      }).catch((error) => {
        commit(LOGIN_FAILURE);
        Message.error('Login failed, please retry!');
      });
    });
  },
  register({
    commit,
  }, userInfo) {
    commit(REGISTER);
    return new Promise((resolve) => {
      $request.post(REGISTER_ENDPOINT, userInfo).then((res) => {
        // console.log("register res", res);
        commit(REGISTER_SUCCESS);
        resolve();
      }).catch((error) => {
        commit(REGISTER_FAILURE);
        Message.error('Registrar failed, please retry!');
      });
    });
  },
  logout({
    commit,
  }) {
    commit(LOGOUT);
    Message({
      showClose: true,
      message: 'Log Out Successfully',
      type: 'success',
    })
  },
  addSkill({
    commit,
  }, payload) {
    commit(ADD_SKILL);
    return new Promise((resolve) => {
      const skills_json = JSON.stringify(payload.skills);
      const endpoint = ADD_SKILL_ENDPOINT.replace('ID', payload.id);
      // console.log(skills_json)
      $request.put(endpoint, { titles: skills_json }).then((res) => {
        // console.log('look at that: ', res);
        commit(ADD_SKILL_SUCCESS, res);
        Message.success('Add Skills done!');
        resolve();
      }).catch((error) => {
        commit(ADD_SKILL_FAILURE);
        Message.error('Add Skills failed, please retry!');
      });
    });
  }
};

// mutations
const mutations = {
  [LOGIN](state) {
    state.pendingLogin = true;
  },
  [LOGIN_SUCCESS](state, { id, token, username, skills }) {
    state.isLoggedIn = true;
    state.pendingLogin = false;
    state.username = username;
    state.userid = id;
    state.userskills = _get_title_from_skill(skills);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userName', username);
    localStorage.setItem('userID', id);
    localStorage.setItem('userSkills', JSON.stringify(state.userskills));
    // console.log("im in: ", storedUserSkills, storedUsername)
  },
  [LOGIN_FAILURE](state) {
    state.isLoggedIn = false;
    state.pendingLogin = false;
  },
  [REGISTER](state) {
    state.pendingRegister = true;
  },
  [REGISTER_SUCCESS](state) {
    state.isRegistered = true;
    state.pendingRegister = false;
  },
  [REGISTER_FAILURE](state) {
    state.isRegistered = false;
    state.pendingRegister = false;
  },
  [LOGOUT](state) {
    state.isLoggedIn = false;
    state.isRegistered = false;
    state.username = '';
    state.userid = 0;
    state.userskills = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userID');
    localStorage.removeItem('userSkills');
    window.location.reload(false);
  },
  [ADD_SKILL](state) {
    state.pendingAddSkill = true;
  },
  [ADD_SKILL_SUCCESS](state, res) {
    state.pendingAddSkill = false;
    state.userskills = _get_title_from_skill(res.skills);
    localStorage.setItem('userSkills', JSON.stringify(state.userskills));
    // console.log("name name: ", localStorage.getItem('userSkills'));
  },
  [ADD_SKILL_FAILURE](state) {
    state.pendingAddSkill = false;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
