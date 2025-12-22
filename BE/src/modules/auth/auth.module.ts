import routes from "./routes/auth.route.js";

const AuthModule = {
  name: "auth",
  register: async function (server: any) {
    routes.forEach((route) => {
      server.route(route);
    });
  },
};

export default AuthModule;
