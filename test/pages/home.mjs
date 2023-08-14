export const type = $.PAGE;

// export function ready() {
//   console.log("ready => ", this);
// }

// export function attached() {
//   console.log("attached home => ", this);
// }
// export function detached() {
//   console.log("detached home => ", this);
// }

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
