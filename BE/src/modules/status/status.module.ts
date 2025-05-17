import routes from "./routes/status.route";

const StatusModule = {
  name: "status",
  register: async function (server: any) {
    routes.forEach((route) => {
      server.route(route);
    });
  },
};

export default StatusModule;
