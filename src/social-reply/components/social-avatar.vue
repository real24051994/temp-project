<template>
  <div class="fa-social-avatar" :style="`width: ${size}px; height: ${size}px; min-width: ${size}px;`">
    <img v-if="src" :src="src" alt="" />
    <img v-else src="@/assets/icons/user.png" alt="" />

    <vue-error-social-account-popover class="social-connect-error" v-if="connect_error && connect_error.message" :value="connect_error" />
    <!-- <span v-if="connect_error && connect_error.message" :class="`social-account-type social-connect-error`" /> -->
    <!-- <span v-else-if="social_type" :class="`social-account-type social-${social_type}`" /> -->

    <div v-else-if="social_type" :class="`social-account-type social-${social_type}`">
      <sh-icon :icon="icon_name" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: [String, null],
      default: '',
      required: false,
    },

    size: {
      type: String,
      default: '38',
      required: false,
    },

    social_type: {
      type: String,
      default: '',
      required: false,
    },

    connect_error: {
      type: Object,
      required: false,
    },
  },

  computed: {
    icon_name() {
      if (this.social_type === 'facebook') {
        return ['fab', 'facebook-f']
      } else if (this.social_type === 'comment') {
        return ['far', 'comment-alt-lines']
      }
      return ['fas', this.social_type]
    },
  },
}
</script>

<style lang="scss" scoped>
.fa-social-avatar {
  position: relative;
  border-radius: 100%;
  background-color: white;

  img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    border: 1px solid #eaeaea;
    object-fit: cover;
  }

  .social-account-type {
    background: #ffffff;
    position: absolute;
    width: 18px;
    height: 18px;
    font-size: 9px;
    border-radius: 50%;
    border: 1px solid white;
    bottom: -3px;
    right: -3px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;

    &.social-facebook {
      background: #4267b2;
    }

    &.social-inbox {
      background: #5b86e5;
      line-height: 1;
    }

    &.social-comment {
      background: #f27e54;
    }
  }

  .social-connect-error {
    position: absolute;
    border: 1px solid white;
    background-color: white;
    border-radius: 50%;
    bottom: -3px;
    right: -3px;
  }
}
</style>
