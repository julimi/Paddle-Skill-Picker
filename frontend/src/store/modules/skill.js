import { Message } from 'element-ui';
import $request from '@/lib/request';

// user
const GET_SKILL = 'GET_SKILL';
const GET_SKILL_SUCCESS = 'GET_SKILL_SUCCESS';
const GET_SKILL_FAILURE = 'GET_SKILL_FAILURE';
// endpoints
const GET_SKILL_ENDPOINT = 'skill/';

// initial state
const state = {
  skills: [],
  pending: false,
};

// getters
const getters = {
  skills: state => state.skills,
  pending: state => state.pending,
};

// actions
const actions = {
  getSkill({
    state,
    commit,
  }) {
    commit(GET_SKILL);
    return new Promise((resolve) => {
      $request.get(GET_SKILL_ENDPOINT).then((res) => {
        // console.log("normal get res", res.results);
        commit(GET_SKILL_SUCCESS, res.results);
        resolve();
      }).catch((error) => {
        commit(GET_SKILL_FAILURE);
        Message.error('Get skills failed, please retry!');
      });
    });
  },
  getSkillWithQuery({
    state,
    commit,
  }, query) {
    commit(GET_SKILL);
    return new Promise((resolve) => {
      $request.get(GET_SKILL_ENDPOINT, { search: query }).then((res) => {
        // console.log("get res", res.results);
        commit(GET_SKILL_SUCCESS, res.results);
        resolve();
      }).catch((error) => {
        commit(GET_SKILL_FAILURE);
        Message.error('Get skills failed, please retry!');
      });
    });
  },
};

// mutations
const mutations = {
  [GET_SKILL](state) {
    state.pending = true;
  },
  [GET_SKILL_SUCCESS](state, res) {
    state.skills = res;
    state.pending = false;
  },
  [GET_SKILL_FAILURE](state) {
    state.skills = [];
    state.pending = false;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
