import { writable, type Subscriber, type Writable } from "svelte/store";

export class Request {
  addr: number;
  mode: "W" | "R";
  isCompleted: boolean;

  constructor(_addr: number, _mode: "W" | "R", _isCompleted: boolean = false) {
    this.addr = _addr;
    this.mode = _mode;
    this.isCompleted = _isCompleted;
  }

  toString() {
    return `${this.mode}:${this.addr}`;
  }
}

export class RequestListStore {
  private requestList: Writable<Request[]>;

  constructor(initialRequests: Request[] = []) {
    this.requestList = writable<Request[]>(initialRequests);
  }

  subscribe(fn: (newState: Request[]) => void) {
    return this.requestList.subscribe(fn);
  }

  append(newRequest: Request) {
    this.requestList.update((currRequestList) => {
      return [...currRequestList, newRequest];
    });
  }
}

export const RequestList = new RequestListStore();
