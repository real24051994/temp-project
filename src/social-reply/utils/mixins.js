import {
  format as fnsFormat,
  isToday as fnsIsToday,
  formatDistanceToNow,
} from "date-fns";

import Vue from "vue";
import isNil from "lodash/isNil";
import { mapGetters } from "vuex";
import omitBy from "lodash/omitBy";

Vue.mixin({
  computed: {
    ...mapGetters({
      shop: "auth/getShop",
      setting_language: "getLanguage",
    }),

    shop_currency() {
      return this.shop ? this.shop.currency : "";
    },

    shop_currency_symbol() {
      if (this.shop_currency) {
        const formatter = new Intl.NumberFormat("en", {
          style: "currency",
          currency: this.shop_currency, // USD | VND
        });
        return formatter.format(0).slice(0, 1);
      }
      return "";
    },
  },

  methods: {
    clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    },

    isToday(date) {
      return fnsIsToday(date);
    },

    dateFormat(timeString, format = "yyyy-MM-dd hh:mm a") {
      const time = new Date(timeString);
      return fnsFormat(time, format);
    },

    formatMoney(amount, default_value = "") {
      if (amount || amount === 0) {
        // setting_language = 'en' || 'vi'
        const formatter = new Intl.NumberFormat(this.setting_language, {
          style: "currency",
          currency: this.shop_currency ? this.shop_currency : "USD", // USD | VND
        });

        return formatter.format(amount);
      }

      return default_value;
    },

    oGet(o, p) {
      return p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o);
    },

    timeAgo(time) {
      return formatDistanceToNow(new Date(time));
    },

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    cleanObject(obj) {
      return omitBy(obj, isNil);
    },

    isEmpty(val) {
      // Null and Undefined...
      if (val == null) return true;

      // Booleans...
      if ("boolean" == typeof val) return false;

      // Numbers...
      if ("number" == typeof val) return val === 0;

      // Strings...
      if ("string" == typeof val) return val.length === 0;

      // Functions...
      if ("function" == typeof val) return val.length === 0;

      // Arrays...
      if (Array.isArray(val)) return val.length === 0;

      // Errors...
      if (val instanceof Error) return val.message === "";

      // Objects...
      if (val.toString == Object.prototype.toString) {
        switch (val.toString()) {
          // Maps, Sets, Files and Errors...
          case "[object File]":
          case "[object Map]":
          case "[object Set]": {
            return val.size === 0;
          }

          // Plain objects...
          case "[object Object]": {
            for (var key in val) {
              if (Object.prototype.hasOwnProperty.call(val, key)) return false;
            }

            return true;
          }
        }
      }

      // Anything else...
      return false;
    },

    truncate(text, max = 200) {
      if (text && text.length > max && text.split(" ").length > 1) {
        let trimmedString = text.substr(0, max);
        return (
          trimmedString.substr(
            0,
            Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))
          ) + "..."
        );
      }
      return text;
    },
  },
});
