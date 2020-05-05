<template>
	<div>
		<el-row class="row" style="width: 1000px; margin: 0 auto; padding: 10 0;">
			<el-col :span="7" class="left">
				<div style="position: relative;" @mouseenter="show = true" @mouseleave="hans()" class="box">
					<div class="menus">
						<div class="menu_item" :class="indexs === index ? 'actives' : ''" v-for="(item, index) in likeList" :key="index" @mouseenter="han(index)">
							<span class="span1">{{ item.type }}</span>
							<span class="el-icon-arrow-right span2"></span>
						</div>
					</div>
					<div class="active" v-if="show">
						<ul>
							<li v-for="(item, index) in likeList[indexss].children" :key="index">
								<i>{{ index + 1 }}</i>
								<strong @click="recommed(item.city)">
									<nuxt-link to="#">{{ item.city }}</nuxt-link>
								</strong>
								<span @click="recommed(item.city)">
									<nuxt-link to="#">{{ item.desc }}</nuxt-link>
								</span>
							</li>
						</ul>
					</div>
				</div>
				<div class="recommed">
					<h4>推荐城市</h4>
					<div style="padding-bottom: 10px; border-bottom: 1px solid #ddd; margin-bottom: 10px;"></div>
					<img src="../../static/pic_sea.jpeg" @click="back()" />
				</div>
			</el-col>
			<el-col :span="17" class="right">
				<div class="right_top">
					<input type="text" class="input" placeholder="请输入想去的地方，比如：'广州'" v-model="city" />
					<span class="el-icon-search span3" @click="handSearch"></span>
				</div>
				<div class="search-recommend">
					<span class="span4">推荐：</span>
					<span class="span4_1" @click="recommedCity('广州')">广州</span>
					<span class="span4_1" @click="recommedCity('上海')">上海</span>
					<span class="span4_1" @click="recommedCity('北京')">北京</span>
				</div>
				<div class="post_title">
					<h4 class="h4">推荐攻略</h4>
					<el-button type="primary" class="button" @click="$router.push('/post/create')">
						<span class="el-icon-edit span5"></span>
						写游记
					</el-button>
					<div class="line"></div>
				</div>
				<div v-for="(item, index) in lists" :key="index">
					<postItem1 v-if="item.images.length >= 3" :data="item"></postItem1>
					<postItem2 v-if="item.images.length < 3 && item.images.length > 0" :data="item"></postItem2>
					<postItem3 v-if="item.images.length === 0" :data="item"></postItem3>
				</div>
				<el-pagination
					v-if="pageShow"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page.sync="pageIndex"
					:page-sizes="[3, 5, 10, 15]"
					:page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="totals"
					class="el_p"
				></el-pagination>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import postItem1 from '@/components/post/postItem1.vue';
import postItem2 from '@/components/post/postItem2.vue';
import postItem3 from '@/components/post/postItem3.vue';
export default {
	components: {
		postItem1,
		postItem2,
		postItem3
	},
	data() {
		return {
			lists: [],
			pageIndex: 1,
			pageSize: 3,
			city: '',
			show: false,
			indexs: '',
			likeList: [],
			indexss: 0,
			totals: 0,
			pageShow:false
		};
	},
	beforeRouteEnter (to, from, next) {
		console.log(from)
		if(from.path !== '/post/detail'){
		next(vm => {
				vm.pageIndex = 1
				vm.request()
		})
		}else{
			next()
		}
	},
	watch:{
		'$route.query'(){
			// console.log(this.$route.query)
			if(this.$route.query.start === '0' && this.$route.query.limit === '3'){
				this.pageIndex = 1
				this.$store.commit('post/setcurrentIndex',1)
				this.request()
			}
		}
	},
	mounted() {
		const limits = this.$route.query.limit
		const cityss = this.$route.query.city
		console.log(!cityss)
		if(this.$route.query.start === '0' && +limits >= 3 && !cityss){
			this.$store.commit('post/setcurrentIndex',1)
			this.$store.commit('post/setcurrentSize',3)
			this.$store.commit('post/setCity','')
		}
		this.city = this.$store.state.post.city
		this.pageIndex = this.$store.state.post.currentIndex || 1
		this.pageSize = this.$store.state.post.currentSize || 3
		this.pageShow = true
		
		const datas = {
			url: '/posts'
		};
		if (this.city.trim() !== '' || this.$store.state.post.city !== '') {
			this.$store.commit('post/setCity',this.city)
			datas.params = {
				city: this.city,
				_start: (this.pageIndex - 1) * this.pageSize,
				_limit: this.pageSize
			}
			this.$router.push({
				query: {
					start: 0,
					limit: 3,
					city:this.$store.state.post.city
				}
			});
		} else {
			datas.params = {
				_start: (this.pageIndex - 1) * this.pageSize,
				_limit: this.pageSize
			}
			this.$router.push({
				query: {
					start: 0,
					limit: 3
				}
			});
		}
		this.$axios(datas).then(res => {
			this.totals = res.data.total;
			const { data } = res.data;
			this.lists = data;
		});
		
		
		this.$axios({
			url: '/posts/cities'
		}).then(res => {
			const { data } = res.data;
			this.likeList = data;
		});	
	},
	methods: {
		back() {
			this.city = '';
			this.pageIndex = 1;
			this.pageSize = 3
			this.$store.commit('post/setcurrentIndex',1)
			this.$store.commit('post/setcurrentSize',3)
			this.$store.commit('post/setCity','')
			this.request();
		},
		request() {
			const datas = {
				url: '/posts'
			};
			if (this.city.trim() !== '') {
				datas.params = {
					city: this.city,
					_start: (this.pageIndex - 1) * this.pageSize,
					_limit: this.pageSize
				};
				this.$router.push({
					query: {
						start: (this.pageIndex - 1) * this.pageSize,
						limit: this.pageSize,
						city: this.city
					}
				});
			} else {
				datas.params = {
					_start: (this.pageIndex - 1) * this.pageSize,
					_limit: this.pageSize
				};
				this.$router.push({
					query: {
						start: (this.pageIndex - 1) * this.pageSize,
						limit: this.pageSize
					}
				});
			}
			this.$axios(datas).then(res => {
				// console.log(res);
				this.totals = res.data.total;
				const { data } = res.data;
				this.lists = data;
				// this.list = data.slice((this.pageIndex - 1 )* this.pageSize,this.pageIndex * this.pageSize);
			});
		},
		recommedCity(data) {
			this.city = data;
			this.$store.commit('post/setCity',data)
			this.pageIndex = 1;
			this.request();
		},
		handleSizeChange(val) {
			this.pageIndex = 1;
			this.$store.commit('post/setcurrentIndex',1)
			this.$store.commit('post/setcurrentSize',val)
			this.pageSize = val;
			this.request();
		},
		handleCurrentChange(val) {
			this.pageIndex = val;
			this.$store.commit('post/setcurrentIndex',val)
			this.request();
		},
		handSearch() {
			this.$store.commit('post/setCity',this.city)
			this.pageIndex = 1;
			this.$store.commit('post/setcurrentIndex',1)
			this.request();
		},
		han(val) {
			this.indexs = val;
			this.indexss = this.indexs;
		},
		hans() {
			this.show = false;
			this.indexs = '';
			this.indexss = 0;
		},
		recommed(city) {
			this.$store.commit('post/setCity',city)
			this.city = city;
			this.pageIndex = 1;
			this.$store.commit('post/setcurrentIndex',1)
			this.request();
		}
	}
};
</script>

