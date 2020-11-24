<template>
	<div class="vue-dashboard-timeline">
		<h3>
			{{ $t('dashboard.title.timeline') }}
		</h3>
		<div class="vue-dashboard-timeline-wrap">
			<div class="vue-dashboard-timeline-header">
				{{ title }}
			</div>
			<div class="vue-dashboard-timeline-body">
				<div v-for="(item, index) in data" :key="`timeline_index_${index}`" class="item-timeline">
					<div class="item-timeline-content">
						<div class="item-timeline-date m-b-8">
							{{ item.time }}
						</div>
						<div class="item-timeline-header">
							<div class="item-timeline-header-icon">
								{{ item.icon }}
							</div>
							<div class="item-timeline-header-title">
								{{ item.title }}
							</div>
						</div>
						<div class="item-timeline-body" v-html="item.content"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faStar ,} from "@fortawesome/pro-solid-svg-icons";
var svg_star = icon(faStar).html.first()
export default {
	name : 'VueDashboardTimeline',
	data(){
		return {
			title : '2020',
			data : [
				{
					time : 'Jan 2020',
					icon : 'Q1',
					title : 'Get start',
					content : `
						<p><strong>Autopilot</strong><i class="text-warning">${svg_star}</i></p><p>Queue</p>
					`
				},
				{
					time : 'Apr',
					icon : 'Q2',
					title : 'Smarter Autopilot',
					content : `
						<p>Integrate with Bit.ly to shorten all links</p>
						<p>Custom URL builder for tracking campaign</p>
						<p><strong>Autopilot version 2</strong> <i class="text-warning">${svg_star}</i></p>
						<p>Free Socialpublish shorten link</p>
						<p>New Dashboard</p>
						<p>Generating Media<i class="text-warning">${svg_star}</i></p>
						<p>Manage all posts on your social accounts</p>
					`
				},
				{
					time : 'Jul',
					icon : 'Q3',
					title : 'Performance Metrics',
					content : `
						<p><strong>Insights ver.1</strong> <i class="text-warning">${svg_star}</i></p>
						<p><strong>Post with a video</strong> <i class="text-warning">${svg_star}</i></p>
						<p><strong>New Autopilot Type</strong> <i class="text-warning">${svg_star}</i></p>
					`
				},
				{
					time : 'Oct',
					icon : 'Q4',
					title : 'Social Analytics',
					content : `
						<p><strong>Amazing Insights v2 which will help you manage page and campaign performance</strong> <i class="text-warning">${svg_star}</i></p>
						<p>Autopilot v3 with dynamic medias</p>
					`
				},
			]
		}
	}
}
</script>
<style lang="scss">
	.vue-dashboard-timeline{
		// position: relative;
		&-wrap{
			border:1px solid $light-gray3;
			border-radius: 4px;
			background-color: $light-gray5;
		}
		&-header{
			height:50px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: 600;
			font-size: 20px;
			line-height: 24px;
		}
		&-body{
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			padding: 4px 4px 8px;
		}
		.item-timeline{
			width: 25%;
			position: relative;
			padding: 0 4px;
			&-content{
				// padding: 0 4px;
				background: #fff;
				height: 100%;
				border-radius: 4px;
			}
			&-date{
				color: $dark-gray3;
			}
			&-header{
				border-radius: 4px;
				position: relative;
				padding-left: 45px;
				margin-bottom: 8px;
				height: 34px;
				display: flex;
				align-items: center;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				background-color: $light-blue2;
				&-icon{
					width: 31px;
					height: 26px;
					top: 3px;
					left: 3px;
					border-radius: 4px;
					position: absolute;
					font-weight: 600;
					font-size: 12px;
					line-height: 14px;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: $primary-color;
					color: #fff;
				}
				&-title{
					font-weight: 600;
					font-size: 14px;
					line-height: 17px;
					color: $primary-color;
				}
			}
			&-body{
				padding: 8px;
				border-left: 2px solid $light-blue1;
				font-size: 14px;
				p{
					margin-bottom: 8px;
					i{
						margin-left: 4px;
					}
				}
			}
			&-content{
				// height: calc(100% - 30px);
				// overflow: hidden auto;
				padding: 12px 8px;
			}
		}
	}
</style>