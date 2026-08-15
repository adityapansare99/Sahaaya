import { ApiResponse } from "../../utils/apiResponse.js";

describe("ApiResponse", () => {
  test("creates success response with data", () => {
    const res = new ApiResponse(200, { id: 1 }, "Success");
    expect(res.statuscode).toBe(200);
    expect(res.data).toEqual({ id: 1 });
    expect(res.message).toBe("Success");
    expect(res.success).toBe(true);
  });

  test("creates error response", () => {
    const res = new ApiResponse(404, null, "Not found");
    expect(res.statuscode).toBe(404);
    expect(res.data).toBeNull();
    expect(res.message).toBe("Not found");
    expect(res.success).toBe(false);
  });

  test("success is true for status < 400", () => {
    expect(new ApiResponse(200).success).toBe(true);
    expect(new ApiResponse(399).success).toBe(true);
  });

  test("success is false for status >= 400", () => {
    expect(new ApiResponse(400).success).toBe(false);
    expect(new ApiResponse(500).success).toBe(false);
  });

  test('defaults message to "successful" when not provided', () => {
    const res = new ApiResponse(200, { test: true });
    expect(res.message).toBe("successful");
    expect(res.data).toEqual({ test: true });
  });
});
