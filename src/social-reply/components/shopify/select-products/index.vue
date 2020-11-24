<template>
  <div class="select-products">
    <slot>
      <div>
        <a-tooltip placement="top">
          <template slot="title">Search Products</template>
          <sh-icon
            :icon="['far', 'tag']"
            class="f-18"
            style="color: #4f4f4f;"
            @click="visible = true"
          />
        </a-tooltip>
      </div>
    </slot>

    <a-modal
      v-model="visible"
      :title="false"
      :footer="false"
      :centered="true"
      class="modal-select-products"
      :body-style="{ padding: '' }"
      width="600px"
    >
      <div class="modal-select-products">
        <div class="f-20 font-medium flex items-center p-l-16" style="height: 64px;">Search Products</div>
        <!--  -->
        <div class="border-b p-l-16 p-r-16 p-b-16">
          <search-input v-model="keyword" @input="is_typing = true" @submit="onSearch" />
        </div>
        <!--  -->
        <div v-if="is_loading" class="list-products-wraper center">
          <fa-spin />
        </div>

        <div
          class="list-products-wraper center"
          v-else-if="!is_loading && !is_typing && keyword === '' && isEmpty(products)"
        >You don't have any product on Shopify</div>

        <div
          class="list-products-wraper center"
          v-else-if="!is_loading && !is_typing && !isEmpty(keyword) && isEmpty(products)"
        >Product not found</div>

        <div v-else class="list-products-wraper list-products overflow-auto">
          <template v-for="item in products">
            <ProductSimpleItem
              :limit="limit"
              v-if="item.variants.length === 1"
              :key="item.id"
              :product="item"
              v-model="selected"
            />
            <ProductVariants
              v-if="item.variants.length > 1"
              :key="item.id"
              :limit="limit"
              :product="item"
              v-model="selected"
            />
          </template>
        </div>
        <!--  -->
        <div class="p-t-16 p-b-16 flex content-center">
          <fa-button
            class="m-r-4"
            type="primary"
            :disabled="isEmpty(previous) || is_loading"
            @click="handleFetch({ rel: 'previous', cursor: previous })"
          >Prev</fa-button>

          <fa-button
            class="m-l-4"
            type="primary"
            :disabled="isEmpty(next) || is_loading"
            @click="handleFetch({ rel: 'next', cursor: next })"
          >Next</fa-button>
        </div>
        <!--  -->

        <div class="p-b-16 p-t-16 p-r-16 border-t flex" v-if="limit !== 1">
          <div class="flex-1 flex items-center p-l-16">
            <div>{{ `${selected.length}/5 Selected` }}</div>
            <a class="m-l-8" @click="onUncheckAll">Uncheck all</a>
          </div>

          <fa-button @click="onCancel">Cancel</fa-button>

          <fa-button type="primary" @click="onApply" class="m-l-8" :disabled="disabled">Insert</fa-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import ProductSimpleItem from "./product-simple-item";
import ProductVariants from "./product-variants";

export default {
  components: {
    ProductSimpleItem,
    ProductVariants,
  },

  props: {
    limit: {
      type: Number,
      default: 0,
      required: false,
    },
  },

  data() {
    return {
      is_loading: false,
      is_typing: false,

      keyword: "",

      selected: [],

      next: "",
      previous: "",

      products: [],

      visible: false,
    };
  },

  computed: {
    disabled() {
      return this.selected ? this.selected.length <= 0 : true;
    },
  },

  watch: {
    visible(val) {
      if (val) {
        this.selected = [];
        this.handleFetch({});
      }
    },

    selected(val) {
      if (this.limit === 1 && val.length === 1) {
        this.onApply();
      }
    },
  },

  methods: {
    async handleFetch({ cursor, rel }) {
      this.is_loading = true;
      try {
        const { data } = await this.$api.SHOPIFY.fetchProducts({
          keyword: this.keyword ? this.keyword : null,
          cursor,
          rel,
        });

        this.products = data.rows;
        this.previous = data.previous;
        this.next = data.next;
      } catch (error) {
      } finally {
        this.is_loading = false;
      }
    },

    onSearch() {
      this.is_typing = false;
      this.handleFetch({});
    },

    onClose() {
      this.visible = false;
      this.keyword = "";
      this.products = [];
      this.selected = [];
    },

    onApply() {
      const items = JSON.parse(JSON.stringify(this.selected));
      this.$emit("input", items);
      this.$emit("change", items);

      this.onClose();
    },

    onCancel() {
      this.onClose();
    },

    onUncheckAll() {
      this.selected = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.list-products-wraper {
  height: 360px;
  max-height: 360px;
}
</style>
