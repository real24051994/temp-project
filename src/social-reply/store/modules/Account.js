import { Select } from "ant-design-vue";
import api from "../../utils/api";

const types = {
  RESET: "RESET",

  UPDATE_LIST_ACCOUNTS: "UPDATE_LIST_ACCOUNTS",
  REMOVE_ACCOUNT: "REMOVE_ACCOUNT",
  SET_ACCOUNT: "SET_ACCOUNT",

  UDPATE_ITEM: "UDPATE_ITEM",
};

const getDefaultState = () => {
  return {
    total: 0,
    accounts: [],

    selectedAccount: {},
  };
};

export const state = getDefaultState;

const mutations = {
  [types.UPDATE_LIST_ACCOUNTS](state, items) {
    state.accounts = JSON.parse(JSON.stringify(items));
    // For test
    state.accounts[1].connect_error = {
      message: "Error test",
    };
    if (
      Object.keys(state.selectedAccount).length === 0 &&
      state.accounts.length > 0
    ) {
      state.selectedAccount = Object.assign({}, state.accounts[0]);
    }
  },

  [types.REMOVE_ACCOUNT](state, social_id) {
    const index = state.accounts.findIndex(
      (item) => item.social_id == social_id
    );
    if (index >= 0) {
      state.accounts.splice(index, 1);
    }
    state.accounts = JSON.parse(JSON.stringify(state.accounts));
    if (
      Object.keys(state.selectedAccount).length > 0 &&
      state.selectedAccount.social_id === social_id
    ) {
      if (state.accounts.length > 0) {
        state.selectedAccount = Object.assign({}, state.accounts[0]);
      } else {
        state.selectedAccount = new Object();
      }
    }
  },

  [types.UDPATE_ITEM](state, payload) {
    const index = state.accounts.findIndex(
      (item) => item.social_id == payload.social_id
    );

    if (index >= 0) {
      state.accounts[index] = Object.assign(state.accounts[index], payload);
    }
    state.accounts = JSON.parse(JSON.stringify(state.accounts));
  },

  [types.SET_ACCOUNT](state, social_id) {
    const index = state.accounts.findIndex(
      (item) => item.social_id == social_id
    );
    state.selectedAccount = Object.assign({}, state.accounts[index]);
  },

  [types.RESET](state) {
    const _state = JSON.parse(JSON.stringify(getDefaultState()));
    Object.assign(state, _state);
  },
};

const actions = {
  async fetchAccounts({ commit }) {
    const data = await api.getListSocial();
    commit(types.UPDATE_LIST_ACCOUNTS, data.data);
    return data.data;
  },

  async setAccount({ commit }, social_id) {
    commit(types.SET_ACCOUNT, social_id);
  },

  async removeAccount({ commit }, social_id) {
    let rs = await api.removeSocial({ social_id });
    commit(types.REMOVE_ACCOUNT, social_id);
    return rs;
  },

  async update({ commit }, payload) {
    commit(types.UDPATE_ITEM, payload);
  },

  async uninstall({ commit }, social_account_id) {
    try {
      let rs = await api.SOCIAL.uninstall(social_account_id);

      if (rs && rs.data) {
        rs.data.forEach((acc) => {
          commit(types.UDPATE_ITEM, acc);
        });
      }
    } catch (error) {}
  },
};

const getters = {
  getAccounts: (state) => {
    let arr = JSON.parse(JSON.stringify(state.accounts)) || [];
    return arr.sort(function(a, b) {
      return a.id - b.id;
    });
  },

  getAll: (state) => {
    let arr = JSON.parse(JSON.stringify(state.accounts)) || [];
    return arr.sort(function(a, b) {
      return a.id - b.id;
    });
  },

  getSelectedAccount: (state) => {
    return state.selectedAccount;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
