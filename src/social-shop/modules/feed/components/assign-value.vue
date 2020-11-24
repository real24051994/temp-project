<template>
  <div class="assign-value">
    <a-dropdown
      transitionName="fade"
      :getPopupContainer="() => $refs.dropdown"
      :trigger="['click']"
      placement="bottomRight"
      v-model="visibleAssignValue"
      class="custom-dropdown-collapsed"
    >
      <slot name="btn-trigger">
        <a-button class="btn-trigger"></a-button>
      </slot>
      <a-menu slot="overlay">
        <a-menu-item v-for="(item, index) in getAssignValue" :key="`index_${index}`" class="d-flex" @click="showModalAssignValue(item)">
          <div>Assign {{ item.name }}</div>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <div ref="dropdown"></div>
    <a-modal :maskClosable="false" :footer="null" :destroyOnClose="true" :title="'Assign ' + infoAssignValue.name" v-model="visibleModal">
      <form @submit.prevent="submitForm">
        <template v-if="infoAssignValue.value == 'additional_image_links'">
          <ImageLink :form_state.sync="formState" :assign_value.sync="infoAssignValue.content" :is_validate.sync="isValidate"></ImageLink>
        </template>
        <template v-else-if="infoAssignValue.value == 'age_group'">
          <AgeGroup :assign_value.sync="infoAssignValue.content" :is_validate.sync="isValidate" :form_state="formState"></AgeGroup>
        </template>
        <template
          v-else-if="
            infoAssignValue.value == 'color' ||
              infoAssignValue.value == 'pattern' ||
              infoAssignValue.value == 'custom_label_0' ||
              infoAssignValue.value == 'custom_label_1' ||
              infoAssignValue.value == 'custom_label_2' ||
              infoAssignValue.value == 'custom_label_3' ||
              infoAssignValue.value == 'custom_label_4'
          "
        >
          <ColorAndPatternAndCustomLabel
            :assign_value.sync="infoAssignValue.content"
            :place_holder="infoAssignValue.value"
            :form_state="formState"
            :is_validate.sync="isValidate"
          ></ColorAndPatternAndCustomLabel>
        </template>
        <template v-else-if="infoAssignValue.value == 'gender'">
          <Gender :assign_value.sync="infoAssignValue.content" :is_validate.sync="isValidate" :form_state="formState"></Gender>
        </template>
        <!-- <template v-else-if="infoAssignValue.value == 'google_product_category'">
          <GoogleProductCategory
            :assign_value.sync="infoAssignValue.content"
            :form_state="formState"
            :is_validate.sync="isValidate"
          ></GoogleProductCategory>
        </template> -->
        <template v-else-if="infoAssignValue.value == 'material'">
          <Material :assign_value.sync="infoAssignValue.content" :form_state="formState" :is_validate.sync="isValidate"></Material>
        </template>
        <template v-else-if="infoAssignValue.value == 'product_types'">
          <ProductType :assign_value.sync="infoAssignValue.content" :is_validate.sync="isValidate" :form_state="formState"></ProductType>
        </template>
        <template v-else-if="infoAssignValue.value == 'sale_price'">
          <SalePrice :assign_value.sync="infoAssignValue.content" :form_state="formState" :is_validate.sync="isValidate"></SalePrice>
        </template>
        <template v-else-if="infoAssignValue.value == 'sale_price_effective_date'">
          <SalePriceDatetime :is_validate.sync="isValidate" :assign_value.sync="infoAssignValue.content" :form_state="formState"></SalePriceDatetime>
        </template>
        <template v-else-if="infoAssignValue.value == 'shipping'">
          <Shipping :is_validate.sync="isValidate" :assign_value.sync="infoAssignValue.content" :form_state="formState"></Shipping>
        </template>
        <template v-else-if="infoAssignValue.value == 'shipping_weight'">
          <ShippingWeight :is_validate.sync="isValidate" :assign_value.sync="infoAssignValue.content" :form_state="formState"></ShippingWeight>
        </template>
        <template v-else-if="infoAssignValue.value == 'sizes'">
          <Size :is_validate.sync="isValidate" :assign_value.sync="infoAssignValue.content" :form_state="formState"></Size>
        </template>
        <template v-else-if="infoAssignValue.value == 'promotion_ids'">
          <PromotionId :assign_value.sync="infoAssignValue.content" :form_state="formState" :is_validate.sync="isValidate"></PromotionId>
        </template>
        <div class="d-flex justify-content-end m-t-30">
          <a-button @click="closeModal" class="m-r-10">Cancel</a-button>
          <button type="submit" class="ant-btn ant-btn-primary">Assign</button>
        </div>
      </form>
    </a-modal>
  </div>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import ImageLink from '../components/list-assign-value/image-link.vue'
