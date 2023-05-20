export default async function ({ load, url, params }) {
  return {
    data: {
      val: params,
    },
    ready() {
      console.log("page ready !");
    },
  };
}
