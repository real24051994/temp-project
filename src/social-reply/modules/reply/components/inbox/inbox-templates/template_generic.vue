<template>
  <div class="message-template" v-if="elements.length > 0">
    <div class="product-item flex flex-col" v-if="is_single">
      <div class="product-item--thumbnail">
        <img :src="elements[0].image_url" alt="" />
      </div>

      <div class="flex flex-col" style="padding: 8px;">
        <div class="text-secondary font-medium">
          {{ elements[0].title }}
        </div>

        <div class="text-muted f-12 m-t-4">
          {{ elements[0].subtitle }}
        </div>

        <div class="f-12 m-t-4" style="color: #cecece;">
          {{ getHostnameFromRegex(elements[0].item_url) }}
        </div>
      </div>

      <div class="p-b-12 p-t-12 border-t text-center">
        <a :href="elements[0].item_url" target="_blank">
          View Details
        </a>
      </div>
    </div>

    <div class="carousel-container" v-else>
      <swiper ref="refSwiper" class="swiper" :options="swiperOption">
        <swiper-slide v-for="(item, i) in elements" :key="i">
          <div class="product-item flex flex-col h-100">
            <div class="product-item--thumbnail">
              <img :src="item.image_url" alt="" />
            </div>

            <div class="flex flex-col flex-1" style="padding: 8px;">
              <div class="text-secondary font-medium flex-1">
                {{ item.title }}
              </div>

              <div class="text-muted f-12 m-t-4">
                {{ item.subtitle }}
              </div>

              <div class="f-12 m-t-4">
                <a
                  :href="item.item_url"
                  target="_blank"
                  style="color: #cecece;"
                >
                  {{ getHostnameFromRegex(item.item_url) }}
                </a>
              </div>
            </div>

            <div class="p-b-12 p-t-12 border-t text-center">
              <a :href="item.item_url" target="_blank">
                View Details
              </a>
            </div>
          </div>
        </swiper-slide>
        <div
          class="swiper-gen-container swiper-gen-prev"
          slot="button-prev"
          @click="slidePrev"
        >
          <div class="swiper-gen-item">
            <sh-icon :icon="['fas', 'angle-left']" />
          </div>
        </div>
        <div
          class="swiper-gen-container swiper-gen-next"
          slot="button-next"
          @click="slideNext"
        >
          <div class="swiper-gen-item">
            <sh-icon :icon="['fas', 'angle-right']" />
          </div>
        </div>
      </swiper>
    </div>
  </div>

  <div v-else class="flex p-t-4 p-b-4 items-center text-primary">
    <fa-spin class="m-r-8" size="14px" />Sending Product
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/swiper-bundle.css";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
    };
  },
  computed: {
    elements() {
      return this.oGet(this.data, ["template", "payload", "elements"]) || [];
    },
    is_single() {
      if (this.elements.length == 1) {
        return true;
      }
      return false;
    },
    swiper() {
      return this.$refs.refSwiper.$swiper;
    },
  },

  methods: {
    getHostnameFromRegex(url) {
      return new URL(url).host;
    },
    slideNext() {
      this.swiper.slideNext();
    },
    slidePrev() {
      this.swiper.slidePrev();
    },
  },
};
</script>
<style lang="scss" scoped>
.swiper-gen- {
  &container {
    position: absolute;
    top: 90px;
    width: 50px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: $dark-gray3;
    cursor: pointer;
  }
  &prev {
    left: -15px;
    right: auto;
    > .swiper-gen-item {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
  &next {
    right: -15px;
    left: auto;
    > .swiper-gen-item {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
  }
  &item {
    border: 1px solid $border-color;
    background: white;
    width: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.carousel-container {
  width: 420px;
}
.swiper {
  width: 100%;

  .swiper-slide {
    display: flex;
    background-color: white;
  }
}
.message-template {
  background: white;
  color: $text;
  .product-item {
    border: 1px solid #f0f0f0;
    overflow: hidden;
    border-radius: 8px;
    width: 210px;
    .product-item--thumbnail {
      img {
        width: 210px;
        height: 130px;
        object-fit: cover;
      }
    }
  }
}
</style>
