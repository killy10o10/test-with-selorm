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
const { logout } = require("../controllers/UserController");
const util = require("../utils/helpers");
const bcrypt = require("bcrypt");


// mock the bcrypt dependency
jest.mock("bcrypt", () => ({
  genSalt: jest.fn(() => Promise.resolve("mockedSalt")),
  hash: jest.fn(() => Promise.resolve("mockedHash")),
  compare: jest.fn((password, hash) => {
    if (password === "helloworld") {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }),
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
  describe("GET /sign-up", () => {
    test("responds with status code 200 with object with key data", async () => {
      const res = await request(app).get("/sign-up");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty(["data"]);
      expect(res.body.data).toEqual({ title: "Todo App - Sign Up" });
    });
  });

  describe("POST /sign-up", () => {
    test("should hash password using bcrypt", async () => {
      //spy on bcrypt
      const genSalt = jest.spyOn(bcrypt, "genSalt");
      const hash = jest.spyOn(bcrypt, "hash");
      jest.spyOn(bcrypt, "compare");
      await request(app).post("/sign-up").send(userMockObject);
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
      console.log(res.body)
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

  describe("GET /sign-in", () => {
    test("should respond with status code 200 and data object with key title", async () => {
      const res = await request(app).get("/sign-in");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty(["data"]);
      expect(res.body.data).toEqual({ title: "Todo App - Sign In" });
    });

    test("should compare password using bcrypt", async () => {
      const res1 = await request(app).post("/sign-up").send(userMockObject);
      expect(res1.statusCode).toBe(201);

      const compare = jest.spyOn(bcrypt, "compare");
      const res = await request(app).post("/sign-in").send(userMockObject);
      expect(compare).toHaveBeenCalledWith(
        userMockObject.password,
        res.body.user.password
      );
    });

    test("should login user and respond with status code 200 and user object with keys username and id", async () => {
      //create a new user
      const res1 = await request(app).post("/sign-up").send(userMockObject);
      expect(res1.statusCode).toBe(201);
      expect(res1.body).toHaveProperty(["user"]);
      expect(res1.body.user).toMatchObject({
        id: expect.any(String),
        username: userMockObject.username,
      });

      //login user
      const res = await request(app).post("/sign-in").send(userMockObject);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty(["user"]);
      expect(res.body.user).toMatchObject({
        id: expect.any(String),
        username: userMockObject.username,
        password: expect.any(String),
      });
    });
    test("should respond with status code 404 and error message  user not found", async () => {
      //login with non existing username
      const res = await request(app).post("/sign-in").send(userMockObject);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty(["errors"]);
      expect(res.body.errors).toEqual({
        username: "username not found",
      });
    });

    test("should respond with status code 403 and error message invalid password", async () => {
      //create user
      const res1 = await request(app).post("/sign-up").send(userMockObject);
      expect(res1.statusCode).toBe(201);

      //login with wrong password
      userMockObject.password = "helloworld1";
      const res = await request(app).post("/sign-in").send(userMockObject);
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty(["errors"]);
      expect(res.body.errors).toMatchObject({
        password: "invalid password",
      });
    });
  });

  describe("Logout", () => {
    test("should clear cookie and  respond with status code 200 and a user logout message", () => {
      // mock request,res objects
      const req = {};
      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      logout(req, res);
      expect(res.cookie).toHaveBeenCalledWith("jwt", "", { maxAge: 0 });
      expect(res.cookie).toHaveBeenCalledWith("jwt_exist", true, { maxAge: 0 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status().json).toHaveBeenCalledWith({
        data: "user logged out",
      });
    });
  });

  describe("errorHandler", () => {
    test("should return [true,errors] when error has name property", () => {
      const err = { name: "ValidatorError" };
      const [hasError, errors] = util.errorHandler(err);
      expect(hasError).toBe(true);
      expect(errors).toMatchObject({
        username: "user with the same name exist already",
      });
    });

    test("should return [true,errors] when error has multiple properties", () => {
      const err = {
        username: new Error("username is required"),
        password: new Error("password should be at least 6 characters long"),
        tosAgreement: new Error("tosAgreement is required"),
      };
      const [hasError, errors] = util.errorHandler(err);
      expect(hasError).toBe(true);
      expect(errors).toEqual({
        username: "username is required",
        password: "password should be at least 6 characters long",
        tosAgreement: "tosAgreement is required",
      });
    });

    test('should return [false]  when there are no errors', ()=>{
      const err = {
        username:'',
        password:'',
        tosAgreement:''
      }
      const [hasError,errors]  =  util.errorHandler(err)
      expect(hasError).toBe(false)
    })
  });
});
