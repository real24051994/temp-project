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

    <input multiple class="d-none" type="file" id="file-input" ref="files" @change="handleFilesUpload" @click="$event.target.value = null" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      files: [],
    }
  },

  methods: {
    submitFile(file) {
      let formData = new FormData()
      formData.append('file', file)
    },

    handleFilesUpload() {
      this.files = []
      let uploadedFiles = this.$refs.files.files

      let invalidSize = false

      for (var i = 0; i < uploadedFiles.length; i++) {
        if (uploadedFiles[i].size > 25 * 1024 * 1024) {
          invalidSize = true
          break
        }
        this.files.push(uploadedFiles[i])
      }

      if (invalidSize) {
        alert('File size must be less than 25 MB')
        return
      }

      this.$emit('change', this.files)
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
