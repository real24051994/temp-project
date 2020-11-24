<template>
  <div class="image-upload">
    <label for="file-input" class="icon">
      <slot name="icon">
        <a-tooltip placement="top">
          <template slot="title">Upload Media</template>

          <sh-icon :icon="['fas', 'image']" class="f-18" />
        </a-tooltip>
      </slot>
    </label>

    <!-- <input
      class="d-none"
      type="file"
      id="file-input"
      ref="files"
      accept=".ogm, .wmv, .mpg, .webm, .ogv, .mov, .asx, .mpeg, .mp4, .m4v, .avi, .webm, .wmv, .avi, .3gp, .m4v, .mp4, .mov, .mpg, .mpeg, .tiff, .pjp, .pjpeg, .jfif, .tif, .gif, .svg, .bmp, .png, .jpeg, .svgz, .jpg, .webp, .ico, .xbm, .dib, .heic, .heif, .ts, .mkv"
      @change="handleFileChange"
      @click="$event.target.value = null"
    /> -->
    <input
      class="d-none"
      type="file"
      id="file-input"
      ref="files"
      accept=".webp, .jpg, .jpeg, .png, .gif"
      @change="handleFileChange"
      @click="$event.target.value = null"
    />
  </div>
</template>

<script>
export default {
  methods: {
    handleFileChange(e) {
      this.$emit('input', e.target.files[0])
    },
  },
}
</script>

<style lang="scss" scoped>
.icon {
  cursor: pointer;

  i {
    cursor: pointer;
  }
}
</style>
