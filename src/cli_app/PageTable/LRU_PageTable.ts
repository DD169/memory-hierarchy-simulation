import { writable, type Subscriber } from "svelte/store";
import type { Address } from "../Address";
import GLOBAL_CONFIG from "../Config/config";
import type { Logger } from "../Logger";
import type { PageTable, PageTableEntry } from "./PageTableFactory";

export type LRU_PageTableEntry = PageTableEntry & {
  counter: number;
};

export class LRU_PageTable implements PageTable {
  private _storage = writable<LRU_PageTableEntry[]>([]);
  private _logger: Logger;

  constructor(logger: Logger) {
    this._logger = logger;

    this._storage.update((currState) => {
      currState.length = 0;

      for (let i = 0; i < GLOBAL_CONFIG.pageTable.numPhysicalPages; ++i) {
        currState.push({
          counter: 0,
          virtualAddress: null,
          physicalAddress: i,
        });
      }

      return currState;
    });
  }

  subscribe(subscribe_function: Subscriber<LRU_PageTableEntry[]>) {
    return this._storage.subscribe(subscribe_function);
  }

  /**
   * If address in Page Table, return true.
   * Else, pull address into Page Table, return false.
   */
  query(address: Address): boolean {
    let wasInPageTable = false;

    this._storage.update((currState) => {
      const pageIndex = address.getPageIndex();
      const entryIndex = currState.findIndex((entry) => entry.virtualAddress === pageIndex);

      if (entryIndex !== -1) {
        wasInPageTable = true;
        currState = this.LRU_handleHit(currState, entryIndex, address);
      } else {
        wasInPageTable = false;
        currState = this.LRU_handleMiss(currState, address);
      }

      return currState;
    });

    return wasInPageTable;
  }

  private LRU_handleMiss(entries: LRU_PageTableEntry[], address: Address): LRU_PageTableEntry[] {
    // Choose old frame to kick out
    const oldFrameIndex = this.getOldestFrameIndex(entries);

    // Log miss based on whether the Page Table has empty entries or not
    if (entries[oldFrameIndex].virtualAddress === null) {
      this._logger.logPageTable("COMPULSORY_MISS", address, entries[oldFrameIndex].physicalAddress);
    } else {
      this._logger.logPageTable("CAPACITY_MISS", address, entries[oldFrameIndex].physicalAddress);
    }

    // Update PageTable
    entries[oldFrameIndex].virtualAddress = address.getPageIndex();

    // Update LRU
    for (let i = 0; i < GLOBAL_CONFIG.pageTable.numPhysicalPages; ++i) {
      if (i === oldFrameIndex) {
        entries[i].counter = 0;
      } else {
        entries[i].counter++;
      }
    }

    return entries;
  }

  private getOldestFrameIndex(entries: LRU_PageTableEntry[]) {
    // Iterate to find oldest
    let oldestFrameIndex = 0;
    let oldestCounterSoFar = 0;

    for (let i = 0; i < entries.length; ++i) {
      if (entries[i].counter > oldestCounterSoFar) {
        oldestCounterSoFar = entries[i].counter;
        oldestFrameIndex = i;
      }
    }

    return oldestFrameIndex;
  }

  private LRU_handleHit(entries: LRU_PageTableEntry[], index: number, address: Address): LRU_PageTableEntry[] {
    this._logger.logPageTable("HIT", address, entries[index].physicalAddress);

    // Update LRU
    for (let i = 0; i < GLOBAL_CONFIG.pageTable.numPhysicalPages; ++i) {
      if (i === index) {
        entries[i].counter = 0;
      } else {
        entries[i].counter++;
      }
    }

    return entries;
  }
}
