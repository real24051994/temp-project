<template>
  <div class="list-template">
    <div class="banner-introduction" v-if="getTempBanner">
      <img @click="accessWebsite" style="border-radius: 4px" src="@shop/assets/images/product-feed/banner-feed.jpg" class="w-100" alt />
      <div @click.stop.prevent="closeBox" class="close-icon"><sh-icon :icon="['fal', 'times']" /></div>
    </div>
    <div class="title-feed-center d-flex justify-content-between align-items-center">
      <h1 class="m-b-8">Feed Center</h1>
    </div>
    <div class="custom-list-template">
      <div class="d-flex justify-content-end m-b-20">
        <button @click="showModalAddTemplate = true" class="ant-btn ant-btn-primary btn-add-template">
          <sh-icon class="m-r-10" :icon="['far', 'plus']" />Add Feed
        </button>
      </div>
      <div class="item-list-template item-heading">
        <div class="item-switch"></div>
        <div class="item-name">Feed</div>
        <div class="item-url">Feed URL</div>
        <div class="item-id">ID</div>
        <!-- <div class="item-status">Approved Status</div> -->
        <div class="item-platform">Channel</div>
        <div class="item-market">Market</div>
        <div class="item-language">Language/Currency</div>
        <div class="item-bulk"></div>
      </div>
      <transition name="fade-in" mode="out-in">
        <div v-if="spinning" key="is-loading" class="m-b-5 m-t-10">
          <a-skeleton
            :loading="spinning"
            v-for="item in 10"
            :key="`skeleton_${item}`"
            active
            avatar
            :title="false"
            :paragraph="{ rows: 1, width: '100%' }"
          ></a-skeleton>
        </div>
        <div key="loading-success" v-else>
          <template v-if="list.length">
            <div
              :class="{ 'item-list-template item-row': index != 1 }"
              v-for="(item, index) in list"
              :key="`item_index_${index}`"
              @click="onSelect($event, item.id, item.social_type, index)"
            >
              <template v-if="index != 1">
                <div class="item-switch item-switch-function">
                  <a-switch v-model="item.status" @change="(status) => onChangeStatus(item.id, status)" />
                </div>
                <div class="item-name d-flex flex-column">
                  <div>{{ item.name }}</div>
                  <div class="feed-processing d-flex" v-if="checkProcessing(item)">
                    <div>{{ statusFeed(item.status_processing) }}</div>
                    <div class="loading-indicator">
                      <span class="dot-1"></span>
                      <span class="dot-2"></span>
                      <span class="dot-3"></span>
                    </div>
                  </div>
                </div>
                <div class="item-url item-url-function">
                  <div class="name-url active-url m-r-10">
                    <a-popover placement="bottom" trigger="hover">
                      <template slot="content">
                        {{ item.xml_file }}
                      </template>
                      {{ ellipsisText(item.xml_file) }}
                    </a-popover>
                  </div>
                  <div class="d-flex align-items-center" v-clipboard:success="copyUrl" v-clipboard="item">
                    <div class="active-copied"><sh-icon style="color: #7A8998" :icon="['fal', 'copy']" /></div>
                    <div v-if="item.is_copied" class="copy-alert animate-copy">Copied</div>
                  </div>
                </div>
                <div class="item-id">{{ item.center_id }}</div>
                <!-- <div class="item-status">
                <a-popover placement="bottom" trigger="hover">
                  <template slot="content">
                    This feature is under maintenance, it will be back soon!
                  </template>
                  <div class="d-flex align-items-center" style="color: #5B86E5">
                    <div class="m-r-5">Under maintenance</div>
                    <sh-icon :icon="['far', 'exclamation-circle']" />
                  </div>
                </a-popover>
              </div> -->
                <!-- <transition name="fade-in" mode="out-in">
                <template v-if="spinningStatus">
                  <div class="item-status p-l-48" key="is-loading">
                    <a-spin size="large" :spinning="spinningStatus">
                      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
                    </a-spin>
                  </div>
                </template>
                <template v-else>
                  <template v-if="item.approved_status">
                    <div class="item-status" v-if="item.social_type == 'google'">
                      <div v-tooltip="tooltip" :title="showPercentageGoogle(item.approved_status)">
                        <div>{{ item.approved_status.approved }}% Approved</div>
                        <div class="progress d-flex">
                          <div :style="{ width: item.approved_status.approved + 'px' }" class="approved">&nbsp;</div>
                          <div :style="{ width: item.approved_status.pending + 'px' }" class="pending">&nbsp;</div>
                          <div :style="{ width: item.approved_status.disapproved + 'px' }" class="disapproved">&nbsp;</div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="item-status">
                      <div v-tooltip="tooltip" :title="showPercentageFacebook(item.approved_status)">
                        <div>{{ item.approved_status.activated }}% Activated</div>
                        <div class="progress d-flex">
                          <div :style="{ width: item.approved_status.activated + 'px' }" class="activated">&nbsp;</div>
                          <div :style="{ width: item.approved_status.deactivated + 'px' }" class="deactivated">&nbsp;</div>
                          <div :style="{ width: item.approved_status.pending + 'px' }" class="pending-yellow">&nbsp;</div>
                          <div :style="{ width: item.approved_status.error + 'px' }" class="error">&nbsp;</div>
                        </div>
                      </div>
                    </div>
                  </template>
                </template>
              </transition> -->
                <div class="item-platform d-flex align-items-center" v-if="item.social_type == 'google'">
                  <img class="m-r-10" src="@shop/assets/images/google-g.svg" alt="" />
                  <!-- <div>Google Merchant</div> -->
                </div>
                <div class="item-platform d-flex align-items-center" v-else-if="item.social_type == 'facebook'">
                  <img src="@shop/assets/images/facebook-f.svg" class="m-r-10" alt />
                  <!-- <div>Facebook Catalog</div> -->
                </div>
                <div class="item-platform d-flex align-items-center" v-else-if="item.social_type == 'facebook_fbe'">
                  <img src="@shop/assets/images/fbe.svg" class="m-r-10" alt />
                  <!-- <div>Facebook</div> -->
                </div>
                <div class="item-market" v-if="item.market != null && item.social_type == 'google'">{{ item.market }}</div>
                <div class="item-market" v-else>
                  <!-- <a-popover overlayClassName="popover-availabel" placement="bottomLeft" trigger="hover">
                    <template slot="content">
                      Due to the recent change in Facebook API, you are temporarily unable to choose target market, language and currency in the app. Please go to
                      your Facebook Catalog account to view or edit these settings.
                    </template>
                    <div class="d-flex align-items-center" style="color: #5B86E5">
                      <div class="m-r-5">Not available</div>
                      <sh-icon :icon="['far', 'exclamation-circle']" />
                    </div>
                  </a-popover> -->
                </div>
                <div class="item-language" v-if="item.currency != null && item.language != null && item.social_type == 'google'">
                  {{ item.language }}/{{ item.currency }}
                </div>
                <div class="item-language" v-else>
                  <!-- <a-popover overlayClassName="popover-availabel" placement="bottomLeft" trigger="hover">
                    <template slot="content">
                      Due to the recent change in Facebook API, you are temporarily unable to choose target market, language and currency in the app. Please go to
                      your Facebook Catalog account to view or edit these settings.
                    </template>
                    <div class="d-flex align-items-center" style="color: #5B86E5">
                      <div class="m-r-5">Not available</div>
                      <sh-icon :icon="['far', 'exclamation-circle']" />
                    </div>
                  </a-popover> -->
                </div>
                <div class="item-bulk item-bulk-function">
                  <a-dropdown :trigger="['click']" placement="bottomRight">
                    <a-button class="bulk-action">
                      <sh-icon :icon="['far', 'ellipsis-h']" />
                    </a-button>
                    <a-menu slot="overlay" class="item-post-dropdown-menu">
                      <a-menu-item key="1">
                        <a @click="submitFeed(item.id)">Manual Submit</a>
                      </a-menu-item>
                      <a-menu-item key="2">
                        <a style="color: #eb5757" @click="deleteFeedItem(item)">Delete Feed</a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </div>
              </template>
              <template v-else-if="index == 1 && checkFacebookFeed() && isCloseSuggestUserBox == null">
                <div class="banner-encourage">
                  <div class="wrapper-encourage">
                    <div class="logo-fb-info d-flex align-items-center justify-content-center">
                      <img height="12px" src="@shop/assets/images/facebook-text.svg" alt />
                    </div>
                    <div>Now you can sync your product feed to Facebook Catalog.</div>
                    <open-popup @on-pusher="onPusher" :social_type="socialType"
                      ><template slot="popup">
                        <div class="action">
                          <div class="sync-now-btn">
                            <img src="@shop/assets/images/sync-now.png" alt />
                          </div></div></template
                    ></open-popup>
                    <div @click.stop.prevent="closeAdvertise" class="close-icon-advertise"><sh-icon style="color: #AFBBD6" :icon="['fal', 'times']" /></div>
                  </div>
                </div>
              </template>
            </div>
          </template>
          <template v-else>
            <div class="display-notifications-list">
              <img src="@shop/assets/images/no-product-feed.svg" alt />
              <h4 class="m-t-20">You don’t have any Feed</h4>
              <button @click="showModalAddTemplate = true" class="ant-btn ant-btn-primary btn-add-template">
                <sh-icon class="m-r-10" :icon="['far', 'plus']" />Add Feed
              </button>
            </div>
          </template>
        </div>
      </transition>
    </div>
    <ModalAddFeedTemplate v-if="showModalAddTemplate" :visible.sync="showModalAddTemplate" @success="onLoginSuccess" :list_templates="list" />
  </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import ModalAddFeedTemplate from './add-feed/modal-add-feed-template'
