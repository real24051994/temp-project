<template>
	<div id="social-widget" class="sw-instagram">
		<div class="sw-instagram-header">
			<div class="sw-instagram-header-title">
				 Follow Us on Instagram 
			</div>
		</div>
		<div class="sw-instagram-body">
			<div class="sw-instagram-row">
				<div class="sw-instagram-col" v-for="item in data" :key="item.id">
					<a href="#" class="sw-instagram-item sw-instagram-default" :data-id="item.id">
						<div class="sw-instagram-item-img" :style="{ backgroundImage : 'url(' + item.media_url + ')' }"></div>
						<div class="sw-instagram-item-overlay">

						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import '../styles/store-widget.scss'
export default {
	name: "VueCreateWidgetPreview",
	data() {
		return {
			data: [
				{
					id: 17873391562580978,
					media_type: "IMAGE",
					media_url:
						"https://scontent.xx.fbcdn.net/v/t51.2885-15/84253002_1070114283367430_7037079694337036250_n.jpg?_nc_cat=105&_nc_sid=8ae9d6&_nc_ohc=Wh3-AOPMaVYAX-1D9G9&_nc_ht=scontent.xx&oh=be333916ffd1e8d58048612a81dc5884&oe=5E8D21D1",
					permalink: "https://www.instagram.com/p/B9As2LsAZ1A/",
					timestamp: "2020-02-26T01:03:10+0000",
					username: "buicongdang",
					sw_gallery_id: 1,
					status: true,
					created_at: "2020-03-13 11:48:07",
					updated_at: "2020-03-13 11:48:07"
				},
				{
					id: 17943373132323226,
					media_type: "CAROUSEL_ALBUM",
					media_url:
						"https://scontent.xx.fbcdn.net/v/t51.2885-15/84977522_2638831783058046_266719157505469731_n.jpg?_nc_cat=104&_nc_sid=8ae9d6&_nc_ohc=Wj9RTzx6WQoAX-zRX8U&_nc_ht=scontent.xx&oh=799c8b7ebf3d3d993ff3b4dc2d0bd6e4&oe=5E91A8D1",
					permalink: "https://www.instagram.com/p/B8_vQE-g7_E/",
					timestamp: "2020-02-25T16:04:56+0000",
					username: "buicongdang",
					sw_gallery_id: 1,
					status: true,
					created_at: "2020-03-13 11:48:07",
					updated_at: "2020-03-13 11:48:07"
				},
				{
					id: 17893608337460100,
					media_type: "IMAGE",
					media_url:
						"https://scontent.xx.fbcdn.net/v/t51.2885-15/85201328_650789532392008_4505775219929006419_n.jpg?_nc_cat=110&_nc_sid=8ae9d6&_nc_ohc=sfe9AiftEJsAX8APT3_&_nc_ht=scontent.xx&oh=68dc8e2d23d605bdb4a8f0b6e8e9a69d&oe=5E90168F",
					permalink: "https://www.instagram.com/p/B8rOIemAL5i/",
					timestamp: "2020-02-17T16:50:44+0000",
					username: "buicongdang",
					sw_gallery_id: 1,
					status: true,
					created_at: "2020-03-13 11:48:07",
					updated_at: "2020-03-13 11:48:07"
				},
				{
					id: 18113253343069004,
					media_type: "IMAGE",
					media_url:
						"https://scontent.xx.fbcdn.net/v/t51.2885-15/79336672_519041292289246_2922263567614597249_n.jpg?_nc_cat=104&_nc_sid=8ae9d6&_nc_ohc=rU-sRlWc70wAX9Razpz&_nc_ht=scontent.xx&oh=9ec3e828d4d35526e902d4ecabf2a7bf&oe=5E91A37A",
					permalink: "https://www.instagram.com/p/B6kSswTAfAs/",
					timestamp: "2019-12-27T07:13:10+0000",
					username: "buicongdang",
					sw_gallery_id: 1,
					status: true,
					created_at: "2020-03-13 11:48:07",
					updated_at: "2020-03-13 11:48:07"
				},
				{
					id: 18067964053198304,
					media_type: "IMAGE",
					media_url:
						"https://scontent.xx.fbcdn.net/v/t51.2885-15/79301182_1204545846407432_783453458841501012_n.jpg?_nc_cat=103&_nc_sid=8ae9d6&_nc_ohc=Nkmu4_PF3KIAX8N9W9J&_nc_ht=scontent.xx&oh=d53acc28e1ea7224ab3b16982e468392&oe=5E92AED8",
					permalink: "https://www.instagram.com/p/B57Oyb3AX3Q/",
					timestamp: "2019-12-11T08:30:07+0000",
					username: "buicongdang",
					sw_gallery_id: 1,
					status: true,
					created_at: "2020-03-13 11:48:07",
					updated_at: "2020-03-13 11:48:07"
				},
				{
					id: 17883102124417632,
					media_type: "IMAGE",
					media_url:
						"https://scontent.xx.fbcdn.net/v/t51.2885-15/70913173_191837418514001_8574765465850718889_n.jpg?_nc_cat=109&_nc_sid=8ae9d6&_nc_ohc=8mQJ3TCcHGQAX-LUXGO&_nc_ht=scontent.xx&oh=0262a6ff4da06e96183b783587bb43f9&oe=5E8F2F08",
					permalink: "https://www.instagram.com/p/B2nhL6Zg-p_/",
					timestamp: "2019-09-20T03:11:54+0000",
					username: "buicongdang",
					sw_gallery_id: 1,
					status: true,
					created_at: "2020-03-13 11:48:07",
					updated_at: "2020-03-13 11:48:07"
				},
				{
					id: 18012201964228048,
					media_type: "IMAGE",
					media_url:
						"https://scontent.xx.fbcdn.net/v/t51.2885-15/66794190_447037612556169_3287487946541023345_n.jpg?_nc_cat=101&_nc_sid=8ae9d6&_nc_ohc=DyFIs_8-yLIAX_uBWx8&_nc_ht=scontent.xx&oh=49b4af0ba2a08421c8cd4bbad4307521&oe=5E8F7BDF",
					permalink: "https://www.instagram.com/p/B03lKhPA7xL/",
					timestamp: "2019-08-07T15:51:43+0000",
					username: "buicongdang",
					sw_gallery_id: 1,
					status: true,
					created_at: "2020-03-13 11:48:07",
					updated_at: "2020-03-13 11:48:07"
				},
				{
					id: 18011633863126562,
					media_type: "IMAGE",
					media_url:
						"https://scontent.xx.fbcdn.net/v/t51.2885-15/49702541_796651724028354_5925158576571422211_n.jpg?_nc_cat=109&_nc_sid=8ae9d6&_nc_ohc=ntXSPgv0Kq8AX9fh_su&_nc_ht=scontent.xx&oh=8fbe66b20f39b36451138ba4ec7a1989&oe=5E8F1718",
					permalink: "https://www.instagram.com/p/Btno0LOhn16/",
					timestamp: "2019-02-08T11:36:01+0000",
					username: "buicongdang",
					sw_gallery_id: 1,
					status: true,
					created_at: "2020-03-13 11:48:07",
					updated_at: "2020-03-13 11:48:07"
				},
				{
					id: 17848307275349704,
					media_type: "IMAGE",
					media_url:
						"https://scontent.xx.fbcdn.net/v/t51.2885-15/50068026_181879406123879_2602235808057257688_n.jpg?_nc_cat=107&_nc_sid=8ae9d6&_nc_ohc=fRylWXo0ukQAX-gsoK7&_nc_ht=scontent.xx&oh=b79ed781f49554855626295b03068eb4&oe=5E92BD63",
					permalink: "https://www.instagram.com/p/BtXr2xQhei9/",
					timestamp: "2019-02-02T06:54:44+0000",
					username: "buicongdang",
					sw_gallery_id: 1,
					status: true,
					created_at: "2020-03-13 11:48:07",
					updated_at: "2020-03-13 11:48:07"
				},
				{
					id: 17902752796277172,
					media_type: "IMAGE",
					media_url:
						"https://scontent.xx.fbcdn.net/v/t51.2885-15/46292427_542667519477975_6104644542220528574_n.jpg?_nc_cat=100&_nc_sid=8ae9d6&_nc_ohc=d9Dl4aJ7y98AX_go3V0&_nc_ht=scontent.xx&oh=f6e769f798b195198ab2cac80fbc9cd3&oe=5E91882F",
					permalink: "https://www.instagram.com/p/BrXnqFvga5Y/",
					timestamp: "2018-12-14T13:15:16+0000",
					username: "buicongdang",
					sw_gallery_id: 1,
					status: true,
					created_at: "2020-03-13 11:48:07",
					updated_at: "2020-03-13 11:48:07"
				}
			],
		};
	},
	methods:{
		setBackground(){
			
		}
	}
};
</script>
