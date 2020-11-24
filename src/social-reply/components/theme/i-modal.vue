<template>
  <div v-show="show" class="i-modal-overlay">
    <div class="i-modal-wraper pt-0 pb-0 md:pt-8 md:pb-10" @click.self="$emit('click-overlay')">
      <div class="bg-white px-3 py-3 items-center block md:hidden">
        <fa class="text-2xl text-gray-700" :icon="['fas', 'angle-left']" @click="$emit('close')" />
      </div>

      <div class="i-modal-content-wraper" :style="`width: ${width}; ${contentStyle}`">
        <button v-if="!hideCloseButton" class="i-modal-close" @click="$emit('close')">
          <fa class="f-20 ml-1" :icon="['fas', 'times']" />
        </button>
        <div class="i-modal-content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
    },

    width: {
      type: String,
      default: () => '80%',
    },

    contentStyle: {
      type: String,
      default: () => '',
    },

    hideCloseButton: {
      type: Boolean,
      default: false,
      required: false,
    },
  },

  // watch: {
  //   show(val) {
  //     const body = document.querySelector('body')

  //     if (val === true) {
  //       body.style.overflow = 'hidden'
  //       body.style.paddingRight = '17px'
  //     } else {
  //       body.style.overflow = 'auto'
  //       body.style.paddingRight = '0'
  //     }
  //   },
  // },

  created() {
    // if (this.show) {
    //   const body = document.querySelector('body')
    //   body.style.overflow = 'hidden'
    //   body.style.paddingRight = '17px'
    // }
  },

  // beforeDestroy() {
  //   const body = document.querySelector('body')
  //   body.style.overflow = 'auto'
  //   body.style.paddingRight = '0'
  // },

  methods: {
    closeModal() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
.i-modal-overlay {
  transition: opacity 0.3s;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(33, 37, 41, 0.8);
  z-index: 100;
  overflow: hidden;
}

.i-modal-wraper {
  transition: opacity 0.3s;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}

.i-modal-close {
  background: white;
  position: absolute;
  top: -12px;
  right: -12px;
  border: none;
  outline: 0;
  color: #111;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  z-index: 104;
  display: flex;
  justify-content: center;
  align-items: center;
}

.i-modal-content {
  width: 100%;
  height: 100%;
}

.i-modal-content-wraper {
  position: relative;
  min-height: auto;
  margin: 0 auto;
  border-radius: 10px;
  max-width: 100%;
  z-index: 102;
}
</style>
