import routes from "./routes/user.route";

const UserModule = {
  name: "user",
  register: async function (server: any) {
    routes.forEach((route) => {
      server.route(route);
    });
  },
};

export default UserModule;
