<template>
  <div class="setup-account">
    <transition name="fade" mode="out-in">
      <form @submit.prevent="submitForm">
        <div class="title-setup-product">Set up your Product Source First</div>
        <div class="setting-row mt-3">
          <div class="setting-label m-r-12">Source Collections</div>
          <div class="setting-value">
            <a-radio-group :options="type_get_product_options" v-model="filter_setting.type_get_product" />
            <div v-if="filter_setting.type_get_product === 'specific_collections'">
              <SelectSourceCollections :collections.sync="filter_setting.collections" :count_products="getAuthSetupInfo.count_products" />
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center m-t-4">
          <div class="title-seo m-r-14">SEO title & descriptions</div>
          <div>
            <a-radio-group v-model="seoTitle">
              <a-radio :value="false">Use default title</a-radio>
              <a-radio :value="true">Use from SEO</a-radio>
            </a-radio-group>
          </div>
        </div>
        <div class="d-flex align-items-center m-t-16">
          <div class="title-seo separate-distance">Include variants</div>
          <div>
            <a-radio-group v-model="variant">
              <a-radio class="m-r-35" value="first_variant">First variant</a-radio>
              <a-radio value="all_variant">All variants</a-radio>
            </a-radio-group>
          </div>
        </div>
        <div class="d-flex align-items-center m-t-16">
          <div class="title-seo separate-distance">Hidden Product</div>
          <div class="d-flex">
            <a-switch v-model="hiddenProduct" />
            <div class="m-l-10">Import unpublish product</div>
          </div>
        </div>
        <div class="d-flex align-items-center m-t-16">
          <div class="title-seo d-flex align-items-center" style="margin-right: 49px">
            <div class="m-r-5">Price setting</div>
            <div style="width: 30px">
              <a-popover overlayClassName="popover-introduce" placement="bottom" trigger="hover" class="d-flex align-items-center">
                <template slot="content">
                  <b>If you enable</b> this setting, our app will sync both the Price and Compare At Price and upload them to Google Merchant Center/Facebook
                  Catalog.<br /><br />
                  <b>If you disable</b> this setting, our app will only sync the Price and upload it to Google Merchant Center/Facebook Catalog.
                </template>
                <sh-icon style="color: #5B86E5;" :icon="['far', 'question-circle']" />
              </a-popover>
            </div>
          </div>
          <div class="d-flex">
            <a-switch v-model="comparePrice" />
            <div class="m-l-10">Import Compare at price</div>
          </div>
        </div>
        <hr class="m-r-48 m-t-20" />
        <div class="start-btn">
          <a-button type="primary" :loading="loading" html-type="submit" :class="{ 'allow-confirm': isDisabled(isAllowNext) }" class="set-width-btn"
            >Get Start</a-button
          >
        </div>
      </form>
    </transition>
  </div>
</template>
<script>
import SelectSourceCollections from '../../product-sources/components/filter/select-source-collections'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'FormSetupMerchantGoogle',
  data() {
    return {
      type_get_product_options: [
        { label: 'All Product', value: 'all_product' },
        { label: 'Specific Collections', value: 'specific_collections' },
      ],
      filter_setting: {
        type_get_product: 'all_product',
        collections: [],
        count_products: [],
      },
      seoTitle: true,
      hiddenProduct: true,
      variant: 'first_variant',
      isAllowNext: false,
      loading: false,
      comparePrice: true,
    }
  },
  components: {
    SelectSourceCollections,
  },
  computed: {
    ...mapGetters({
      getAuthSetupInfo: 'auth/getAuthSetupInfo',
    }),
  },
  methods: {
    ...mapActions({
      updateAuthSetup: 'auth/updateAuthSetup',
    }),
    isDisabled(allow) {
      if (this.filter_setting.type_get_product == 'all_product') {
        return (allow = true)
      }

      if (this.filter_setting.type_get_product == 'specific_collections' && this.filter_setting.collections.length > 0) {
        return (allow = true)
      }
    },
    submitForm() {
      this.loading = true
      let payload = {
        type_get_product: this.filter_setting.type_get_product,
        collection_ids: this.filter_setting.collections.map((item) => item.internal_id),
        use_seo: this.seoTitle,
        import_unpublished: this.hiddenProduct,
        include_variant: this.variant,
        compare_at_price: this.comparePrice,
      }
      this.updateAuthSetup(payload)
        .then(async (res) => {
          let { status, message } = res.data
          if (status) {
            try {
              await this.$store.dispatch('auth/getAuthSetupInfo', { responseInfo: true })
            } catch (error) {}
            this.redirect({ name: 'FeedCenter' })
          } else {
            this.toastError({
              title: 'Error',
              message: message,
            })
          }
        })
        .catch((res) => {})
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss" scope>
.setup-account {
  width: 720px;
  margin: 0 auto;
  .title-setup-product {
    font-weight: 500;
    font-size: 22px;
    text-transform: uppercase;
    color: $text;
    letter-spacing: 0.125em;
    margin-top: 30px;
  }
  .setting-row {
    display: flex;
    padding: 11px 0;

    .setting-label {
      width: 160px;
      font-weight: 500;
    }

    .setting-value {
      width: 500px;
    }
  }
  .title-seo {
    font-weight: 500;
    &.separate-distance {
      margin-right: 65px;
    }
  }
  .allow-confirm {
    background: $primary-color !important;
    color: $white !important;
    cursor: pointer !important;
    pointer-events: auto !important;
    opacity: 1 !important;
  }
  .start-btn {
    text-align: right;
    margin-right: 47px;
    margin-top: 20px;

    .set-width-btn {
      width: 163px;
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
}
</style>

<style lang="scss">
.setup-account {
  *:focus {
    outline: none;
  }
  .setting-row {
    .ant-radio-wrapper {
      margin-right: 39px;
    }
  }

  .collection-items .collection-list-body {
    max-height: 170px;
  }
}
.popover-introduce {
  .ant-popover-content {
    width: 300px;
  }
}
</style>
