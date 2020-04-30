export const state = function() {
  return {
    hotelList: [],
    hotelForm: {
      //切换城市
      city: "",
      //入店时间
      enterTime: "",
      //离店
      leftTime: ""
    }
  };
};
export const mutations = {
  setHotelList(state, data) {
    state.hotelList = data;
  },
  setHotelForm(state, data) {
    state.hotelForm = data;
  },
  setHotelFormCity(state, data) {
    state.hotelForm.city = data;
  }
};