export default {
  name: 'FeedCenter',
  metaInfo: {
    title: 'Feed Center',
  },
  components: {
    ModalAddFeedTemplate,
  },
  data: function() {
    return {
      isHidden: false,
      tooltip: {
        contentAsHTML: true,
        side: 'bottom',
        maxWidth: 200,
        theme: 'custom-percentage-box',
        trigger: 'hover',
        repositionOnScroll: true,
      },
      list: [],
      spinning: true,
      showModalAddTemplate: false,
      approvedStatus: [],
      spinningStatus: true,
      isCloseBanner: null,
      socialType: 'facebook',
      isCloseSuggestUserBox: null,
      isShowModalSuggest: '',
    }
  },
  computed: {
    ...mapGetters({
      getCloseBanner: 'feed/getCloseBanner',
      shop: 'auth/getShop',
      getListFeed: 'feed/getListFeed',
      getTempBanner: 'feed/getTempBanner',
    }),
  },
  methods: {
    ...mapActions({
      getListFeedTemplate: 'feed/getListFeedTemplate',
      updateStatusFeedCenter: 'feed/updateStatusFeedCenter',
      resubmitFeed: 'feed/resubmitFeed',
      deleteFeed: 'feed/deleteFeed',
      getStatisticsStatus: 'feed/getStatisticsStatus',
    }),
    ...mapMutations({
      setListFeed: 'feed/setListFeed',
      setTempBanner: 'feed/setTempBanner',
      setIndexCopy: 'feed/setIndexCopy',
    }),
    ellipsisText(text) {
      if (text.length > 35) {
        return text.substr(0, 10) + '...' + text.substr(text.length - 10, text.length)
      }
      return text
    },
    copyUrl({ value, event }) {
      this.setIndexCopy(value)
      this.$clipboard(value.xml_file)
    },
    checkFacebookFeed() {
      var isCheckFacebookExist = this.getListFeed.some(function(o) {
        return o['social_type'] === 'facebook' || o['social_type'] === 'facebook_fbe'
      })
      if (isCheckFacebookExist) {
        return false
      } else {
        return true
      }
    },
    onPusher(res) {
      var infoAccount = res.data
      var channel = infoAccount.hasOwnProperty('social_type') ? { accountInfo: infoAccount } : infoAccount
      this.redirect({
        name: 'CreateFeed',
        params: {
          channel,
        },
      })
    },
    closeBox() {
      this.setTempBanner(false)
      // this.isCloseBanner = 'true'
      // localStorage.setItem(`isCloseBanner_${this.shop.id}`, 'true')
    },
    closeAdvertise() {
      this.isCloseSuggestUserBox = 'true'
      localStorage.setItem(`isCloseSuggestUserBox_${this.shop.id}`, 'true')
    },
    accessWebsite() {
      window.open(
        'https://socialhead.io/blog/socialhead-partnered-up-with-facebook-in-their-latest-social-commerce-revolution/?utm_source=innapp&utm_medium=banner&utm_campaign=partnership-facebook&utm_content=socialshop',
        '_blank'
      )
    },
    getStatus() {
      this.spinningStatus = true
      return new Promise((resolve, reject) => {
        this.getStatisticsStatus()
          .then((res) => {
            let { status, data } = res.data
            if (status) {
              this.approvedStatus = data
              var id = ''
              this.list.forEach((element) => {
                id = element.id
                if (!element.hasOwnProperty('approved_status')) {
                  this.spinningStatus = true
                  this.approvedStatus.forEach((item) => {
                    if (id == item.ss_feed_id) {
                      element['approved_status'] = item.approved_status
                    }
                  })
                }
              })
              this.spinningStatus = false
            }
            resolve()
          })
          .catch((err) => {
            this.toastError({
              title: 'Error',
              message: message,
            })
            resolve()
          })
      })
    },
    displayNotice(item) {
      if (item.social_type == 'facebook_fbe') {
        return '<div class="m-t-10">Please be informed that the action "Delete Feed" will also uninstall Facebook Business Extension (FBE) connected with your business from our platform.</div>'
      }
      return ''
    },
    deleteFeedItem(item) {
      var ss_feed_id = item.id
      this.$confirm({
        confirmLoading: true,
        title: 'Delete Feed',
        content: `Your feed will be deleted from the app ${this.displayNotice(
          item
        )}<hr><br>Besides, by ticking the checkbox, you agree that the feed will be deleted on Google Merchant Center and Facebook Catalog as well. Do you want to delete?`,
        okText: 'Delete',
        cancelText: 'Cancel',
        okType: 'outline-danger',
        wrapClassName: 'custom-dialog-confirm',
        checkbox: true,
        checkboxValue: false,
        checkboxContent: 'Yes, delete the feed from shopping platforms',
        onOk: ({ checkbox }) => {
          return new Promise((resolve, reject) => {
            this.deleteFeed({ ss_feed_id, deleted_on_chanel: checkbox })
              .then((res) => {
                let { status, message } = res.data
                if (status) {
                  this.toastSuccess({
                    title: 'Done !',
                    message: 'Deleted Successfully',
                  })
                  this.listFeed()
                  // this.getStatus()
                } else {
                  this.toastError({
                    title: 'Error',
                    message: message,
                  })
                }
                resolve()
              })
              .catch((err) => {
                this.toastError({
                  title: 'Error',
                  message: 'Can not delete',
                })
                resolve()
              })
          })
        },
        onCancel: () => {},
      })
    },
    onSelect($event, id, type, index) {
      var target = $($event.target)
      if (index !== 1) {
        if (!target.is('.item-bulk-function *, .item-switch-function *, .item-url-function *')) {
          this.redirect({
            name: 'FeedDetail',
            params: {
              id,
            },
          })
        }
      }
    },
    showPercentageGoogle(number) {
      return `<div class="d-flex align-items-center"><div class="approved m-r-10"></div><div class="text-approved m-r-10">Approved:</div><div>${number.approved}%</div></div><br>
      <div class="d-flex align-items-center"><div class="pending m-r-10"></div><div class="text-pending m-r-10">Pending:</div><div>${number.pending}%</div></div><br>
      <div class="d-flex align-items-center"><div class="disapproved m-r-10"></div><div class="text-disapproved m-r-10">Disapproved:</div><div>${number.disapproved}%</div></div>`
    },
    showPercentageFacebook(number) {
      return `<div class="d-flex align-items-center"><div class="approved m-r-10"></div><div class="text-approved m-r-10">Activated:</div><div>${number.activated}%</div></div><br>
      <div class="d-flex align-items-center"><div class="pending m-r-10"></div><div class="text-pending m-r-10">Deactivated:</div><div>${number.deactivated}%</div></div><br>
      <div class="d-flex align-items-center"><div class="pending-yellow-bg m-r-10"></div><div class="text-pending-yellow m-r-10">Pending:</div><div>${number.pending}%</div></div><br>
      <div class="d-flex align-items-center"><div class="disapproved m-r-10"></div><div class="text-disapproved m-r-10">Error:</div><div>${number.error}%</div></div>`
    },
    listFeed() {
      this.spinning = true
      return new Promise((resolve, reject) => {
        this.getListFeedTemplate()
          .then((res) => {
            let { status, data, message } = res.data
            if (status) {
              if (data) {
                this.list = data
                if (this.list.length > 0) {
                  this.list.splice(1, 0, '')
                }
                this.setListFeed(this.list)
              }
            } else {
              this.toastError({
                title: 'Error',
                message: message,
              })
            }
            resolve()
          })
          .catch((res) => {
            reject()
          })
          .finally(() => {
            this.spinning = false
            resolve()
          })
      })
    },
    onChangeStatus(id, checked) {
      var ss_feed_id = id
      var status = checked
      if (status) {
        this.toastSuccess({
          title: 'Feed Enabled',
          message: 'Your feed has been enabled. We will submit the feed soon.',
        })
      } else {
        this.toastSuccess({
          title: 'Disable Feed',
          message: 'Feed disable success',
        })
      }
      this.updateStatusFeedCenter({ ss_feed_id, status })
        .then((res) => {})
        .catch((res) => {
          console.log(res)
        })
        .finally(() => {})
    },
    submitFeed(id) {
      var ss_feed_id = id
      this.resubmitFeed({ ss_feed_id })
        .then((res) => {
          let { status, message } = res.data
          if (status) {
            this.toastSuccess({
              title: 'Feed Submitting',
              message: 'The feed is submitting to the channel.',
            })
          } else {
            this.toastError({
              title: 'Error',
              message: message,
            })
          }
        })
        .catch((res) => {
          console.log(res)
        })
        .finally(() => {})
    },
    onLoginSuccess(payload) {
      // this.setupInfo = this.$clone(payload)
      // this.showModalSubmitTemplate = true
      var channel = payload.hasOwnProperty('social_type') ? { accountInfo: payload } : payload
      this.redirect({
        name: 'CreateFeed',
        params: {
          channel,
        },
      })
    },
    statusFeed(status) {
      if (status == 'submitting') {
        return 'Submitting feed to Channel'
      } else if (status == 'reassigning') {
        return 'Updating products in feed '
      } else if (status == 'fetching') {
        return 'Fetching status from Channel'
      } else if (status == 'syncing') {
        return 'Syncing from product sources'
      }
      return ''
    },
    checkProcessing(item) {
      if (item.status_processing !== null && item.status_processing != 'done') {
        return true
      }
      return false
    },
  },
  async mounted() {
    this.isCloseBanner = JSON.parse(localStorage.getItem(`isCloseBanner_${this.shop.id}`)) //handle close box banner and store
    this.isCloseSuggestUserBox = JSON.parse(localStorage.getItem(`isCloseSuggestUserBox_${this.shop.id}`)) //handle close box upsell
    await this.listFeed()
    // await this.getStatus()
  },
}
</script>

