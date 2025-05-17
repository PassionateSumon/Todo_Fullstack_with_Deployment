import AuthModule from "modules/auth/auth.module";
import StatusModule from "modules/status/status.module";
import TaskModule from "modules/task/task.module";
import UserModule from "modules/user/user.module";

export default {
  name: "app-routes",
  register: async function (server: any) {
    await AuthModule.register(server);
    await StatusModule.register(server);
    await TaskModule.register(server);
    await UserModule.register(server);
  },
};
