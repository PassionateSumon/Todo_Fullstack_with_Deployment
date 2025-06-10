import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_NAME || "mysql",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_NAME || "mysql",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_NAME || "mysql",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  },
};

// import dotenv from "dotenv";
// dotenv.config();
// // console.log(process.env.DB_USER);

// export default {
//   development: {
//     username: `${process.env.DB_USER}`,
//     password: `${process.env.DB_PASSWORD}`,
//     database: `${process.env.DB_NAME}`,
//     host: `${process.env.DB_HOST}`,
//     port: `${process.env.DB_PORT}`,
//     dialect: "mysql",
//   },
//   test: {
//     username: `${process.env.DB_USER}`,
//     password: `${process.env.DB_PASSWORD}`,
//     database: `${process.env.DB_NAME_TEST}`,
//     host: `${process.env.DB_HOST}`,
//     port: `${process.env.DB_PORT}`,
//     dialect: "mysql",
//   },
//   production: {
//     username: `${process.env.DB_USER}`,
//     password: `${process.env.DB_PASSWORD}`,
//     database: `${process.env.DB_NAME_PROD}`,
//     host: `${process.env.DB_HOST}`,
//     port: `${process.env.DB_PORT}`,
//     dialect: "mysql",
//   },
// };
