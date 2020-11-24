<template>
	<div class="fugit">
		<div class="fugit-input fugit-hours" role="textbox" tabindex="0">00</div>
		<div class="fugit-separator">:</div>
		<div class="fugit-input fugit-minutes" role="textbox" tabindex="0">00</div>
	</div>
</template>
<script>
	export default {
		name: "TimePicker",
		data() {
			return {
				ranges: {
					hours: [0, 23],
					minutes: [0, 59],
				},
				validHours: /^([01]?[0-9]|2[0-3])/,
				validMinutes: /([0-5][0-9])$/,
				validTime: /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/,
				value : ''
			};
		},
		methods: {
			setTime: function(time) {
				if (this.validTime.test(time)) {
					let [t, hours, minutes] = this.validTime.exec(time);
					this.value = time
				}
			},

			setHours: function(value) {
				if (validHours.test(value)) {
					let [t, hours] = this.validHours.exec(value);
					this.$el.val(this.$el.val().replace(validHours, hours)).trigger("change");
				}
			},

			setMinutes: function(value) {
				if (validHours.test(value)) {
					let [t, minutes] = this.validMinutes.exec(value);
					this.$el.val(this.$el.val().replace(this.validMinutes, minutes)).trigger("change");
				}
			},

			getTime: function() {
				return this.$el.val();
			},

			getHours: function() {
				return Number(this.$el.val().split(":")[0]);
			},

			getMinutes: function() {
				return Number(this.$el.val().split(":")[1]);
			},

			remove: function() {
				this.$el.removeData("fugit").show();
				this.$plugin.off(".fugit").remove();
			},

			_updateInput: function() {
				let timeParts = $(this.$el).find(".fugit-input").toArray().map((el) => $(el).text() || "00");
				$(this.$el).val(timeParts.join(":"))
			},

			_handleKeyDown: function(e) {
				let $input = $(e.currentTarget),
					inputType = $input.is(".fugit-hours") ? "hours" : "minutes",
					newValue = Number($input.text());

				if (Number(e.key) == e.key) {
					if (newValue >= 10 || Number(newValue + "" + Number(e.key)) > ranges[inputType][1]) {
						newValue = Number(e.key);
					} else {
						newValue = Number(newValue + "" + Number(e.key));
					}
				}

				if (e.key === "ArrowUp") {
					newValue += 1;
				} else if (e.key === "ArrowDown") {
					newValue -= 1;
				}

				if (e.key === "Backspace") {
					newValue = Number(
						String(newValue)
							.padStart(2, "0")
							.split("")
							.shift(),
					);
					e.preventDefault();
				}

				if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Backspace" || Number(e.key) == e.key) {
					if (newValue > ranges[inputType][1]) {
						newValue = ranges[inputType][0];
					} else if (newValue < ranges[inputType][0]) {
						newValue = ranges[inputType][1];
					}
					$input.text(String(newValue).padStart(2, "0")).trigger("change");
				}

				if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
					let firstDir = e.key === "ArrowRight" ? "nextAll" : "prevAll",
						lastDir = e.key === "ArrowRight" ? "prevAll" : "nextAll";
					if ($input[firstDir](".fugit-input").length) {
						$input[firstDir](".fugit-input").focus();
					} else if ($input[lastDir](".fugit-input").length) {
						$input[lastDir](".fugit-input").focus();
					}
				}
			},
		},
		mounted(){
			$(this.$el).on('change.fugit', '.fugit-input', this._updateInput.bind(this)).on('keydown.fugit', '.fugit-input', this._handleKeyDown.bind(this));
			this.setTime();
  			this._updateInput();
		}
	};
</script>
<style lang="scss">
	.fugit {

	display: inline-flex;
	padding: 1px;

	appearance: textfield;

	font: 400 11px system-ui; // Chrome
	font: -moz-field;
	font-feature-settings: 'lnum', 'tnum';
	font-variant-numeric: lining-nums tabular-nums;

	}

	.fugit-input {

	width: 2ch;
	outline: none;

	text-align: center;

	}

	.fugit-input:focus {
		background-color: Highlight;
		background-color: -moz-dragtargetzone;
	}

	.fugit-hours {
	text-align: right;
	}

	.fugit-minutes {
	text-align: left;
	}

</style>