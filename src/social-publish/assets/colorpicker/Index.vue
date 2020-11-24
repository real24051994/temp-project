<template>
	<div class="hu-color-picker" >
		<div class="color-set">
			<Saturation ref="saturation" :color="rgbString" :hsv="hsv" :size="hueHeight"
				@selectSaturation="selectSaturation" />
			<Hue ref="hue" :hsv="hsv" :width="20" :height="hueHeight" @selectHue="selectHue" />
		</div>
	</div>
</template>

<script>
import mixin from './mixin'
import Saturation from './Saturation.vue'
import Hue from './Hue.vue'
export default {
    components: {
        Saturation,
        Hue,
    },
    mixins: [mixin],
    props: {
        value: {
            type: String,
            default: '#000000'
        },
        colorsDefault: {
            type: Array,
            default: () => [
                '#D0021B', 
				'#F5A623',
				'#F8E71C',
				'#8B572A',
				'#7ED321',
				'#417505',
				'#BD10E0',
				'#9013FE',
				'#4A90E2',
				'#50E3C2',
				'#B8E986',
				'#000000',
				'#4A4A4A',
				'#9B9B9B',
				'#EEEEEE',
				'#FFFFFF'
            ]
        },
        colorsHistoryKey: {
            type: String,
            default: 'vue-colorpicker-history'
        }
    },
    data() {
        return {
            hueWidth: 15,
            hueHeight: 152,
            previewHeight: 30,
            modelRgba: '',
            modelHex: '',
            r: 0,
            g: 0,
            b: 0,
            a: 1,
            h: 0,
            s: 0,
            v: 0
        }
    },
    computed: {
        isLightTheme() {
            return this.theme === 'light'
        },
        totalWidth() {
            return this.hueHeight + (this.hueWidth + 8) * 2
        },
        previewWidth() {
            return this.totalWidth - (this.suckerHide ? 0 : this.previewHeight)
        },
        rgba() {
            return {
                r: this.r,
                g: this.g,
                b: this.b,
                a: this.a
            }
        },
        hsv() {
            return {
                h: this.h,
                s: this.s,
                v: this.v
            }
        },
        rgbString() {
            return `rgb(${this.r}, ${this.g}, ${this.b})`
        },
        rgbaStringShort() {
            return `${this.r}, ${this.g}, ${this.b}, ${this.a}`
        },
        rgbaString() {
            return `rgba(${this.rgbaStringShort})`
        },
        hexString() {
            return this.rgb2hex(this.rgba, true)
        }
    },
    watch: {
        rgba() {
			this.$emit('input', this.rgb2hex(this.rgba, true))
            this.$emit('changeColor', {
                rgba: this.rgba,
                hsv: this.hsv
            })
        }
    },
    created() {
        Object.assign(this, this.setColorValue(this.value))
    },
    methods: {
        selectSaturation(color) {
            const { r, g, b, h, s, v } = this.setColorValue(color)
            Object.assign(this, { r, g, b, h, s, v })
        },
        selectHue(color) {
            const { r, g, b, h, s, v } = this.setColorValue(color)
            Object.assign(this, { r, g, b, h, s, v })
            this.$nextTick(() => {
                this.$refs.saturation.renderColor()
                this.$refs.saturation.renderSlide()
            })
        },
        selectAlpha(a) {
            this.a = a
        },
        selectColor(color) {
            const { r, g, b, a, h, s, v } = this.setColorValue(color)
            Object.assign(this, { r, g, b, a, h, s, v })
            this.$nextTick(() => {
                this.$refs.saturation.renderColor()
                this.$refs.saturation.renderSlide()
                this.$refs.hue.renderSlide()
            })
        }
    }
}
</script>

<style lang="scss">
.hu-color-picker {
    padding: 10px;
    background: #fff;
    border-radius: 4px;
	z-index: 1;
    canvas {
        vertical-align: top;
    }
    .color-set {
        display: flex;
    }
    .color-show {
        margin-top: 8px;
        display: flex;
    }
}
</style>