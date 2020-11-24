import auth from "@reply/middlewares/auth";
import autoLogin from "@reply/middlewares/autoLogin";
import dashboard from "@reply/middlewares/dashboard";
import install from "@reply/middlewares/install";
import noAuth from "@reply/middlewares/noAuth";
import noInstall from "@reply/middlewares/noInstall";
import router from "@/router";
const routes = [
  {
    path: "/",
    name: "Dashboard",
    meta: {
      middleware: [autoLogin, auth, install, dashboard],
    },
  },
  {
    path: "/install",
    name: "Install",
    meta: {
      layout: "no-sidebar",
      middleware: [auth, noInstall],
    },
    component: () =>
      import(
        /* webpackChunkName: "auth" */ "@reply/modules/auth/views/install.vue"
      ),
  },
  {
    path: "/auth",
    component: () =>
      import(
        /* webpackChunkName: "auth" */ `@reply/modules/auth/views/layout.vue`
      ),
    children: [
      {
        path: "",
        name: "Auth",
        meta: {
          layout: "light",
        },
        component: () =>
          import(
            /* webpackChunkName: "auth" */ `@reply/modules/auth/views/index.vue`
          ), //loadView('auth'),
      },
      {
        path: "login",
        name: "Login",
        meta: {
          layout: "auth",
          middleware: [noAuth],
        },
        component: () =>
          import(
            /* webpackChunkName: "auth" */ `@reply/modules/auth/views/login.vue`
          ), //loadView('auth', 'login'),
      },
      {
        path: "success",
        name: "Autoclose",
        meta: {
          layout: "none",
        },
        component: () =>
          import(
            /* webpackChunkName: "auth" */ `@reply/modules/auth/views/success.vue`
          ), //loadView('auth', 'success'),
      },
      {
        path: "cancel",
        name: "AutocloseCancel",
        meta: {
          layout: "none",
        },
        component: () =>
          import(
            /* webpackChunkName: "auth" */ `@reply/modules/auth/views/cancel.vue`
          ), //loadView('auth', 'cancel'),
      },
    ],
  },
  {
    path: "/account",
    component: () =>
      import(
        /* webpackChunkName: "reply-box" */ `@reply/modules/reply/views/layout.vue`
      ),
    children: [
      {
        path: "",
        name: "ReplyBox",
        meta: {
          middleware: [auth, install],
        },
        component: () =>
          import(
            /* webpackChunkName: "reply-box" */ `@reply/modules/reply/views/conversations.vue`
          ),
      },
      {
        path: ":accountId",
        name: "ReplyBoxDetail",
        component: () =>
          import(
            /* webpackChunkName: "reply-box" */ `@reply/modules/reply/views/conversations.vue`
          ),
        children: [
          {
            path: "inbox",
            redirect: { name: "ReplyBox" },
          },
          {
            path: "inbox/:conversationId",
            name: "Inbox",
            meta: {
              middleware: [auth, install],
            },
            component: () =>
              import(
                /* webpackChunkName: "reply-box" */ `@reply/modules/reply/views/inbox.vue`
              ),
          },
          {
            path: "comment",
            redirect: { name: "ReplyBox" },
          },
          {
            path: "comment/:conversationId",
            name: "Comment",
            meta: {
              middleware: [auth, install],
            },
            component: () =>
              import(
                /* webpackChunkName: "reply-box" */ `@reply/modules/reply/views/comments.vue`
              ),
          },
        ],
      },
    ],
  },
  {
    path: "/chat-widget",
    name: "ChatWidget",
    meta: {
      middleware: [auth, install],
    },
    component: () =>
      import(
        /* webpackChunkName: "chat-widget" */ `@reply/modules/chat-widget/views/index`
      ),
  },
  {
    path: "/manage-account",
    name: "ManageAccount",
    meta: {
      middleware: [auth, install],
    },
    component: () =>
      import(
        /* webpackChunkName: "manage-account" */ `@reply/modules/account/views/index`
      ),
  },
  {
    path: "/maintaince",
    name: "Maintaince",
    meta: {
      layout: "light",
    },
    component: () =>
      import(
        /* webpackChunkName: "maintaince" */ `@reply/modules/maintaince/views/index.vue`
      ),
  },
  {
    path: "/auto-hide",
    name: "AutoHide",
    meta: {
      middleware: [auth, install],
    },
    component: () =>
      import(
        /* webpackChunkName: "chat-widget" */ `@reply/modules/auto-hide/views/index`
      ),
  },
  {
    path: "*",
    name: "404",
    meta: {
      layout: "error",
    },
    component: () =>
      import(
        /* webpackChunkName: "error" */ `@reply/modules/error/views/error_404.vue`
      ),
  },
];

router.addRoutes(routes);
/*
router.beforeEach(async (to, from, next) => {
	if (to.name === 'Maintaince' || to.name === '404' || to.name === 'Offline' || to.fullPath === '/docs') {
		return next()
	} else if (to.name === 'Dashboard') {
		if (to.query && to.query.hasOwnProperty('hmac') && to.query.hasOwnProperty('timestamp') && to.query.hasOwnProperty('shop')) {
			let shop = to.query.shop

			if (shop) {
				let pattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+myshopify.com$/g

				if (pattern.test(String(shop).toLowerCase())) {
					const shopname = shop.replace(/.myshopify.com/gi, '')

					try {
						let install = await store.dispatch('auth/shopifyLogin', shopname)

						if (install) {
							let { status, data } = install

							if (status) {
								await store.dispatch('auth/clear')
								window.location.href = data
								return
							}
						}
						// eslint-disable-next-line no-empty
					} catch (e) { }
				}
			}
		} else {
			if (!store.getters['auth/getUser']) {
				try {
					await store.dispatch('auth/fetchUserInfo')
				} catch (err) { }
			}
		}
		return next({ name: 'ReplyBox' })
	} else if (to.name === 'Auth' || to.name === 'Login') {
		if (store.getters['auth/isAuthenticated']) {
			return next({ name: 'Dashboard' })
		}

		if (to.name === 'Auth' && !store.getters['auth/isAuthenticated'] && !to.query.token) {
			return next({ name: 'Login' })
		}
	} else {
		if (!store.getters['auth/isAuthenticated']) {
			return next({ name: 'Login' })
		}

		if (!store.getters['auth/getUser']) {
			try {
				await store.dispatch('auth/fetchUserInfo')
			} catch (err) { }
		}
	}
	next()
})
*/
