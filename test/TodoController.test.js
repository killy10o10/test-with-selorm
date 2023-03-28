/**
 * base test file for Todo Controller
 */

// Dependencies
const request = require("supertest");
const {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
} = require("@jest/globals");
const app = require("../index");

describe("TodoController", () => {
  let server;
  beforeAll(() => {
    server = app.listen(3001);
  });
  afterAll((done) => {
    server.close();
    done();
  });
  describe("GET /dashbord", () => {
    test("should respond with status code 302 and with data with message unauthorized when user is not authenticated", async () => {
      const res = await request(app).get("/dashbord");
      expect(res.statusCode).toBe(302);
      console.log(res.body)
      expect(res.body).toHaveProperty(["data"]);
      expect(res.body.data.errors).toEqual({
        unauthorized: "unauthorized, please login"
      });
    });
  });
});
