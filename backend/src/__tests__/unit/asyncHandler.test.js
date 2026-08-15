import { asynchandler } from "../../utils/asyncHandler.js";

describe("asynchandler", () => {
  test("calls handler and catches errors", async () => {
    const mockReq = {};
    const mockRes = { locals: {} };
    const mockNext = (err) => {
      throw err;
    };

    const successHandler = asynchandler(async (req, res) => {
      res.locals.value = "success";
    });

    await successHandler(mockReq, mockRes, mockNext);
    expect(mockRes.locals.value).toBe("success");
  });

  test("catches rejected promise and calls next with error", async () => {
    const handler = asynchandler(async (req, res) => {
      throw new Error("Test error");
    });

    const mockReq = {};
    const mockRes = { locals: {} };
    let caughtError = null;
    const mockNext = (err) => {
      caughtError = err;
    };

    await handler(mockReq, mockRes, mockNext);

    expect(caughtError).toBeInstanceOf(Error);
    expect(caughtError.message).toBe("Test error");
  });

  test("catches synchronous errors and calls next with error", async () => {
    // Sync throws inside async function become rejections - handled correctly
    const handler = asynchandler(async (req, res) => {
      throw new Error("Sync error");
    });

    const mockReq = {};
    const mockRes = { locals: {} };
    let caughtError = null;
    const mockNext = (err) => {
      caughtError = err;
    };

    await handler(mockReq, mockRes, mockNext);

    expect(caughtError).toBeInstanceOf(Error);
    expect(caughtError.message).toBe("Sync error");
  });
});
