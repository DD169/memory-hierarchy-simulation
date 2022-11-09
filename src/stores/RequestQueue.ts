import type { Request } from "../types/Request";
import { writable, type Writable } from "svelte/store";

export class RequestQueueStore {
  private requests: Writable<Request[]>;

  constructor(initialRequests: Request[] = []) {
    this.requests = writable<Request[]>(initialRequests);
  }

  subscribe(subscription: (requests: Request[]) => void) {
    return this.requests.subscribe(subscription);
  }

  enqueue(request: Request): void {
    this.requests.update((currRequests: Request[]) => {
      return [...currRequests, request];
    });
  }

  dequeue(): Request {
    let topRequest: Request | null = null;

    this.requests.update((currRequests: Request[]) => {
      if (currRequests.length <= 0) {
        return currRequests;
      }

      topRequest = currRequests[0];
      return currRequests.slice(1);
    });

    return topRequest;
  }

  clear(): void {
    this.requests.set([]);
  }
}

export const RequestQueue = new RequestQueueStore();
