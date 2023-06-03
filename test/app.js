export const home = "./pages/home.mjs?count=1";

export const loading = () => {
  return `<div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;">loading</div>`;
};

export const fail = ({ src }) => {
  return `<div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;word-break:break-all;">
    <div style="padding:20px;text-align:center;">
      <h3>fail</h3> 
      ${src}
      <div>
        <button on:click="back()">Back</button>
      </div>
    </div>
  </div>`;
};

export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
