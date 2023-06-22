export default async ({ params }) => {
  return {
    data: {
      val: "1111",
      params: params || {},
    },
    proto: {
      toHome() {
        this.goto(`./home.mjs?count=${(Number(this.params.count) || 0) + 1}`);
      },
    },
  };
};
