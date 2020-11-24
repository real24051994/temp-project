<template>
  <div style="position: sticky; top: 88px;">
    <div class="box-preview">
      <div class="widget overflow-hidden">
        <div class="main-widget" :style="`bottom: calc(${bottom} + ${btn_size}); right: ${widget_right};`">
          <div class="flex">
            <div class="flex-1">
              <div class="shop-avatar">
                <img v-if="selected_account.avatar" :src="selected_account.avatar" alt="" />
                <img v-else src="@reply/assets/svg-icon/modules/chat-widget/default-avatar.svg" />
              </div>
            </div>

            <div>
              <sh-icon :icon="['fas', 'times']" style="color: #cecece;" />
            </div>
          </div>

          <div class="m-t-16 font-medium f-16">Chat with {{ selected_account.name }}</div>

          <div class="m-t-8 text-left f-14 break-word">
            {{ settings.greeting_message }}
          </div>

          <div class="m-t-24">
            <div class="btn-login flex center" :style="`background-color: ${theme_color}`">
              <svg-icon2 :key="1" v-if="showicon" name="chat-widget/chat-widget-icon-1" size="18px" class="m-r-8" fill="#ffffff" :fill-white="theme_color" />
              <svg-icon2 v-else name="chat-widget/chat-widget-icon-1" size="18px" class="m-r-8" fill="#ffffff" :fill-white="theme_color" />
              Start chat
            </div>
          </div>

          <div class="m-t-12 f-12 text-center" style="color: #cecece; line-height: 16px;">
            If you choose to log in, we will see the website you came from and info you've made public on your Facebook profile
          </div>
        </div>

        <div class="btn-icon" :style="`background-color: ${background_color}; bottom: ${bottom}; right: ${btn_right}; width: ${btn_size}; height: ${btn_size}`">
          <svg-icon2 :key="2" v-if="showicon" :name="icon" :size="icon_size" :fill="icon_color" :fill-white="background_color" />
          <svg-icon2 :key="3" v-else :name="icon" :size="icon_size" :fill="icon_color" :fill-white="background_color" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    settings: {
      type: Object,
      default: () => {},
      required: true,
    },

    selected_account: {
      type: Object,
      default: () => {},
      required: true,
    },
  },

  data() {
    return {
      showicon: true,
    }
  },

  computed: {
    json_settings() {
      return JSON.parse(JSON.stringify(this.settings))
    },

    theme_color() {
      return this.settings.custom_color.theme_color || ''
    },

    background_color() {
      return this.settings.custom_color.background_color || ''
    },

    icon_color() {
      return this.settings.custom_color.icon_color || ''
    },

    btn_size() {
      if (this.settings.icon_size === 'large') {
        return '62px'
      } else if (this.settings.icon_size === 'medium') {
        return '54px'
      }
      return '46px'
    },

    icon_size() {
      if (this.settings.icon_size === 'large') {
        return '40px'
      } else if (this.settings.icon_size === 'medium') {
        return '32px'
      }
      return '24px'
    },

    left() {
      if (!this.settings.position_margin.horizontal && this.settings.position_margin.horizontal != 0) {
        return '95%'
      }

      return this.settings.position_margin.horizontal + '%'
    },

    bottom() {
      if (!this.settings.position_margin.vertical && this.settings.position_margin.vertical != 0) {
        return '30px'
      }

      return this.settings.position_margin.vertical + 'px'
    },

    icon() {
      return `chat-widget/chat-widget-icon-${this.settings.icon}`
    },

    btn_right() {
      const window_width = 460
      const tab_width = parseInt(this.btn_size.replace('px', ''))
      var css_tab = window_width - tab_width - (window_width - tab_width) * (parseInt(this.settings.position_margin.horizontal) / 100) + 'px'
      return css_tab
    },

    widget_right() {
      const window_width = 460
      const tab_width = 265
      var css_tab = window_width - tab_width - (window_width - tab_width) * (parseInt(this.settings.position_margin.horizontal) / 100) + 'px'
      return css_tab
    },
  },

  watch: {
    json_settings() {
      this.showicon = false

      setTimeout(() => {
        this.showicon = true
      }, 0)
    },
  },
}
</script>

<style lang="scss" scoped>
.box-preview {
  width: 100%;
  height: 678px;
  min-height: 678px;
  background-color: #f7f8fa;
  border-radius: 4px;
  max-height: 500px;
  position: relative;
  user-select: none;
  display: flex;
  justify-content: center;
}

.widget {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 32px;
  width: 460px;
  height: 473px;
  background-image: url('../../../assets/svg-icon/modules/chat-widget/preview-background.svg');
  background-position-x: -15px;
  background-position-y: -15px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);

  .btn-icon {
    z-index: 1;
    box-shadow: 0 0 9px rgba(0, 0, 0, 0.15);
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
  }

  .main-widget {
    z-index: 1;
    width: 265px;
    margin-bottom: 12px;
    background: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border-radius: 12px;
    padding: 16px 16px;
    position: absolute;

    .shop-avatar {
      position: relative;
      width: 32px;
      height: 32px;
      border-radius: 50%;

      img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }

      &::before {
        content: '';
        background: #6fcf97;
        position: absolute;
        border-radius: 50%;
        width: 9px;
        height: 9px;
        right: 0;
        bottom: 0;
      }
    }
  }

  .btn-login {
    border-radius: 10px;
    color: white;
    height: 40px;

    svg {
      margin-right: 8px;
    }
  }
}
</style>
