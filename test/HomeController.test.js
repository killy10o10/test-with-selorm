/**
 * base test file for Home controller
 */

// dependencies
const request = require("supertest");
const {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
} = require("@jest/globals");
const app = require("../index");

describe("HomeController", () => {
  let server;
  beforeAll(() => {
    server = app.listen(3001);
  });
  afterAll((done) => {
    server.close();
    done();
  });
  describe("GET /", () => {
    test("response with status 200 and  json  with key data", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty(["data"]);
      expect(res.body.data).toMatchObject({
        title: "Todo App - Home",
        description: expect.any(String),
      });
    });
  });
});
