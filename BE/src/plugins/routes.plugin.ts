import AuthModule from "../modules/auth/auth.module.js";
import DashboardModule from "../modules/dashboard/dashboard.module.js";
import StatusModule from "../modules/status/status.module.js";
import TaskModule from "../modules/task/task.module.js";
import UserModule from "../modules/user/user.module.js";

export default {
  name: "app-routes",
  register: async function (server: any) {
    await AuthModule.register(server);
    await StatusModule.register(server);
    await TaskModule.register(server);
    await UserModule.register(server);
    await DashboardModule.register(server);
  },
};
