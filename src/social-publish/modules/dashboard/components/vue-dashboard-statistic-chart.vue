<template>
	<div class="vue-dashboard-statistic-chart">
		<div id="social-publish-dashboard-chart"></div>
	</div>
</template>
<script>
	import ApexCharts from 'apexcharts'
	export default {
		name: "VueDashboardChart",
		props: {
			height: {
				type: [String, Number],
				default: "250",
			},
			label: {
				type: Array,
			},
			data: {
				type: Array,
			},
		},
		data() {
			return {
				chart: null,
			};
		},
		methods: {
			init() {
				var options = {
					series: [
						{
							name: "Post",
							data: this.data
						},
					],
					colors: ['#5b86e5'],
					chart: {
						type: "area",
						stacked: false,
						height: 250,
						zoom: {
							type: "x",
							enabled: false,
							autoScaleYaxis: false,
						},
						toolbar: {
							show: false
						},
					},
					legend :{
						show : false,
					},
					dataLabels: {
						enabled: false,
					},
					markers: {
						size: 0,
					},
					fill: {
						type: "gradient",
						gradient: {
							shadeIntensity: 1,
							inverseColors: false,
							opacityFrom: 0.5,
							opacityTo: 0,
							stops: [0, 90, 100],
						},
					},
					xaxis: {
						categories: this.label,
						labels : {
							show: true,
							formatter: (item)=>{
								return moment(item , 'YYYY-MM-DD').format('ddd')
							},
						},
						tooltip: {
							enabled: false
						}
					},
					yaxis: {
						show: false,
					},
					tooltip: {
						x : {
							formatter: (index) => {
								return index == 0 ? this.label[index]  : this.label[index - 1] 
							}
						},
						y: {
							formatter: (item) => parseInt(item)
						},
					},
				};

				var chart = new ApexCharts(document.querySelector("#social-publish-dashboard-chart"), options);
				chart.render();
			},
		},
		mounted() {
			this.init()
		},
		beforeDestroy() {
			// this.chart.destroy();
		},
	};
</script>