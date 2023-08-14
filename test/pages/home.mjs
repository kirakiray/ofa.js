export const type = $.PAGE;

// export function ready() {
//   console.log("ready => ", this);
// }

export function attached() {
  console.log("attached home => ", this);

  window._attached_home = "ok";
}
export function detached() {
  console.log("detached home => ", this);

  window._detached_home = "ok";
}

export default async ({ query }) => {
  return {
    data: {
      val: "1111",
      query: query || {},
    },
    proto: {
      toHome() {
        this.goto(`./home.mjs?count=${(Number(this.query.count) || 0) + 1}`);
      },
    },
  };
};