<style lang="scss" scoped>
.list-template {
  font-size: 14px;
  .custom-list-template {
    padding: 24px 24px 0 24px;
    margin-bottom: 24px;
  }
  .title-feed-center {
    padding: 24px 24px 0 24px;
    background: $white;
  }
  .banner-introduction {
    background: $white;
    padding: 24px 24px 0 24px;
    img {
      cursor: pointer;
    }
    position: relative;
    .close-icon {
      position: absolute;
      cursor: pointer;
      right: 40px;
      top: 26px;
      font-size: 20px;
      font-weight: 300;
      color: #ffffff;
      opacity: 0.3;
      &:hover {
        opacity: 1;
      }
    }
  }
  .display-notifications-list {
    text-align: center;
    margin: 30px 0;
  }
  .btn-add-template {
    width: 130px;
  }
  .item {
    &-list-template {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
      margin-left: 0 -10px;
      background: #fff;
      border-bottom: 0.5px solid #e2e2e2;
      border-left: 0.5px solid #e2e2e2;
      border-right: 0.5px solid #e2e2e2;
      padding: 10px 0;
    }
    &-heading {
      font-weight: 500;
      font-size: 14px;
      color: #000000;
      border-radius: 6px 6px 0px 0px;
      border-bottom: 2px solid #cecece;
      border: 0.5px solid #e2e2e2;
      min-height: 40px;
      .item-switch {
        @include col;
        flex-grow: 0;
        width: 83px;
      }
      .item-name {
        @include col;
        flex-grow: 0.3;
        width: 120px;
      }
      .item-url {
        @include col;
        flex-grow: 0.3;
        width: 120px;
        margin-right: 52px;
      }
      .item-id {
        @include col;
        flex-grow: 0.2;
        width: 120px;
        margin-right: 20px;
      }
      .item-status {
        @include col;
        flex-grow: 0.1;
        width: 130px;
      }
      .item-platform {
        @include col;
        flex-grow: 0.2;
      }
      .item-market {
        @include col;
        flex-grow: 0.2;
      }
      .item-language {
        @include col;
        flex-grow: 0.3;
      }
      .item-bulk {
        @include col;
        flex-grow: 0;
        padding: 0 10px;
      }
    }
    &-row {
      color: black;
      padding: 15px 0;
      cursor: pointer;
      &:hover {
        background-color: #f3f3f3;
        border-radius: 0;
        .name-url {
          background: $white;
          border: 0.5px solid $light-gray1 !important;
          border-radius: 4px;
        }
        .active-copied {
          background: $white;
          border-radius: 4px;
          border: 0.5px solid $light-gray1 !important;
        }
      }
      .item-switch {
        @include col;
        flex-grow: 0;
        padding: 0 20px;
      }
      .item-name {
        @include col;
        flex-grow: 0.3;
        display: inline-block;
        width: 130px;
        white-space: nowrap;
        font-weight: 500;
        overflow: hidden !important;
        text-overflow: ellipsis;
        .feed-processing {
          font-size: 12px;
          color: $primary-color;
          font-weight: normal;
          .loading-indicator {
            color: rgb(91, 134, 229);
            align-self: center;
            font-size: 3px; /* <-- adjust size here! */
            margin-top: 6px;
            margin-left: 3px;
            text-align: center;
            vertical-align: middle;
            box-sizing: border-box;
            transition: color 150ms ease 0s;
          }

          .dot-1 {
            animation-duration: 1s;
            animation-delay: 0ms;
            animation-iteration-count: infinite;
            animation-name: react-select-loading-indicator;
            animation-timing-function: ease-in-out;
            background-color: rgb(91, 134, 229);
            display: inline-block;
            height: 1em;
            vertical-align: top;
            width: 1em;
            border-radius: 1em;
          }

          .dot-2 {
            animation-duration: 1s;
            animation-delay: 160ms;
            animation-iteration-count: infinite;
            animation-name: react-select-loading-indicator;
            animation-timing-function: ease-in-out;
            background-color: rgb(91, 134, 229);
            display: inline-block;
            margin-left: 1em;
            height: 1em;
            vertical-align: top;
            width: 1em;
            border-radius: 1em;
          }

          .dot-3 {
            animation-duration: 1s;
            animation-delay: 320ms;
            animation-iteration-count: infinite;
            animation-name: react-select-loading-indicator;
            animation-timing-function: ease-in-out;
            background-color: rgb(91, 134, 229);
            display: inline-block;
            margin-left: 1em;
            height: 1em;
            vertical-align: top;
            width: 1em;
            border-radius: 1em;
          }

          @keyframes react-select-loading-indicator {
            0%,
            80%,
            100% {
              opacity: 0;
            }

            40% {
              opacity: 1;
            }
          }
        }
      }
      .item-url {
        @include col;
        flex-grow: 0.3;
        display: inline-block;
        font-weight: 500;
        margin-right: 13px;
        display: flex;
        width: 164px;
        .name-url {
          width: 160px;
          overflow: hidden !important;
          color: $dark-gray2;
          white-space: nowrap;
          border: 0.5px solid $white;
          border-radius: 4px;
        }
        .active-copied {
          background: $white;
          border-radius: 4px;
          width: 25px;
          text-align: center;
        }
        .animate-copy {
          font-size: 10px;
          margin-left: 5px;
          animation: disappear 1s linear;
        }
        .copy-alert {
          opacity: 0;
        }

        @keyframes disappear {
          30% {
            opacity: 0;
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      }
      .item-status {
        @include col;
        flex-grow: 0.1;
        padding: 0 0;
        width: 130px;
        border-radius: 2px;
        .progress {
          height: 4px;
          width: 100px;
          position: relative;
          margin-top: 8px;
          .approved,
          .activated {
            background-color: #2ad572;
            height: 4px;
          }
          .pending,
          .deactivated {
            background-color: #e2e2e2;
            height: 4px;
          }
          .pending-yellow {
            background-color: #f2c94c;
            height: 4px;
          }
          .disapproved,
          .error {
            background-color: $danger;
            height: 4px;
          }
        }
      }
      .item-platform {
        @include col;
        flex-grow: 0.2;
        width: 53px;
        .custom-img-google {
          border: 1px solid #e2e2e2;
          border-radius: 2px;
          display: flex;
        }
      }
      .item-market {
        @include col;
        flex-grow: 0.2;
        padding: 0 5px;
        width: 53px;
      }
      .item-language {
        @include col;
        flex-grow: 0.3;
        padding: 0 5px;
        width: 51px;
      }
      .item-bulk {
        @include col;
        flex-grow: 0;
        margin-left: 58px;
        margin-right: 24px;
        .bulk-action {
          width: 32px;
          height: 32px;
          padding: 0;
          background: #ffff;
          font-size: 18px;
          border: 1px solid transparent;
          color: $text;
          box-shadow: none;
          overflow: hidden;
          &:hover,
          &:focus {
            background: #e2e2e2;
            border: 1px solid transparent;
            color: $text;
          }
          &.ant-dropdown-open {
            color: $text;
            background-color: #e2e2e2;
            border: 1px solid transparent;
          }
        }
      }
      .item-id {
        @include col;
        flex-grow: 0.2;
        display: inline-block;
        width: 130px;
        white-space: nowrap;
        overflow: hidden !important;
        text-overflow: ellipsis;
        margin-right: 16px;
        color: $dark-gray3;
      }
    }
    .box-product-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
    }
  }
}
</style>
<style lang="scss">
.banner-encourage {
  color: $dark-gray2;
  border-bottom: 1px solid #eaeaea;
  background: $light-primary2;
  border-radius: 4px;
  position: relative;
  .wrapper-encourage {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 0;
    .close-icon-advertise {
      position: absolute;
      right: 10px;
      top: 5px;
      cursor: pointer;
      &:hover {
        opacity: 0.5;
      }
    }
    .logo-fb-info {
      background: #4080ff;
      border-radius: 4px;
      width: 20px;
      height: 20px;
      margin-right: 15px;
    }
    .sync-now-btn {
      background: #ee9746;
      border-radius: 4px;
      height: 25px;
      margin-left: 30px;
      cursor: pointer;
      &:hover {
        opacity: 0.5;
      }
    }
  }
}
.popover-availabel {
  .ant-popover-content {
    width: 300px;
    text-align: center;
  }
}
.custom-dialog-confirm {
  .vue-modal-confirm-dialog-content {
    margin-bottom: 10px;
  }
  .ant-btn {
    &.ant-btn-danger {
      background-color: $danger;
      color: $white;
    }
  }
}
.custom-percentage-box {
  .approved {
    background-color: #2ad572;
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }
  .text-approved {
    color: #2ad572;
    font-weight: 500;
  }
  .pending {
    background-color: #e2e2e2;
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }
  .text-pending {
    color: #cecece;
    font-weight: 500;
  }
  .pending-yellow-bg {
    background-color: #f2c94c;
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }
  .text-pending-yellow {
    color: #f2c94c;
    font-weight: 500;
  }
  .disapproved {
    background-color: $danger;
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }
  .text-disapproved {
    color: $danger;
    font-weight: 500;
  }
}
</style>
