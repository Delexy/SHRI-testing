const request = require("supertest");
import express from "express";
import { router } from "../../src/server/routes";
const app = express();
app.use(express.json());
app.use("/", router);

describe("Тестирование сервера", () => {
  beforeAll(async () => {
    expect.hasAssertions();

    createUserResponse = await request(app).post("/api/user/").send({ email: USER_EMAIL, password: USER_PASSWORD });
    authUserResponse = await request(app).post("/api/user/auth").send({ email: USER_EMAIL, password: USER_PASSWORD });
    user = createUserResponse.body;
    authResponse = authUserResponse.body;
  });
  afterAll(() => {
    User.destroy({ where: { id: user.id } });
  });
});
