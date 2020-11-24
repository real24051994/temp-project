<template>
	<div>
		
	</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
const Pusher = require("pusher-js");
Pusher.logToConsole = true;
export default {
	name: "VueReconnectSocial",
	props: {
		url: {
			type: String,
			required: true
		},
		value : {
			type : Boolean,
		},
		social :{
			type : Object
		}
	},
	data() {
		return {
			is_loading: false,
			pusher: null,
			popup: null,
			timeout: null,
		};
	},
	computed: {
		...mapGetters({
			shop: "auth/getShop"
		}),
	},
	methods: {
		openNewTab() {
			var width = 900;
			var height = 500;
			this.popup = window.open(
				this.url,
				"Socialpublish",
				"menubar=1,resizable=1,width=" +
					width +
					",height=" +
					height +
					""
			);
			this.timeout = setInterval(() => {
				if (this.popup.closed) {
					clearInterval(this.timeout);
					this.popup = null;
					this.$emit("input", false);
				}
			}, 500);
			this.initSocket();
		},
		closeNewTab() {
			if (this.timeout) {
				clearInterval(this.timeout);
			}
			if (this.popup && this.popup.closed == false) {
				this.popup.close();
			}
			this.$emit("input", false);
		},
		initSocket() {
			this.pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
				cluster: "ap1",
				forceTLS: true
			});
			var channel = this.pusher.subscribe(`${this.shop.id}`);
			channel.bind("re_auth_social", data => {
				this.$emit("on-pusher", data);
				this.closeNewTab();
			});
		},
		closePusher() {
			if (this.pusher) {
				this.pusher.disconnect();
			}
		},
	},
	mounted() {
		this.openNewTab();
	},
	beforeDestroy() {
		if (this.timeout) {
			clearInterval(this.timeout);
		}
		if (this.popup && this.popup.closed == false) {
			this.popup.close();
		}
		this.closePusher();
	}
};
</script>
