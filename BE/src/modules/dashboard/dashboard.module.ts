import routes from "./routes/dashboard.route.js";

const DashboardModule = {
  name: "dashboard",
  register: async function (server: any) {
    routes.forEach((route) => {
      server.route(route);
    });
  },
};

export default DashboardModule;
