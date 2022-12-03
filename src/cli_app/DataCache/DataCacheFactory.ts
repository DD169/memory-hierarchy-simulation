import type { Subscriber, Unsubscriber } from "svelte/store";
import type { Address } from "../Address";
import GLOBAL_CONFIG from "../Config/config";
import type { Logger } from "../Logger";
import { LRU_DataCache } from "./LRU_DataCache";

export type DataCacheEntry = {
  tag: number | null;
  isValid: boolean;
};

export type DataCacheSet = {
  lines: DataCacheEntry[];
};

export interface DataCache {
  subscribe(subscribe_function: Subscriber<DataCacheSet[]>): Unsubscriber;
  query(address: Address): boolean;
}

export function getDataCache(logger: Logger): DataCache {
  return new LRU_DataCache(logger);

  /*

    Fully Associative Mapping:
      ~ 0 index bits
      Lines go anywhere
      Replacement Algorithm
      - LRU, FIFO, Random

    Direct Mapping:
      ~ # index bits = # lines in DataCache
      Lines go exactly 1 place
      No Replacement Algorithm
    
    Set Associative:
      ~ # index bits = 
      Lines go in exactly 1 set
      Lines go anywhere within set
      Replacement Algorithm within set
      - LRU, FIFO, Random


  */

  // switch (GLOBAL_CONFIG.pageTable.alg) {
  //   case "LRU":
  //     return new LRU_PageTable(logger);
  //   case "FIFO":
  //     return new FIFO_PageTable(logger);
  //   case "RAND":
  //     return new RAND_PageTable(logger);
  // }
}
