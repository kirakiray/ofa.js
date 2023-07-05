export const type = $.PAGE;

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
