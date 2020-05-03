export const state = function() {
  return {
    hotelList: "",
    pushUrl: {
      //切换城市
      cityName: "",
      //入店时间
      enterTime: "",
      //离店
      leftTime: ""
    },
    //区域列表
    area: [],
    //地图中心点数据
    latitude: "", //纬度
    longitude: "" //经度
  };
};
export const mutations = {
  setHotelList(state, data) {
    state.hotelList = data;
  },
  setPushUrl(state, data) {
    state.hotelForm = data;
  },
  setHotelFormCity(state, data) {
    state.hotelForm.city = data;
  },
  setArea(state, data) {
    state.area = data;
  },
  setLatitude(state, data) {
    state.latitude = data;
  },
  setLongitude(state, data) {
    state.longitude = data;
  }
};
