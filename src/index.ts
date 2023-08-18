import express, { Application } from "express";
import bodyParser from "body-parser";
// import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { serve, setup } from "swagger-ui-express";
import { bootstrapAdmin } from "./utils/bootstrap.util";
import Routes from "./routes";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
// connect to mongodb
require("./config/mongoose.config");

const PORT = process.env.PORT || 8000;

const app: Application = express();
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", 1);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,authtoken"
  );
  next();
});

app.use(cors());
app.use(express.json());
// app.use(morgan("tiny"));
app.use(express.static("public"));

app.use(
  "/swagger",
  serve,
  setup(undefined, {
    swaggerOptions: {
      url: "/swagger/swagger.json",
    },
  })
);

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/api", Routes);
bootstrapAdmin(() => {
  console.log("Bootstraping finished!");
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  console.log("swagger link ", `localhost:${PORT}/swagger`);
});
