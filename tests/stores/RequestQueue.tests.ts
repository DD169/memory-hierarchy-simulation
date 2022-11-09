import { RequestQueueStore } from "../../src/stores/RequestQueue";
import { Request } from "../../src/types/Request";

let requests: Request[] = [];

test("should construct with no given initial values", () => {
  const requestQueue = new RequestQueueStore();

  const unsubscribe = requestQueue.subscribe((currRequests: Request[]) => {
    requests = currRequests;
  });

  expect(requests).toStrictEqual([]);

  unsubscribe();
});

test("should construct with given initial values", () => {
  const requestQueue = new RequestQueueStore([
    new Request(1234, "W", false),
    new Request(5678, "R", true),
    new Request(0, "W"),
  ]);

  const unsubscribe = requestQueue.subscribe((currRequests: Request[]) => {
    requests = currRequests;
  });

  expect(requests).toEqual([
    { addr: 1234, mode: "W", isCompleted: false },
    { addr: 5678, mode: "R", isCompleted: true },
    { addr: 0, mode: "W", isCompleted: false },
  ]);

  unsubscribe();
});

test("enqueue should append a new request", () => {
  const requestQueue = new RequestQueueStore([
    new Request(1234, "W", false),
    new Request(5678, "R", true),
    new Request(0, "W"),
  ]);

  const unsubscribe = requestQueue.subscribe((currRequests: Request[]) => {
    requests = currRequests;
  });

  requestQueue.enqueue(new Request(1010, "R", true));

  expect(requests).toEqual([
    { addr: 1234, mode: "W", isCompleted: false },
    { addr: 5678, mode: "R", isCompleted: true },
    { addr: 0, mode: "W", isCompleted: false },
    { addr: 1010, mode: "R", isCompleted: true },
  ]);

  unsubscribe();
});

test("dequeue should remove a request from the top", () => {
  const requestQueue = new RequestQueueStore([
    new Request(1234, "W", false),
    new Request(5678, "R", true),
    new Request(0, "W"),
  ]);

  const unsubscribe = requestQueue.subscribe((currRequests: Request[]) => {
    requests = currRequests;
  });

  const output: Request = requestQueue.dequeue();

  expect(output).toEqual({ addr: 1234, mode: "W", isCompleted: false });

  expect(requests).toEqual([
    { addr: 5678, mode: "R", isCompleted: true },
    { addr: 0, mode: "W", isCompleted: false },
  ]);

  unsubscribe();
});

test("dequeue should return null if there is nothing to dequeue", () => {
  const requestQueue = new RequestQueueStore([]);

  const unsubscribe = requestQueue.subscribe((currRequests: Request[]) => {
    requests = currRequests;
  });

  const output: Request = requestQueue.dequeue();

  expect(output).toBeNull();

  expect(requests).toEqual([]);

  unsubscribe();
});

test("clear should remove all entries from queue", () => {
  const requestQueue = new RequestQueueStore([
    new Request(1234, "W", false),
    new Request(5678, "R", true),
    new Request(0, "W"),
  ]);

  const unsubscribe = requestQueue.subscribe((currRequests: Request[]) => {
    requests = currRequests;
  });

  expect(requests).toEqual([
    { addr: 1234, mode: "W", isCompleted: false },
    { addr: 5678, mode: "R", isCompleted: true },
    { addr: 0, mode: "W", isCompleted: false },
  ]);

  requestQueue.clear();

  expect(requests).toEqual([]);

  unsubscribe();
});
