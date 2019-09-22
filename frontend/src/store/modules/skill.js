import { Message } from 'element-ui';
import $request from '@/lib/request';

// user
const GET_SKILL = 'GET_SKILL';
const GET_SKILL_SUCCESS = 'GET_SKILL_SUCCESS';
const GET_SKILL_FAILURE = 'GET_SKILL_FAILURE';
const CREATE_SKILL = 'CREATE_SKILL';
const CREATE_SKILL_SUCCESS = 'CREATE_SKILL_SUCCESS';
const CREATE_SKILL_FAILURE= 'CREATE_SKILL_FAILURE';
// endpoints
const GET_SKILL_ENDPOINT = 'skill/';
const CREATE_SKILL_ENDPOINT = 'skill/create/';

// initial state
const state = {
  skills: [],
  pending: false,
  pendingCreate: false,
};

// getters
const getters = {
  skills: state => state.skills,
  pending: state => state.pending,
  pendingCreate: state => state.pendingCreate,
};

// actions
const actions = {
  getSkill({
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
  createSkill({
    commit,
  }, title) {
    commit(CREATE_SKILL);
    return new Promise((resolve) => {
      $request.post(CREATE_SKILL_ENDPOINT, { title: title }).then((res) => {
        commit(CREATE_SKILL_SUCCESS);
        Message.success(`Create the skill ${title} successfully`);
        resolve();
      }).catch((error) => {
        commit(CREATE_SKILL_FAILURE);
        Message.error('Create skills failed, please retry!');
        Message.error(`Error: ${error}`);
      });
    });
  }
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
  },
  [CREATE_SKILL](state) {
    state.pendingCreate = true;
  },
  [CREATE_SKILL_SUCCESS](state) {
    state.pendingCreate = false;
  },
  [CREATE_SKILL_FAILURE](state) {
    state.pendingCreate = false;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
