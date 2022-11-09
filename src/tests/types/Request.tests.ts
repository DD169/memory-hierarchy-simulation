import { Request } from "../../types/Request";

test("should construct object properly", () => {
  const request: Request = new Request(1234, "W", true);
  expect(request).toEqual({ addr: 1234, mode: "W", isCompleted: true });
});

test("should emit proper toString", () => {
  const request: Request = new Request(1234, "W", true);
  expect(request.toString(3)).toBe("W:0x4d2");
});

test("should emit padded toString", () => {
  const request: Request = new Request(1234, "W", true);
  expect(request.toString()).toBe("W:0x000004d2");
});
