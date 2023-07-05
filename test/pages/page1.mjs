export const type = $.PAGE;

export default async function ({ load, url, query }) {
  return {
    data: {
      pm: query,
      ia: "aaa",
    },
    proto: {
      changeInput(e) {},
    },
    ready() {
      console.log("page ready =>", this);
    },
    loaded() {
      console.log("page loaded => ", this);
    },
  };
}
