export default {
	max_file : 4,
	max_size: 4,
	file_extensions : ['JPEG' , 'JPG' , 'PNG'],
	facebook:{
		max_size: 0.1,
		max_character: 5000,
	},
	instagram :{
		max_size: 0.1,
		min_width : 150,
		min_height: 150,
		max_width : 1920,
		max_height: 1080,
		min_aspect_ratio : 0.8,
		max_aspect_ratio : 1.91,
		max_character: 2200,
	},
	twitter  :{
		max_size: 4,
		min_width : 4,
		min_height: 4,
		max_width : 2048,
		max_height: 2048,
		max_character: 280,
	},
	product_variants: ['PRODUCT_URL','PRODUCT_TITLE','VENDOR_NAME','LOWEST_PRICE','PRODUCT_TAGS','STORE_URL'],
	rate_tags : ['REVIEW_RATING','REVIEWER_NAME' ,'REVIEW_BODY','REVIEW_RATING_ICON' ,'COUNTRY_REVIEWER' ,'PRODUCT_URL'],
	discount_tags : ['DISCOUNT_CODE','DISCOUNT_PERCENTAGE','VALID_TIME'],
	discount_valid_times : [
		{
			id : 1,
			text: '1 Day'
		},
		{
			id : 2,
			text: '2 Days'
		},
		{
			id : 3,
			text: '3 Days'
		}
	],
	discount_sizes: [
		{
			id : 1,
			text : 'Small',
			value :  200 
		},
		{
			id : 2,
			text : 'Medium',
			value :  300 
		},
		{
			id : 3,
			text : 'Large',
			value :  400 
		}
	],
	discount_margins: [
		{
			id : 1,
			text : 'None',
			value : 0,
		},
		{
			id : 2,
			text : 'Medium',
			value : 40,
		},
		{
			id : 3,
			text : 'Large',
			value : 80,
		}
	],
	discount_positions : [
		{
			id : 1,
			value : 'top_left',
			text : 'Top left',
			sample : require('./assets/position/top-left.png'),
		},
		{
			id : 2,
			value : 'top_center',
			text : 'Top center',
			sample : require('./assets/position/top-center.png'),
		},
		{
			id : 3,
			value : 'top_right',
			text : 'Top right',
			sample : require('./assets/position/top-right.png'),
		},
		{
			id : 4,
			value : 'left_center',
			text : 'Left center',
			sample : require('./assets/position/left-center.png'),
		},
		{
			id : 5,
			value : 'right_center',
			text : 'Right center',
			sample : require('./assets/position/right-center.png'),
		},
		{
			id : 6,
			value : 'bottom_left',
			text : 'Bottom left',
			sample : require('./assets/position/bottom-left.png'),
		},
		{
			id : 7,
			value : 'bottom_center',
			text : 'Bottom center',
			sample : require('./assets/position/bottom-center.png'),
		},
		{
			id : 8,
			value : 'bottom_right',
			text : 'Bottom right',
			sample : require('./assets/position/bottom-right.png'),
		},
	],
	logo_sizes: [
		{
			id : 1,
			text : 'Small',
			value :  200 
		},
		{
			id : 2,
			text : 'Medium',
			value :  300 
		},
		{
			id : 3,
			text : 'Large',
			value :  400 
		}
	],
	logo_margins: [
		{
			id : 1,
			text : 'None',
			value : 0,
		},
		{
			id : 2,
			text : 'Medium',
			value : 40,
		},
		{
			id : 3,
			text : 'Large',
			value : 80,
		}
	],
	logo_positions : [
		{
			id : 1,
			value : 'top_left',
			text : 'Top left',
			sample : require('./assets/position/top-left.png'),
		},
		{
			id : 2,
			value : 'top_center',
			text : 'Top center',
			sample : require('./assets/position/top-center.png'),
		},
		{
			id : 3,
			value : 'top_right',
			text : 'Top right',
			sample : require('./assets/position/top-right.png'),
		},
		{
			id : 4,
			value : 'left_center',
			text : 'Left center',
			sample : require('./assets/position/left-center.png'),
		},
		{
			id : 5,
			value : 'right_center',
			text : 'Right center',
			sample : require('./assets/position/right-center.png'),
		},
		{
			id : 6,
			value : 'bottom_left',
			text : 'Bottom left',
			sample : require('./assets/position/bottom-left.png'),
		},
		{
			id : 7,
			value : 'bottom_center',
			text : 'Bottom center',
			sample : require('./assets/position/bottom-center.png'),
		},
		{
			id : 8,
			value : 'bottom_right',
			text : 'Bottom right',
			sample : require('./assets/position/bottom-right.png'),
		},
	]
}