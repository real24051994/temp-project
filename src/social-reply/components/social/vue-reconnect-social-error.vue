<template>
  <div>
    <a-modal v-if="visible" v-model="visible" :footer="false" :title="false" :closable="false">
      <div class="modal-reconnect-error">
        <div class="modal-reconnect-error-header">
          <div class="item-social-account">
            <div class="item-social-account-media">
              <div class="item-social-account-media-avatar">
                <img :src="social.avatar" alt="">
              </div>
              <div class="item-social-account-media-social item-social" :class="`social-${social.social_type}`" />
            </div>
          </div>
        </div>
        <div class="modal-reconnect-error-body">
          <h3>This account does not have permission</h3>
          <p>
            This account don’t have permission to connect to this <br>
            Please try another account
          </p>
        </div>
        <div class="modal-reconnect-error-footer">
          <a-button type="primary" @click="visible = false">
            I got it
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'VueReconnectSocialError',
	
	props: {
    value: {
      type: Boolean,
		},
		
    social: {
			type: Object,
			default: () => {}
    },
	},
	
	data() {
    return {}
	},
	
  computed: {
    visible: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
	},
}
</script>
<style lang="scss" scoped>
.modal-reconnect-error {
  padding: 24px 0;

  .item-social-account {
    justify-content: center;
    height: 50px;

    .item-social-account-media {
      max-width: 55px;

      &-avatar {
        width: 50px;
        height: 50px;

        img {
          width: 100%;
        }
      }

      &-social {
        top: auto;
        left: auto;
        bottom: 0;
        right: 0;
      }
    }
  }

  &-header {
    margin-bottom: 15px;
  }

  &-body {
    text-align: center;
    margin-bottom: 30px;

    h3 {
      font-weight: 500;
      font-size: 20px;
      line-height: 24px;
    }

    p {
      font-weight: normal;
      font-size: 14px;
      line-height: 17px;
    }
  }

  &-footer {
    text-align: center;

    .ant-btn {
      min-width: 280px;
    }
  }
}
</style>
