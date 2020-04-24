export const state = function() {
  return {
    searchList: []
  };
};
export const mutations = {
  amendList(state, data) {
    state.searchList.unshift(data);
    if (state.searchList.length > 5) {
      state.searchList.length = 5;
    }
  }
};
