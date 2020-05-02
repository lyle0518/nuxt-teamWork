<template>
	<div class="post_list">
		<div class="list_item">
			<div class="item_left">
				<nuxt-link :to="{
					path:'/post/detail',
					query:{
						id:data.id
					}
				}">
					<img style="width: 220px; height: 150px;object-fit:cover;" :src="data.images[0]">
				</nuxt-link>
			</div>
			<div class="item_right">
				<h4 class="item_h4">
					<nuxt-link :to="{
					path:'/post/detail',
					query:{
						id:data.id
					}
				}">
						{{data.title}}
					</nuxt-link>
				</h4>
				<p class="p">
					<nuxt-link :to="{
					path:'/post/detail',
					query:{
						id:data.id
					}
				}">
						{{data.summary}}
					</nuxt-link>
				</p>
				<div class="item_bottom">
					<div class="bottom_left">
						<div class="span6">
							<span class="el-icon-location-outline"></span>
							<span>{{data.cityName}}</span>
						</div>
						<span class="span6">by</span>
						<nuxt-link to="#"><img :src="$axios.defaults.baseURL + data.account.defaultAvatar" class="img3"></nuxt-link>
						<nuxt-link to="#" class="span6" style="color: #FFA500;">{{data.account.nickname}}</nuxt-link>
						<div class="span6">
							<span class="el-icon-view"></span>
							<span>{{data.watch}}</span>
						</div>
					</div>
					<span class="bottom_right">{{data.like || '0'}} 赞</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		props:{
			data:{
				type:Object
			}
		}
	}
</script>

<style scoped lang="less">
	.post_list{
		border-bottom: 1px solid #eee;
		.list_item{
			padding: 20px 0;
			display: flex;
			align-items: center;
			.item_left{
				margin-right: 10px;
			}
			.item_right{
				flex: 1;
				.item_h4{
					font-weight: 400;
					font-size: 18px;
					margin-bottom: 15px;
					a:hover{
						color: orange;
					}
				}
				.p{
					font-size: 14px;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					color: #666;
					margin-bottom: 15px;
					height: 60px;
				}
				.item_bottom{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.bottom_left{
						display: flex;
						align-items: center;
						.img3{
							width: 16px;
							height: 16px;
							display: block;
							margin-right: 2px;
						}
						.span6{
							margin-right: 10px;
							font-size: 12px;
							color: #999;
						}
					}
					.bottom_right{
						font-size: 16px;
						color: orange;
					}
				}
			}
			
		}
	}
</style>
