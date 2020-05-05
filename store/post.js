export const state = function () {
	return {
		// 存储草稿箱列表
		draftList: [],
		currentIndex: '',
		currentSize: '',
		city: ''
	}
}

export const mutations = {
	setDraftList(state, data) {
		state.draftList.unshift(data);
		if (state.draftList.length > 5) {
			state.draftList.length = 5;
		}
	},
	setcurrentIndex(state, data) {
		state.currentIndex = data
	},
	setcurrentSize(state, data) {
		state.currentSize = data
	},
	setCity(state, data) {
		state.city = data
	}
}