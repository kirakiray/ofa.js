export const type = $.PAGE;

export const routerChange = (e) => {
  console.log("router change => ", e);
};

export const data = {
  items: [
    {
      name: "Page01",
      href: "./subs/sub-page01.html",
    },
    {
      name: "Page02",
      href: "./subs/sub-page02.html",
    },
    {
      name: "Page03",
      href: "./subs/sub-page03.html",
    },
    {
      name: "Page04",
      href: "./subs/sub-page04.html",
    },
  ],
};

export const proto = {
  resettop() {
    this.items = [
      {
        name: "Page04a",
        href: "./subs/sub-page04.html",
      },
      {
        name: "Page03a",
        href: "./subs/sub-page03.html",
      },
      {
        name: "Page02a",
        href: "./subs/sub-page02.html",
      },
      {
        name: "Page01a",
        href: "./subs/sub-page01.html",
      },
    ];
  },
};
