<template>
  <a-modal
    v-model="visible"
    :centered="true"
    :body-style="{ padding: '' }"
    width="996px"
  >
    <div class="d-flex" slot="title">
      <div class="item-icon float-left d-flex align-items-center">
        <div class="item-icon-bg">
          <div class="h-100 d-flex align-items-center">
            <sh-icon :icon="['far', 'key']" />
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center">
        <span class="font-medium">
          Keyword Suggestion
        </span>
      </div>
    </div>
    <div class="flex content-end" slot="footer">
      <fa-button class="ant-btn" @click="handleCancel">
        Cancel
      </fa-button>
      <fa-button type="primary" class="ant-btn" @click="insertSelected">
        Insert
      </fa-button>
    </div>
    <div class="manage-keywords">
      <div class="manage-keywords-sidebar">
        <div class="d-flex justify-content-between">
          <div class="m-r-8">
            <a-dropdown class="dropdown-filters">
              <a-menu slot="overlay" @click="handleFilter">
                <a-menu-item :key="filter.key" v-for="filter in filters">
                  {{ filter.value }}
                </a-menu-item>
              </a-menu>
              <a-button>
                <div class="d-flex justify-content-between">
                  <div>
                    <sh-icon :icon="['far', 'filter']" />
                  </div>
                  <div>
                    {{ filter_choose_value }}
                  </div>
                  <div>
                    <a-icon type="down" />
                  </div>
                </div>
              </a-button>
            </a-dropdown>
          </div>
          <div class="m-r-8">
            <a-input
              placeholder="Search"
              type="text"
              class="w-100"
              allow-clear
              v-model="search_keywords"
              v-on:keyup.enter="searchKeywords"
              @change="onSearchKeyWord"
            >
              <a-icon slot="prefix" type="search" />
            </a-input>
          </div>
          <div>
            <fa-button
              :disabled="loading_search_keywords"
              class="btn-search"
              @click="searchKeywords"
            >
              Search
            </fa-button>
          </div>
        </div>
        <fa-simplebar class="list-selected-keywords">
          <div>
            <div
              class="list-selected-keyword"
              v-for="(keyword, index) in default_keywords"
              :key="`${index}-keyword_sugestion_${keyword}`"
            >
              <a-checkbox
                :value="keyword"
                :checked="checkboxChecked(keyword)"
                @change="onSelected"
                >{{ keyword }}
              </a-checkbox>
            </div>
          </div>
        </fa-simplebar>
      </div>
      <div class="manage-keywords-selected">
        <div class="manage-keywords-selected-content h-100">
          <div v-if="selected_keywords.length > 0" class="w-100 d-flex">
            <div class="mr-auto font-medium">
              Selected
            </div>
            <div class="clear-all" @click="clearAll">
              Clear All
            </div>
          </div>
          <div
            class="mt-3 manage-keywords-selected-list"
            v-if="selected_keywords.length > 0"
          >
            <ul class="selected-keywords">
              <li
                v-for="selected_keyword in selected_keywords"
                :key="`selected_${selected_keyword}`"
              >
                <a-tag closable @close="unSelectedKeyword(selected_keyword)">
                  {{ selected_keyword }}
                </a-tag>
              </li>
            </ul>
          </div>
          <div
            v-else
            class="d-flex h-100 align-items-center justify-content-center"
          >
            <div>
              <svg-icon2 name="auto-hide/keyword-null" />
              <span class="d-block subtitle mt-1">
                You not have yet selected keywords
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import {
  forEach,
  filter,
  intersectionWith,
  differenceWith,
  isEqual,
  findIndex,
  union,
} from "lodash";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    settings: {
      type: Object,
      default: () => {},
      required: true,
    },
    mapItemValid: {
      type: Map,
      default: () => new Map(),
    },
  },
  data: () => ({
    filters: [
      {
        key: "all",
        value: "All keywords",
      },
      {
        key: "selected",
        value: "Selected",
      },
      {
        key: "unselected",
        value: "Unselected",
      },
    ],
    filter_choose_value: null,
    filter_choose_key: null,
    original_keywords: [],
    default_keywords: [],
    search_keywords: null,
    selected_keywords: [],
    loading_search_keywords: false,
  }),
  computed: {
    visible: {
      get() {
        return this.show;
      },

      set(val) {
        this.$emit("update:show", val);
      },
    },
  },
  created() {
    this.fetchDefaultKeywords();
    this.beginModal();
  },
  watch: {
    visible() {
      this.beginModal();
    },
    filter_choose_key() {
      const that = this;
      forEach(this.filters, function(filter) {
        if (filter.key === that.filter_choose_key) {
          that.filter_choose_value = filter.value;
        }
      });
    },
    search_keywords(value) {
      if (!value) {
        this.default_keywords = this.original_keywords;
      }
    },
  },
  methods: {
    checkboxChecked(keyword) {
      const index = findIndex(this.selected_keywords, function(
        selected_keyword
      ) {
        return selected_keyword == keyword;
      });
      if (index < 0) {
        return false;
      } else {
        return true;
      }
    },
    async fetchDefaultKeywords() {
      try {
        let { data } = await this.$api.SETTINGS.fetchDefaultKeywords();
        this.original_keywords = this.clone(data);
      } catch (error) {}
    },
    handleFilter(e) {
      this.filter_choose_key = e.key;
      this.searchKeywords();
    },
    beginModal() {
      this.clearModalData();
      const keywords = JSON.parse(
        JSON.stringify(this.settings.hide_comment_keywords)
      );
      this.selected_keywords = intersectionWith(
        keywords,
        this.default_keywords,
        isEqual
      );
      this.filter_choose_key = "all";
    },
    clearModalData() {
      this.search_keywords = "";
      this.default_keywords = this.original_keywords;
    },
    searchKeywords() {
      this.loading_search_keywords = true;
      try {
        if (this.search_keywords) {
          const search_keywords = this.search_keywords;
          const default_keywords = filter(this.original_keywords, function(
            keyword
          ) {
            return keyword.indexOf(search_keywords) > -1;
          });
          this.default_keywords = default_keywords;
        } else {
          this.default_keywords = this.original_keywords;
        }
        switch (this.filter_choose_key) {
          case "selected":
            this.default_keywords = intersectionWith(
              this.default_keywords,
              this.selected_keywords,
              isEqual
            );
            break;
          case "unselected":
            this.default_keywords = differenceWith(
              this.default_keywords,
              this.selected_keywords,
              isEqual
            );
            break;
        }
      } catch (e) {
      } finally {
        this.loading_search_keywords = false;
      }
    },
    handleCancel() {
      this.visible = false;
    },
    unSelectedKeyword(item) {
      this.mapItemValid.delete(item);
      this.selected_keywords = differenceWith(
        this.selected_keywords,
        [item],
        isEqual
      );
    },
    clearAll() {
      this.selected_keywords = [];
      this.$emit("clearItem");
    },
    onSelected(e) {
      const value = e.target.value;
      this.loading_search_keywords = true;
      try {
        const index = findIndex(this.selected_keywords, function(
          selected_keyword
        ) {
          return selected_keyword == value;
        });
        if (index < 0) {
          // Add
          this.selected_keywords.push(value);
        } else {
          // Remove
          this.selected_keywords.splice(index, 1);
          this.mapItemValid.delete(value);
        }
        this.searchKeywords();
      } catch (e) {
      } finally {
        this.loading_search_keywords = false;
      }
    },
    insertSelected() {
      let keywords = this.settings.hide_comment_keywords;
      keywords = differenceWith(keywords, this.original_keywords, isEqual);
      keywords = union(keywords, this.selected_keywords);
      this.settings.hide_comment_keywords = keywords;
      for (let index = 0; index < keywords.length; index++) {
        const key = keywords[index];
        this.mapItemValid.set(key, index);
      }
      this.handleCancel();
    },
    onSearchKeyWord(event) {
      // Event clear search
      if (event.type === "click" && event.cancelable === true) {
        this.searchKeywords();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.item-icon {
  width: 50px;

  .item-icon-bg {
    position: relative;
    text-align: center;
    background-color: #ebf1ff;
    width: 40px;
    height: 40px;

    .svg-inline--fa {
      font-size: 18px;
      color: #5b86e5;
      margin: 0 auto;
    }
  }
}
.subtitle {
  color: $sub-title-color;
  line-height: 22px;
}
.manage-keywords {
  background-color: #fafafa;
  display: flex;
  height: 500px;
  flex-direction: row;
  padding: 15px 0;

  .manage-keywords-sidebar {
    width: 50%;
    float: left;
    display: flex;
    flex-direction: column;
    margin: 0 15px;

    .dropdown-filters {
      min-width: 150px;
    }
    .list-selected-keywords {
      border: 1px solid #f3f3f3;
      margin-top: 15px;
      height: 420px;
      background-color: #ffffff;
      width: 100%;
      .list-selected-keyword {
        border-bottom: 1px solid #f3f3f3;
        padding: 10px;
      }
    }
  }
  .manage-keywords-selected {
    width: 50%;
    float: left;
    background: #ffffff;
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    margin: 0 15px;

    .clear-all {
      color: #5b86e5;
      cursor: pointer;
    }

    .manage-keywords-selected- {
      &list {
        height: 400px;
        overflow-y: auto;
      }
      &content {
        padding: 15px;
        ul.selected-keywords {
          width: 100%;
          height: 100%;
          display: table-row;

          li {
            display: block;
            float: left;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}
</style>
