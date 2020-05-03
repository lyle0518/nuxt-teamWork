export const state = function(){
  return {
    // 存储草稿箱列表
    draftList:[]
  }
}

export const mutations = {
  setDraftList(state,data){
    state.draftList.unshift(data);
    if(state.draftList.length>5){
      state.draftList.length=5;
    }
  }
}