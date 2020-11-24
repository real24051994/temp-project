import axios from "@/plugins/axios";

const api = {
  get(url, params = {}, cancel_token = null) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params,
          cancelToken: cancel_token ? cancel_token.token : null,
        })
        .then((response) => {
          if (response && response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            return reject("canceled");
          }
          reject(err);
        });
    });
  },

  post(url, data = {}) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, data)
        .then((response) => {
          if (response && response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  put(url, data) {
    return new Promise((resolve, reject) => {
      axios
        .put(url, data)
        .then((response) => {
          if (response && response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  delete(url) {
    return new Promise((resolve, reject) => {
      axios
        .delete(url)
        .then((response) => {
          if (response && response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getCancelToken() {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
  },

  //
  generalShopifyUrl(shop_name) {
    return api.post("/shopify/generate_url", {
      shop: shop_name,
    });
  },

  generalLinkSocial(data) {
    return api.post("/social/generate_url", data);
  },

  generalLinkReconnectSocial(data) {
    return api.post("/social/re-auth", data);
  },

  getUser() {
    return api.get("/app/user");
  },

  // Account Social
  getListSocial() {
    return api.get("/social/list");
  },

  removeSocial({ social_id }) {
    return api.post("/social/remove", {
      social_id,
    });
  },

  checkPageSelected({ social_info = [], secret = "" }) {
    return api.post("/social/account", {
      social_info,
      secret,
    });
  },

  SOCIAL: {
    banned(sender_id) {
      return api.get("/social/banned/" + sender_id);
    },

    unBanned(sender_id) {
      return api.get("/social/un_banned/" + sender_id);
    },

    uninstall(social_account_id) {
      return api.get("/social/uninstall/" + social_account_id);
    },

    mappingUserWithCustomer(social_sender_id, payload) {
      return api.post(
        "/social/user/" + social_sender_id + "/mapping_customer",
        payload
      );
    },

    // sendReceipt({ social_conversation_id, order_id }) {
    //   return api.get('/social/conversations/' + social_conversation_id + '/send_repceipt/' + order_id)
    // },

    sendReceipt({ social_account_id, sender_id, order_id, comment_id }) {
      return api.post("/social/send_repceipt", {
        account_id: social_account_id,
        sender_id,
        order_id,
        comment_id,
      });
    },
  },

  CONVERSATION: {
    fetch({
      social_account_id,
      conversation_type,
      read_type,
      limit,
      offset,
      name,
    }) {
      return api.get("/social/" + social_account_id + "/conversations", {
        conversation_type,
        read_type,
        limit,
        offset,
        name,
      });
    },

    markAsRead(social_conversation_id) {
      return api.get(
        "/social/conversations/" + social_conversation_id + "/readed"
      );
    },

    markAsUnread(social_conversation_id) {
      return api.get(
        "/social/conversations/" + social_conversation_id + "/mark_as_unread"
      );
    },

    updateStatus(social_conversation_id, { is_can_reply_message }) {
      return api.post(
        "/social/conversations/" + social_conversation_id + "/status",
        {
          is_can_reply_message,
        }
      );
    },
  },

  MESSAGE: {
    fetchByConversation({ conversation_id, offset, limit }) {
      return api.get("/social/conversations/" + conversation_id + "/messages", {
        offset,
        limit,
      });
    },

    sendMessage(social_conversation_id, { text, products, tag }) {
      return api.post(
        "/social/conversations/" + social_conversation_id + "/message_send",
        {
          text,
          products,
          tag,
        }
      );
    },

    sendFile(social_conversation_id, form_data) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            "/social/conversations/" + social_conversation_id + "/message_send",
            form_data,
            {
              headers: {
                "Content-Type": `multipart/form-data;`,
              },
              timeout: 10 * 60 * 1000,
            }
          )
          .then((response) => {
            if (response && response.status === 200 && response.data) {
              resolve(response.data);
            } else {
              reject(response.data);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },

  COMMENT: {
    fetch({ conversation_id, offset, limit }) {
      return api.get("/social/conversations/" + conversation_id + "/comments", {
        offset,
        limit,
      });
    },

    send(conversation_id, { message, image, attachment_url }) {
      let form_data = new FormData();

      if (image) {
        form_data.append("image", image);
      }

      if (attachment_url) {
        form_data.append("attachment_url", attachment_url);
      }

      form_data.append("message", message);

      return new Promise((resolve, reject) => {
        axios
          .post(
            "/social/conversations/" + conversation_id + "/comments",
            form_data,
            {
              headers: {
                "Content-Type": "multipart/form-data;",
              },
              timeout: 10 * 60 * 1000,
            }
          )
          .then((response) => {
            if (response && response.status === 200 && response.data) {
              resolve(response.data);
            } else {
              reject(response.data);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },

  SAVED_REPLIES: {
    fetch() {
      return api.get("/common-messages");
    },

    getOne(id) {
      return api.get("/common-messages/" + id);
    },

    add({ name, message }) {
      return api.post("/common-messages", {
        name,
        message,
      });
    },

    update(id, { name, message }) {
      return api.put("/common-messages/" + id, {
        name,
        message,
      });
    },

    delete(id) {
      return api.delete("/common-messages/" + id);
    },
  },

  UTILS: {
    getPreviewMetaData(url) {
      return api.get("/social/previewMetaData", {
        url,
      });
    },
  },

  SHOPIFY: {
    fetchProducts({ keyword, cursor, rel }) {
      return api.get("/app/products", {
        keyword,
        cursor,
        rel,
      });
    },

    fetchPages() {
      return api.get("/shopify/pages");
    },

    ORDERS: {
      fetch() {
        return api.get("/shopify/orders");
      },

      calculate(payload) {
        return api.put("/shopify/orders/calculate", payload);
      },

      create(payload) {
        return api.post("/shopify/orders", payload);
      },
    },

    CUSTOMERS: {
      fetch({ keyword, rel, cursor, cancel_token }) {
        return api.get(
          "/shopify/customers",
          {
            keyword: keyword || undefined,
            cursor: cursor || undefined,
            rel: rel || undefined,
          },
          cancel_token
        );
      },

      get(customer_id) {
        return api.get("/shopify/customers/" + customer_id);
      },

      create(payload) {
        return api.post("/shopify/customers/create", payload);
      },

      update(customer_id, payload) {
        return api.put("/shopify/customers/" + customer_id, payload);
      },

      // eslint-disable-next-line no-unused-vars
      getOrders(customer_id) {
        return api.get("/shopify/customers/" + customer_id + "/orders");
      },
    },
  },

  SETTINGS: {
    fetchChatWidgetSetting() {
      return api.get("/social/wiget");
    },

    updateChatWidgetSetting(payload) {
      return api.post("/social/wiget", payload);
    },
    fetchSetting(social_id) {
      return api.get("/social/comment-setting/" + social_id);
    },

    updateSetting(social_id, payload) {
      return api.post("/social/comment-setting/" + social_id, payload);
    },

    fetchDefaultKeywords() {
      return api.get("/social/default-keywords");
    },
  },
};

export default api;
