import { Request } from "../../stores/RequestStore";

test("should construct object properly", () => {
  const request: Request = new Request(1234, "W", true);
  expect(request).toEqual({ addr: 1234, mode: "W", isCompleted: true });
});

test("should emit proper toString", () => {
  const request: Request = new Request(1234, "W", true);
  expect(request.toString()).toBe("W:1234");
});
