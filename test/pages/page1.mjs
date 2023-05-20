export default async function ({ load, url, params }) {
  return {
    data: {
      val: params,
      ia: "",
    },
    proto: {
      changeInput(e) {},
    },
    ready() {
      console.log("page ready !");
    },
  };
}
