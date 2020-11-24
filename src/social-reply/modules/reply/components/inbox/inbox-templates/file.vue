<template>
  <div
    :class="{ 'is-page': is_page }"
    class="message-item-file flex items-center p-l-12 p-r-12 p-t-8 p-b-8"
    v-if="is_local_message || data.attachments[0].url === '#'"
  >
    <a-icon v-if="!data.send_error" slot="indicator" type="loading" style="font-size: 18px;" class="m-r-8" spin />
    Uploading {{ data.attachments[0].name }}
  </div>

  <a
    v-else
    :href="data.attachments[0].url"
    :download="data.attachments[0].name"
    target="_blank"
    rel="noopener noreferrer"
    class="message-item-file"
    :class="{ 'is-page': is_page }"
  >
    <div class="icon-download">
      <sh-icon :icon="['fas', 'arrow-to-bottom']" />
    </div>

    {{ data.attachments[0].name }}
  </a>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
      required: true,
    },

    is_page: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  computed: {
    is_local_message() {
      return this.data.message_id.toString().startsWith('srp_file__')
    },
  },

  methods: {
    downloadFile(data, filename, mime, bom) {
      var blobData = typeof bom !== 'undefined' ? [bom, data] : [data]
      var blob = new Blob(blobData, { type: mime || 'application/octet-stream' })
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were
        // revoked by closing the blob for which they were created.
        // These URLs will no longer resolve as the data backing
        // the URL has been freed."
        window.navigator.msSaveBlob(blob, filename)
      } else {
        var blobURL = window.URL && window.URL.createObjectURL ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob)
        var tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = blobURL
        tempLink.setAttribute('download', filename)

        // Safari thinks _blank anchor are pop ups. We only want to set _blank
        // target if the browser does not support the HTML5 download attribute.
        // This allows you to download files in desktop safari if pop up blocking
        // is enabled.
        if (typeof tempLink.download === 'undefined') {
          tempLink.setAttribute('target', '_blank')
        }

        document.body.appendChild(tempLink)
        tempLink.click()
        setTimeout(function() {
          document.body.removeChild(tempLink)
          window.URL.revokeObjectURL(blobURL)
        }, 200)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.message-item-file {
  background: #f3f3f3;
  padding: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #252627 !important;
  border-radius: 8px 8px 8px 0;

  &.is-page {
    color: white !important;
    background: #5b86e5;
    border-radius: 8px 8px 0 8px;
  }

  .icon-download {
    width: 24px;
    height: 24px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 8px;

    i {
      color: $primary-color;
    }
  }
}
</style>
