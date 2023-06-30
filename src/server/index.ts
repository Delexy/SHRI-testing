import express from "express";
import { router } from "./routes";

const port = Number(process.env.PORT) || 3000;
const basename = "/hw/store";

const app = express();

app.use(express.json());
app.use(basename, router);
app.use(basename, express.static("dist"));

const server = app.listen(port, "::", () => {
  // @ts-ignore
  var host = server.address().address;
  // @ts-ignore
  var port = server.address().port;
  console.log(`Example app listening at http://localhost:${port}${basename}`);
});

export default server;
