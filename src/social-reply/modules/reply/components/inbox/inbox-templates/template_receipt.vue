<template>
  <div class="message-template-receipt" @click="show_modal = true">
    <div class="flex items-center">
      <div class="f-12 text-muted flex-1">
        Order confirmation
      </div>

      <div class="font-medium f-18">
        {{ payload.merchant_name }}
      </div>
    </div>

    <div class="product-items flex flex-col">
      <div
        class="product-item flex"
        v-for="(item, i) in payload.elements"
        :key="i"
      >
        <img :src="item.image_url" alt="" class="border" />

        <div class="flex flex-col p-l-16">
          <div class="line-clamp-2 break-word font-medium">
            {{ item.title }}
          </div>

          <div class="line-clamp-1 break-word f-12 text-secondary">
            {{ item.subtitle }}
          </div>
          <div class="f-12 text-secondary">
            {{ `Qty. ${item.quantity}` }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col m-t-12">
      <div class="f-12 text-muted">
        Paid with
      </div>
      <div class="f-12">
        {{ payload.payment_method }}
      </div>
    </div>

    <div class="flex flex-col m-t-12 m-b-12">
      <div class="f-12 text-muted">
        Ship to
      </div>

      <div class="f-12">
        {{ address_simple }}
      </div>
    </div>

    <div class="border-t flex items-center p-t-12">
      <div class="flex-1 text-secondary">
        Total
      </div>

      <div class="font-medium">
        {{ total }}
      </div>
    </div>

    <a-modal
      v-model="show_modal"
      :title="false"
      :footer="false"
      class="modal-select-products"
      :body-style="{ padding: '24px' }"
      width="500px"
    >
      <div class="flex flex-col">
        <div class="text-secondary p-b-16">
          Order Details
        </div>

        <div class="f-16 font-medium">
          {{ payload.merchant_name }}
        </div>

        <div class="flex flex-col p-b-24 border-b">
          <div
            class="flex m-t-12"
            v-for="(item, i) in payload.elements"
            :key="i"
          >
            <img
              :src="item.image_url"
              alt=""
              class="border thumbnail-product"
            />

            <div class="flex flex-col p-l-16 content-center">
              <div class="line-clamp-2 break-word font-medium">
                {{ item.title }}
              </div>

              <div class="line-clamp-1 break-word f-12 text-secondary">
                {{ item.subtitle }}
              </div>
              <div class="f-12 text-secondary" v-if="item.quantity > 1">
                {{ `Qty. ${item.quantity}` }}
              </div>

              <div class="f-12 text-secondary">
                {{ getMoney(item.price) }}
              </div>
            </div>
          </div>
        </div>

        <div class="m-t-16">
          <div class="f-12 text-muted">
            Ordered on
          </div>

          <div>
            {{ dateFormat(payload.timestamp * 1000, "E MMM d, yyyy h:mm a") }}
          </div>
        </div>
        <!--  -->

        <div class="m-t-16">
          <div class="f-12 text-muted">
            Ship to
          </div>

          <div>
            <p class="m-b-0">
              {{ payload.recipient_name }}
            </p>

            <p class="m-b-0">
              {{ `${address.street_1} ${address.street_2}` }}
            </p>

            <p class="m-b-0">
              {{ `${address.city}, ${address.state}` }}
            </p>

            <p class="m-b-2">
              {{ `${address.country}` }}
            </p>
          </div>
        </div>
        <!--  -->
        <div class="m-t-16">
          <div class="f-12 text-muted">
            Paid with
          </div>

          <div>
            {{ payload.payment_method }}
          </div>
        </div>
        <!--  -->

        <div class="m-t-16">
          <div class="f-12 text-muted">
            Summary
          </div>

          <div class="flex flex-col">
            <div class="flex">
              <div class="w-50">Subtotal</div>
              <div class="w-50">{{ getMoney(payload.summary.subtotal) }}</div>
            </div>

            <div class="flex m-t-2">
              <div class="w-50">Shipping & Handling</div>
              <div class="w-50">
                {{ getMoney(payload.summary.shipping_cost) }}
              </div>
            </div>

            <div
              class="flex m-t-2"
              v-for="(item, i) in payload.adjustments"
              :key="i + i"
            >
              <div class="w-50">{{ item.name }}</div>
              <div class="w-50">{{ getMoney(item.amount) }}</div>
            </div>

            <div class="flex m-t-2">
              <div class="w-50">Estimated Tax</div>
              <div class="w-50">{{ getMoney(payload.summary.total_tax) }}</div>
            </div>

            <div class="flex m-t-2 font-medium">
              <div class="w-50">Total</div>
              <div class="w-50">{{ getMoney(payload.summary.total_cost) }}</div>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="m-t-24 text-muted">
          {{ `Order number: ${payload.order_number}` }}
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
      required: true,
    },
  },

  data() {
    return {
      show_modal: false,
    };
  },

  computed: {
    ...mapGetters({
      setting_language: "getLanguage",
    }),

    payload() {
      return this.oGet(this.data, ["template", "payload"]) || {};
    },

    address() {
      if (this.payload && this.payload.address) {
        return this.payload.address;
      }
      return {};
    },

    address_simple() {
      if (this.payload && this.payload.address) {
        const { street_1, street_2, city, state } = this.payload.address;

        return `${street_1} ${street_2} ${city}, ${state}`;
      }
      return "";
    },

    total() {
      const formatter = new Intl.NumberFormat(this.setting_language, {
        style: "currency",
        currency: this.payload.currency || "USD",
      });
      return formatter.format(this.payload.summary.total_cost);
    },
  },

  methods: {
    getMoney(amount) {
      const formatter = new Intl.NumberFormat(this.setting_language, {
        style: "currency",
        currency: this.payload.currency,
      });
      return formatter.format(amount);
    },
  },
};
</script>

<style lang="scss" scoped>
.message-template-receipt {
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  color: $text;
  border: 1px solid #f0f0f0;
  padding: 12px;
  width: 470px;
  max-width: 100%;
  cursor: pointer;

  .product-item {
    overflow: hidden;
    margin-top: 12px;

    img {
      width: 56px;
      height: 56px;
      object-fit: cover;
    }
  }
}

.thumbnail-product {
  width: 72px;
  height: 72px;
  max-width: 72px;
  max-height: 72px;
  border-radius: 4px;
}
</style>
