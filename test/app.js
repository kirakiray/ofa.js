export const home = "./pages/home.mjs?count=1";

export const loading = () => {
  return `
  <style>
    .loading {
      width: 24px;
      height: 24px;
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-left-color: #7983ff;
      border-radius: 50%;
      animation: loading 1s ease-in-out infinite;
    }
    
    @keyframes loading {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  </style>
  <div class="loading"></div>
`;

  // return `<div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;">loading</div>`;
};

export const fail = ({ src }) => {
  return `<div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;word-break:break-all;" data-testid="error-container">
    <div style="padding:20px;text-align:center;">
      <h3>load fail</h3> 
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
