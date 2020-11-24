export default {
	max_file : 4,
	max_size: 4,
	file_extensions : ['JPEG' , 'JPG' , 'PNG'],
	facebook:{
		max_size: 5,
		max_character: 5000,
	},
	instagram :{
		max_size: 0.1,
		max_image : 1,
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
	}
}