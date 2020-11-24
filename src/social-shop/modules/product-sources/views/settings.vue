<template>
  <div class="product-sources-settings pt-5">
    <div v-if="Object.keys(this.original_settings).length === 0" class="mt-5 pt-5 d-flex align-items-center justify-content-center">
      <a-spin>
        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
      </a-spin>
    </div>

    <template v-else>
      <div class="row">
        <div class="col col-md-3">
          <h2 class="title">
            Source Settings
          </h2>
        </div>
        <div class="col col-md-9">
          <div>
            <div class="setting-row p-t-0">
              <div>
                <SettingsSourceAccountInfo :count_product="settings.count_product" />
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-label">
                Product Title & Description Preference
              </div>
              <div class="setting-value">
                <a-radio-group :options="use_seo_options" v-model="settings.use_seo" />
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-label ">
                Include variants
              </div>
              <div class="setting-value">
                <a-radio-group :options="include_variant_options" v-model="settings.include_variant" />
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-label">
                Hidden Product
              </div>
              <div class="setting-value d-flex align-items-center">
                <a-switch v-model="settings.import_unpublished" class="mr-2" />
                Import unpublish product
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-label d-flex align-items-center">
                <div class="m-r-5">Price setting</div>
                <a-popover overlayClassName="popover-introduce-setting" placement="bottom" trigger="hover" class="d-flex align-items-center">
                  <template slot="content">
                    <b>If you enable</b> this setting, our app will sync both the Price and Compare At Price and upload them to Google Merchant Center/Facebook
                    Catalog.<br /><br />
                    <b>If you disable</b> this setting, our app will only sync the Price and upload it to Google Merchant Center/Facebook Catalog.
                  </template>
                  <sh-icon style="color: #5B86E5;" :icon="['far', 'question-circle']" />
                </a-popover>
              </div>
              <div class="setting-value d-flex align-items-center">
                <a-switch v-model="settings.compare_at_price" class="mr-2" />
                Import Compare at price
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="setting-footer mt-3">
        <a-button v-show="is_changing_settings" @click="onClickDiscardSettings">
          Discard Settings
        </a-button>

        <a-button type="primary" class="ml-3" :disabled="!is_changing_settings || is_submiting" @click="onSubmit">
          Save & Resync
        </a-button>
      </div>
    </template>
  </div>
</template>

<script>
import api from '../api'
import SettingsSourceAccountInfo from '../components/settings/settings-source-account-info'

import { mapGetters, mapActions } from 'vuex'
import { isEqual } from 'lodash'

export default {
  components: {
    SettingsSourceAccountInfo,
  },

  name: 'ProductSourcesSettings',

  metaInfo: {
    title: 'Settings',
  },

  data() {
    return {
      is_submiting: false,

      use_seo_options: [
        { label: 'Use default content', value: false },
        { label: 'Use SEO content', value: true },
      ],

      include_variant_options: [
        { label: 'First variant', value: 'first_variant' },
        { label: 'All variants', value: 'all_variant' },
      ],

      settings: {
        count_product: 0,
        use_seo: false,
        include_variant: 'first_variant',
        import_unpublished: false,
        compare_at_price: false,
      },
    }
  },

  computed: {
    ...mapGetters({
      original_settings: 'product/getSettings',
    }),

    is_changing_settings() {
      if (!isEqual(this.settings, this.original_settings)) {
        return true
      }
      return false
    },
  },

  created() {
    if (Object.keys(this.original_settings).length === 0) {
      this.getProductSettings()
    } else {
      this.settings = JSON.parse(JSON.stringify(this.original_settings))
      this.getProductSettings()
    }
  },

  methods: {
    ...mapActions({
      setSettings: 'product/setSettings',
    }),

    async getProductSettings() {
      try {
        const response = await api.getShopSettings()
        const { status, data, message } = response.data

        if (!status) {
          this.toastError({
            title: 'Error',
            message: message,
          })
          return
        }
        this.initData(data)
      } catch (error) {
        this.toastError({
          title: 'Error',
          message: 'An error has occurred.',
        })
      }
    },

    async onSubmit() {
      this.is_submiting = true
      try {
        let response = await api.updateShopSettings(this.settings)
        const { status, data, message } = response.data

        if (!status) {
          this.toastError({
            title: 'Error',
            message: message,
          })
          return
        }

        this.initData(data)
        this.toastSuccess({
          title: 'Success',
          message: 'Update successful.',
        })
      } catch (error) {
        this.toastError({
          title: 'Error',
          message: 'Update settings failed',
        })
      } finally {
        this.is_submiting = false
      }
    },

    onClickDiscardSettings() {
      this.$confirm({
        btnSaveClass: 'btn btn-primary',
        title: 'Cancel Without Saving',
        content: 'Are you sure you want to cancel this setting?',
        okText: 'Discard',
        cancelText: 'Cancel',
        onClose: null,
        okType: 'outline-danger',
        onOk: () => {
          this.settings = JSON.parse(JSON.stringify(this.original_settings))
        },
      })
    },

    initData(data) {
      try {
        const { use_seo, include_variant, import_unpublished, count_product, compare_at_price } = data

        let settings = {
          use_seo,
          include_variant: include_variant.toLowerCase(),
          import_unpublished,
          compare_at_price,
        }

        if (count_product || count_product === 0) {
          settings = Object.assign(settings, {
            count_product,
          })
        }

        this.setSettings(settings)
        this.settings = Object.assign(this.settings, settings)
      } catch (e) {}
    },
  },

  beforeRouteLeave(to, from, next) {
    if (this.is_changing_settings && Object.keys(this.original_settings).length) {
      this.$confirm({
        title: 'Discard Changes',
        content: "The changes won't be saved. Do you want to leave this page?",
        okText: 'Discard',
        cancelText: 'Cancel',
        okType: 'outline-danger',
        zIndex: 10002,
        onOk: () => {
          next()
        },
        onCancel: () => {},
      })
    } else {
      next()
    }
  },
}
</script>

<style lang="scss" scoped>
.product-sources-settings {
  width: 100%;
  max-width: 830px;
  margin: 0 auto;
  font-size: 14px;

  h2.title {
    font-size: 18px;
  }

  .setting-row {
    padding: 11px 0;

    .setting-label {
      font-weight: 500;
      margin-bottom: 5px;
    }
  }

  .setting-footer {
    border-top: 1px solid #d8d8d8;
    padding: 30px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

<style lang="scss">
.popover-introduce-setting {
  .ant-popover-content {
    width: 300px;
  }
}
.product-sources-settings {
  *:focus {
    outline: none;
  }
}
</style>
