import routes from "./routes/task.route.js";

const TaskModule = {
  name: "task",
  register: async function (server: any) {
    routes.forEach((route) => {
      server.route(route);
    });
  },
};

export default TaskModule;
