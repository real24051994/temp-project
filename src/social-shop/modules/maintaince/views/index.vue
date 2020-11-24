<template>
  <div class="social-shop-maintaince">
    <div class="container">
      <div class="row">
        <div class="col col-6 maintaince-image d-flex flex-column">
          <div class="box-stopping">
            <div><img src="@shop/assets/images/upgrade-icon.svg" alt /></div>
            <div class="setting-turn"><img width="50" src="@shop/assets/images/setting.gif" alt /></div>
          </div>
          <div class="txt-maintaince m-t-20">Maintenance time</div>
          <div class="d-flex align-items-center m-t-10">
            <div class="time-fixed">3</div>
            <div class="m-r-2 m-l-2" style="font-weight: 500">:</div>
            <div class="time-fixed m-r-2">0</div>
            <div class="time-fixed">0</div>
            <div class="m-r-2 m-l-2" style="font-weight: 500">-</div>
            <div class="time-fixed">5</div>
            <div class="m-r-2 m-l-2" style="font-weight: 500">:</div>
            <div class="time-fixed m-r-2">0</div>
            <div class="time-fixed m-r-5">0</div>
            <div style="color: #4F4F4F;">AM (UTC)</div>
          </div>
        </div>
        <div class="col col-5">
          <div class="maintaince-logo">
            <img class="m-b-10" src="@shop/assets/images/logo-socialshop.svg" alt />
          </div>
          <div>
            <div class="maintaince-title">
              New Version Released
            </div>
            <!-- <div class="maintaince-time">
              Estimated Time: 3AM - 9AM (UTC) July 13th, 2020
            </div> -->
            <div class="maintaince-content">
              <p style="color: #5B86E5;" class="m-b-30">
                A smoother Facebook feeds submitting flow using your metafields!
              </p>
              <p>
                In this new version, Socialhead enables you to customize your feed even further by adding existing metafields in your store to your product
                feed.
              </p>
            </div>
          </div>
          <div class="news-notification">
            <div class="d-flex align-items-center">
              <sh-icon style="font-size: 23px" class="m-r-10" :icon="['fal', 'star']" />
              <div class="txt-news">What you can get</div>
            </div>
            <div class="d-flex new-feature flex-column m-t-15">
              <div class="title-feature">Higher product feed field optimization</div>
              <!-- <div class="m-t-10"><img height="30" src="@shop/assets/images/group-apps.png" alt /></div> -->
            </div>
            <div class="d-flex new-feature flex-column m-t-15">
              <div class="title-feature">More precise targeting and higher product visibility</div>
            </div>
            <div class="d-flex new-feature flex-column m-t-15">
              <div class="title-feature">Shorten feeds submitting time</div>
            </div>
            <!-- <br />
            <div style="color: #1890FF;">Stay tune for upcoming version update!</div> -->
          </div>
          <p class="m-t-10">Should you have any question or issue, please contact us at: <a href="mailto:support@socialhead.io">support@socialhead.io</a></p>
          <!-- <div class="d-flex m-t-30">
            <a-spin class="box-product-loading" size="large" :spinning="spinning">
              <a-icon slot="indicator" type="loading" style="font-size: 33px" spin />
            </a-spin>
            <div class="d-flex m-l-20 flex-column">
              <div class="process-text">Processing...</div>
              <div class="text-design">We will be back soon with a better version. Thank you for your patience</div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Maintain',
  metaInfo: {
    title: 'Maintaince',
  },
  computed: {
    ...mapGetters({
      chat_box_token: 'auth/getChatBoxToken',
      chat_box_data: 'auth/getChatBoxData',
    }),
  },
  data: function() {
    return {
      spinning: true,
    }
  },
  created() {
    if (this.chat_box_data) {
      this.$crisp.init({
        token: this.chat_box_token,
        data: this.chat_box_data,
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.social-shop-maintaince {
  padding: 100px 0;
  color: #121212;
  .container {
    max-width: 1230px;
  }
  .maintaince {
    &-image {
      display: flex;
      align-items: center;
      justify-content: center;
      color: $text;
      .box-stopping {
        position: relative;
        .setting-turn {
          position: absolute;
          right: 94px;
          top: 50px;
          img {
            border-radius: 50%;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 100%), #e1f1ff;
            padding: 5px;
            border: 2px solid #fff;
          }
        }
      }
      .time-fixed {
        color: $white;
        background-color: #333842;
        border-radius: 2px;
        padding: 0 2px;
      }
      .txt-maintaince {
        font-weight: 600;
        font-size: 16px;
      }
    }
    &-logo {
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      img {
      }
      h1 {
        font-weight: 500;
        font-size: 22px;
        margin: 0;
        color: #4080ff;
      }
    }
    &-content {
      p {
        font-size: 14px;
        margin-bottom: 8px;
      }
    }
    &-title {
      font-weight: bold;
      font-size: 34px;
      line-height: 40px;
      margin-bottom: 4px;
    }
    &-time {
      font-size: 16px;
      line-height: 19px;
      margin-bottom: 16px;
    }
    &-block {
      padding: 24px;
      border: 1px solid #cecece;
      box-sizing: border-box;
      border-radius: 4px;
      h3 {
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
      }
      p {
        font-size: 14px;
      }
      a {
        color: $primary-color;
        font-size: 14px;
      }
    }
  }
  .logo-fb-info {
    background: #4080ff;
    border-radius: 4px;
    width: 32px;
    height: 32px;
    margin-right: 15px;
  }
  .news-notification {
    border: 1px solid #cecece;
    border-radius: 4px;
    padding: 16px;
    width: 428px;
    .txt-news {
      font-weight: 500;
      font-size: 16px;
      color: #000000;
    }
    .new-feature {
      .title-feature {
        font-weight: bold;
        font-size: 14px;
      }
    }
  }
  .process-text {
    font-weight: 500;
    font-size: 16px;
    color: $primary-color;
  }
  .text-design {
    color: #828282;
    font-size: 12px;
  }
}
</style>
