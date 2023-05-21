export default async function ({ load, url, params }) {
  return {
    data: {
      pm: params,
      ia: "aaa",
    },
    proto: {
      changeInput(e) {},
    },
    ready() {
      console.log("page ready !");
    },
  };
}
