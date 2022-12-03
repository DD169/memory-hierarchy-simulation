import type { Subscriber, Unsubscriber } from "svelte/store";
import type { Address } from "../Address";
import GLOBAL_CONFIG from "../Config/config";
import type { Logger } from "../Logger";
import type { ReplacementPolicy } from "../Types/replacementPolicy";
import { FIFO_PageTable } from "./FIFO_PageTable";
import { LRU_PageTable } from "./LRU_PageTable";
import { RAND_PageTable } from "./RAND_PageTable";

export type PageTableEntry = {
  virtualAddress: number;
  physicalAddress: number;
};

export interface PageTable {
  subscribe(subscribe_function: Subscriber<PageTableEntry[]>): Unsubscriber;
  query(address: Address): void;
}

export function getPageTable(logger: Logger): PageTable {
  switch (GLOBAL_CONFIG.pageTable.alg) {
    case "LRU":
      return new LRU_PageTable(logger);
    case "FIFO":
      return new FIFO_PageTable(logger);
    case "RAND":
      return new RAND_PageTable(logger);
  }
}
