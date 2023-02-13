const ROUTERPAGE = Symbol("router_page");

// All app elements
const apps = [];

// Number of waiters waiting to be loaded
let waitCount = 2;

register({
  tag: "o-app",
  temp: `<style>:host{display:block}::slotted(o-page){position:absolute;left:0;top:0;width:100%;height:100%}::slotted(o-page[page-area]){transform:translate(0,0);transition:all ease-in-out .25s;z-index:2}::slotted(o-page[page-area=back]){transform:translate(-30%,0);opacity:0;z-index:1}::slotted(o-page[page-area=next]){transform:translate(30%,0);opacity:0;z-index:1}.container{display:flex;flex-direction:column;width:100%;height:100%}.main{position:relative;flex:1}.article{position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden}</style><style id="initStyle">::slotted(o-page[page-area]){transition:none}</style><div class="container"><div><slot name="header"></slot></div><div class="main"><div class="article" part="body"><slot></slot></div></div></div>`,
  attrs: {
    // Home Address
    home: "",
    // Cite the resource address
    src: "",
  },
  data: {
    router: [],
    // router: [{
    //     path: "",
    //     _page:""
    // }]
    // rect: {
    //     width: "",
    //     height: "",
    // },
    visibility: document.hidden ? 0 : 1,
  },
  watch: {
    async src(src) {
      if (!src || this._loaded_src) {
        return;
      }
      this._loaded_src = 1;

      // Load the appropriate module and execute
      let m = await load(src);

      m.data && Object.assign(this, m.data);

      if (m.proto) {
        // Extended Options
        this.extend(m.proto);
      }

      if (m.ready) {
        m.ready.call(this);
      }

      if (this.home && !this.router.length) {
        // When home exists and no other pages are routed, add home
        this.router.push({
          path: this.home,
        });
      }
    },
    home(src) {
      if (!this.src && src && !this.router.length) {
        this.router.push({
          path: src,
        });
      }
    },
    router(router) {
      if (!router.length) {
        return;
      }
      // Change page routing based on router values
      let backRouter = this._backup_router;
      if (!backRouter) {
        // Initial Storage
        backRouter = this._backup_router = [];
      }

      // Pages waiting to be deleted
      const needRemove = backRouter.filter((e) => !router.includes(e));

      // Waiting for the new page to be added
      const needAdd = [];

      let lastIndex = router.length - 1;
      const newRouter = router.map((e, index) => {
        // Corrected data
        if (typeof e == "string") {
          e = createXData({
            path: e,
          });

          e.owner.add(router[XDATASELF]);
        }

        if (!e._page) {
          // Adding page elements
          let page = (e._page = $({
            tag: "o-page",
            src: e.path,
          }));

          // Add loading
          if (glo.ofa && ofa.onState.loading) {
            page.push(
              ofa.onState.loading({
                src: e.path,
              })
            );
          }

          let w_resolve;
          // Add waiting period related properties
          page._waiting = new Promise((res) => (w_resolve = res));
          page.__waiter_resolve = w_resolve;
        }

        if (e.state && e._page.state === undefined) {
          let state = e.state;
          extend(e._page, {
            get state() {
              return state;
            },
          });
        }

        if (!backRouter.includes(e)) {
          needAdd.push(e);
        }

        // fix page-area
        if (index < lastIndex) {
          // hide page
          e._page.attr("page-area", "back");
        } else if (index == lastIndex) {
          // current page
          if (e._page.attr("page-area") === null) {
            e._page.attr("page-area", "next");
            // firefox will not work
            // requestAnimationFrame(() => {
            //     e._page.attr("page-area", "");
            // });
            setTimeout(() => {
              // If it has been changed, there is no need to modify it again
              if (e._page.attr("page-area") === "next") {
                e._page.attr("page-area", "");
              }
            }, 10);
          } else {
            e._page.attr("page-area", "");
          }
        }

        // Fix the loading of the waiter
        if (index + waitCount > lastIndex && e._page.__waiter_resolve) {
          e._page.__waiter_resolve();
          delete e._page.__waiter_resolve;
        }

        return e;
      });

      // Add page
      needAdd.forEach((e) => {
        this.push(e._page);
      });

      // delete page
      needRemove.forEach((e) => {
        e._page.attr("page-area", "next");
        if (parseFloat(e._page.css.transitionDuration) > 0) {
          // If the animation deletion is invalid, it will be deleted by setTimeout
          let timer = setTimeout(() => e._page.remove(), 500);
          //  If there is an animation, perform an end-of-animation operation
          e._page.one("transitionend", () => {
            e._page.remove();
            clearTimeout(timer);
          });
        } else {
          // No animation directly deleted
          e._page.remove();
        }
      });

      // Correction of routing data
      router[XDATASELF].splice(0, 1000, ...newRouter);

      this._backup_router = router.slice();

      // Triggers the activation event of the current page
      router.slice(-1)[0]._page.trigger("activepage");
    },
  },
  proto: {
    get currentPage() {
      return this.router.slice(-1)[0]._page;
    },
    // Back to page
    back() {
      const event = new Event("back", {
        cancelable: true,
      });
      event.delta = 1;
      this.triggerHandler(event);

      // Block page return behavior when returnValue is false
      if (event.returnValue) {
        if (this.router.length > 1) {
          this.router.splice(-1, 1);
        }
      }
    },
    // get globalData() {
    //   return globalAppData;
    // },
    postback(data) {
      let target;
      if (top !== window) {
        target = top;
      } else if (opener) {
        target = opener;
      } else {
        console.warn("can't use postback");
        return false;
      }

      target.postMessage(
        {
          type: "web-app-postback-data",
          data,
        },
        "*"
      );

      return true;
    },
    // Used when you don't want to expose your real address or ensure address uniqueness
    // get shareHash() {
    //     return encodeURIComponent(this.currentPage.src);
    // }
    // set shareHash() {
    //     return encodeURIComponent(this.currentPage.src);
    // }
  },
  ready() {
    window.addEventListener("visibilitychange", (e) => {
      this.visibility = document.hidden ? 0 : 1;
    });

    // The moment it starts, no animation required
    setTimeout(() => {
      this.shadow.$("#initStyle").remove();
    }, 150);
  },
  attached() {
    apps.push(this);
  },
  detached() {
    let id = apps.indexOf(this);
    if (id > -1) {
      apps.splice(id, 1);
    }
  },
});
