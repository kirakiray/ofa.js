export const todos = $.stanz(
  JSON.parse(localStorage.getItem("ofa-todolist-demo") || "[]"),
);

todos.watchTick(() => {
  localStorage.setItem("ofa-todolist-demo", JSON.stringify(todos));
}, 500); // 每500ms保存一次