<style lang="less" scoped>
.row {
	padding: 20px 0;
	.left {
		// border: 1px solid #000;
		// height: 100px;
		padding-right: 28px;
		position: relative;
		.box {
			.menus {
				width: 260px;
				border: 1px solid #ddd;
				border-right: 0;
				border-bottom: 0;
				border-left: 0;
				.menu_item {
					height: 40px;
					line-height: 40px;
					border-bottom: 1px solid #ddd;
					border-right: 1px solid #ddd;
					border-left: 1px solid #ddd;
					display: flex;
					justify-content: space-between;
					padding: 0 20px;
					align-items: center;
					position: relative;
					z-index: 3;
					.span1 {
						font-size: 14px;
					}
					.span2 {
						font-size: 22px;
						color: #999;
						margin-right: -10px;
					}
				}
				.actives {
					color: orange;
					border-right-color: #fff;
				}
			}
			.active {
				width: 350px;
				position: absolute;
				left: 259px;
				top: 0;
				border: 1px solid #ddd;
				z-index: 2;
				background: #fff;
				padding: 10px 20px;
				box-sizing: border-box;
				ul {
					li {
						line-height: 36px;
						color: #999;
						font-size: 14px;
						display: flex;
						align-items: center;
						i {
							font-style: italic;
							font-size: 24px;
							color: orange;
						}
						strong {
							font-weight: 400;
							margin: 0 10px;
							color: orange;
						}
						a:hover {
							text-decoration: underline;
						}
					}
				}
			}
		}

		.recommed {
			margin-top: 20px;
			h4 {
				font-weight: normal;
			}
			img {
				width: 100%;
			}
		}
	}
	.right {
		// border: 1px solid #f00;
		// height: 100px;
		padding-left: 10px;
		.right_top {
			position: relative;
			.input {
				width: 100%;
				border: 3px solid orange;
				box-sizing: border-box;
				height: 40px;
				padding: 0 20px;
			}
			.span3 {
				position: absolute;
				right: 15px;
				top: 8px;
				font-size: 24px;
				color: orange;
				font-weight: 700;
			}
		}
		.search-recommend {
			font-size: 12px;
			color: #666;
			padding: 10px 0;
			.span4 {
				margin-right: 5px;
			}
			.span4_1 {
				margin-right: 5px;
				&:hover {
					color: orange;
					border-bottom: 1px solid orange;
					cursor: pointer;
				}
			}
		}
		.post_title {
			padding-bottom: 10px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #eee;
			position: relative;
			.h4 {
				font-weight: 400;
				color: orange;
				font-size: 18px;
			}
			.line {
				position: absolute;
				bottom: 0;
				left: 0;
				height: 2px;
				width: 72px;
				background: orange;
			}
			.button {
				.span5 {
					margin-right: 5px;
				}
			}
		}
		.el_p {
			margin-top: 10px;
		}
	}
}
</style>
