import { Request } from "../../stores/RequestStore";

test("should construct object properly", () => {
  const request = new Request(1234, "R", true);

  expect(request.addr).toBe(1234);
  expect(request.mode).toBe("R");
  expect(request.isCompleted).toBe(true);
});
