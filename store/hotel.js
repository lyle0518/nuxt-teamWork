export const state = function() {
  return {
    hotelData: {
      data: []
    }, //酒店请求的详细数据
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
    longitude: "", //经度
    pageSize: 1, //当前页数
    total: "" //总页数
  };
};
export const mutations = {
  setHotelData(state, data) {
    state.hotelData = data;
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
  },
  setTotal(state, data) {
    state.total = data;
  },
  setPageSize(state, data) {
    state.pageSize = data;
  }
};