import AgeGroup from '../components/list-assign-value/age-group.vue'
import ColorAndPatternAndCustomLabel from '../components/list-assign-value/color-pattern-customlabel.vue'
import Gender from '../components/list-assign-value/gender.vue'
// import GoogleProductCategory from "../components/list-assign-value/google-product-category.vue";
import Material from '../components/list-assign-value/material.vue'
import ProductType from '../components/list-assign-value/product-type.vue'
import SalePrice from '../components/list-assign-value/sale-price.vue'
import SalePriceDatetime from '../components/list-assign-value/sale-price-datetime.vue'
import Shipping from '../components/list-assign-value/shipping.vue'
import ShippingWeight from '../components/list-assign-value/shipping-weight.vue'
import Size from '../components/list-assign-value/size.vue'
import PromotionId from '../components/list-assign-value/promotion-id.vue'

export default {
  name: 'AssignValue',
  props: {
    value :{ 
      type : Array,
    }
  },
  data() {
    return {
      visibleAssignValue: false,
      visibleModal: false,
      infoAssignValue: { name: '', content: '', value: '' },
      formState: false,
      isValidate: false,
    }
  },
  components: {
    ImageLink,
    AgeGroup,
    ColorAndPatternAndCustomLabel,
    Gender,
    // GoogleProductCategory,
    Material,
    ProductType,
    SalePrice,
    SalePriceDatetime,
    Shipping,
    ShippingWeight,
    Size,
    PromotionId,
  },
  computed: {
    ...mapGetters({
      getAssignValue: 'feed/getAssignValue',
    }),
  },
  methods: {
    ...mapMutations({}),
    ...mapActions({
      bulkAssign: 'feed/bulkAssign',
    }),
    showModalAssignValue(value = {}) {
      this.visibleAssignValue = false
      this.visibleModal = true
      this.infoAssignValue = { ...value }
    },
    submitForm() {
      this.formState = true
      var feed_product_ids = this.value
      var value = this.infoAssignValue.content
      var field = this.infoAssignValue.value
      var ss_feed_id = this.$route.params.id
      if (!this.isValidate) {
        return new Promise((resolve, reject) => {
          this.bulkAssign({
            feed_product_ids,
            value,
            field,
            ss_feed_id,
          })
            .then((res) => {
              let { status } = res.data
              if (status) {
                this.toastSuccess({
                  title: 'Done !',
                  message: 'Assign Successfully',
                })
                this.$emit('reload')
                this.resetModal()
              } else {
                this.toastError({
                  title: 'Error',
                  message: 'Cannot assign',
                })
              }
            })
            .catch((res) => {
              reject()
              console.log(res)
            })
            .finally(() => {
              this.spinning = false
            })
        })
      }
    },
    closeModal() {
      this.resetModal()
    },
    resetModal() {
      this.formState = false
      this.visibleModal = false
      this.infoAssignValue.content = ''
    },
  },

  watch: {
    visibleModal: function(value) {
      if (value) {
        this.formState = false
      } else {
        this.infoAssignValue.content = ''
      }
    },
  },
}
</script>

<style lang="scss">
.assign-value {
  .ant-dropdown {
    top: 45px !important;
  }
  .ant-dropdown {
    height: 300px;
    max-height: calc(100vh - 410px - 80px);
    overflow: auto;
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    min-height: 200px;
  }

  .ant-dropdown::-webkit-scrollbar-track {
    -webkit-box-shadow: #f5f5f5;
    border-radius: 10px;
    background-color: #f5f5f5;
  }

  .ant-dropdown::-webkit-scrollbar {
    width: 7px;
    background-color: #f5f5f5;
  }

  .ant-dropdown::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
