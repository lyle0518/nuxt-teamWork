export const state = function() {
  return {
    searchList: [],
    //存储当前机票的信息
    flightData: {
      seat_infos: {}
    },
    //总价格
    allPrice: 0,
    //乘机人数量
    airLength: 1
  };
};
export const mutations = {
  amendList(state, data) {
    state.searchList.unshift(data);
    if (state.searchList.length > 5) {
      state.searchList.length = 5;
    }
  },
  setFlightData(state, data) {
    state.flightData = data;
  },
  setAllPrice(state, data) {
    state.allPrice = data;
  },
  setAirLength(state, data) {
    state.airLength = data;
  }
};
