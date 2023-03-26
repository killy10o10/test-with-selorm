/**
 * base file for testing UserController.js
 */

//dependencies
const request = require("supertest");
const {
  afterAll,
  beforeAll,
  expect,
  test,
  describe,
  beforeEach,
  afterEach,
} = require("@jest/globals");
const app = require("../index");
const User = require("../models/User");

const bcrypt = require("bcrypt");
// mock the bcrypt dependency
jest.mock("bcrypt", () => ({
  genSalt: jest.fn(() => Promise.resolve("mockedSalt")),
  hash: jest.fn(() => Promise.resolve("mockedHash")),
}));

describe("UserController", () => {
  let server;
  beforeAll(() => {
    server = app.listen(3001);
  });
  afterAll((done) => {
    server.close();
    done();
  });
  describe("GET /sign-up", () => {
    test("responds with status code 200 with object with key data", async () => {
      const res = await request(app).get("/sign-up");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty(["data"]);
      expect(res.body.data).toEqual({ title: "Todo App - Sign Up" });
    });
  });

  describe("POST /sign-up", () => {
    let userMockObject;
    beforeEach(() => {
      userMockObject = {
        username: "ewave80@gmail.com",
        password: "helloworld",
        tosAgreement: true,
      };
    });
    afterEach(async () => {
      //delete users
      await User.destroy({ where: {} });
    });
    test("should hash password using bcrypt", async () => {
      //spy on bcrypt
      const genSalt = jest.spyOn(bcrypt, "genSalt");
      const hash = jest.spyOn(bcrypt, "hash");
      const res = await request(app).post("/sign-up").send(userMockObject);
      expect(genSalt).toHaveBeenCalled();
      expect(hash).toHaveBeenCalledWith("helloworld", "mockedSalt");
    });

    test("should return 403 status code and error messages when user data is invalid", async () => {
      userMockObject = { username: "", password: "1234", tosAgreement: false };
      const res = await request(app).post("/sign-up").send(userMockObject);
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty(["errors"]);
      expect(res.body.errors).toEqual({
        username: "username is required",
        password: "password should be at least 6 characters long",
        tosAgreement: "tosAgreement is required",
      });
    });

    test("should return 201 status code and  a user object with keys  username and id when user data is valid", async () => {
      const res = await request(app).post("/sign-up").send(userMockObject);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty(["user"]);
      expect(res.body.user).toEqual({
        username: "ewave80@gmail.com",
        id: expect.any(String),
      });
    });

    test("should return 403 status code and errors object with key diplicate with value user with the same name exist already", async () => {
      // Create a user with the given username
      const res1 = await request(app).post("/sign-up").send(userMockObject);
      expect(res1.statusCode).toBe(201);

      // try to create a notheruser with the same username
      const res = await request(app).post("/sign-up").send(userMockObject);
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty(["errors"]);
      expect(res.body.errors).toMatchObject({
        username: "user with the same name exist already",
      });
    });
  });
});
