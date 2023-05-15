// Note: This module may be deprecated
// Logic related to data communication between o-app and upper layer applications
const globalAppData = {
  // The message data passed from the higher level
  message: null,
};

if (opener && !opener.closed) {
  if (document.readyState == "complete") {
    opener.postMessage(
      {
        type: "web-app-postback-data",
        command: "complete",
      },
      "*"
    );
  } else {
    let onloadFunc = () => {
      opener.postMessage(
        {
          type: "web-app-postback-data",
          command: "complete",
        },
        "*"
      );
      glo.removeEventListener("load", onloadFunc);
      onloadFunc = null;
    };
    glo.addEventListener("load", onloadFunc);
  }

  // Higher level windows exist, add closing event notification
  glo.addEventListener("beforeunload", (e) => {
    opener.postMessage(
      {
        type: "web-app-postback-data",
        command: "close",
      },
      "*"
    );
  });
}

if (opener || top !== window) {
  glo.addEventListener("message", (e) => {
    let { data } = e;

    if (!(data && data.type)) {
      return;
    }

    const { type } = data;
    data = data.data;

    if (type == "web-app-post-init-data") {
      globalAppData.initial = data;
    } else if (type === "web-app-post-data") {
      globalAppData.message = data;
      apps.forEach((e) => e.triggerHandler("message", data));
    } else {
      return;
    }

    apps.forEach((e) =>
      emitUpdate(e, {
        xid: e.xid,
        name: "message",
      })
    );
  });
}
