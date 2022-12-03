import { writable, type Subscriber } from "svelte/store";
import type { Address } from "../Address";
import GLOBAL_CONFIG from "../Config/config";
import type { Logger } from "../Logger";
import type { PageTable, PageTableEntry } from "./PageTableFactory";

export type RAND_PageTableEntry = PageTableEntry;

export class RAND_PageTable implements PageTable {
  private _storage = writable<RAND_PageTableEntry[]>([]);
  private _logger: Logger;

  constructor(logger: Logger) {
    this._logger = logger;

    this._storage.update((currState) => {
      currState.length = 0;

      for (let i = 0; i < GLOBAL_CONFIG.pageTable.numPhysicalPages; ++i) {
        currState.push({
          virtualAddress: null,
          physicalAddress: i,
        });
      }

      return currState;
    });
  }

  subscribe(subscribe_function: Subscriber<RAND_PageTableEntry[]>) {
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
        currState = this.RAND_handleHit(currState, entryIndex, address);
      } else {
        wasInPageTable = false;
        currState = this.RAND_handleMiss(currState, address);
      }

      return currState;
    });

    return wasInPageTable;
  }

  private RAND_handleMiss(entries: RAND_PageTableEntry[], address: Address): RAND_PageTableEntry[] {
    // Choose old frame to kick out
    const oldFrameIndex = this.getRandomFrameIndex(entries);

    // Log miss based on whether the Page Table has empty entries or not
    if (entries.some((entry) => entry.virtualAddress === null)) {
      this._logger.logPageTable("COMPULSORY_MISS", address, oldFrameIndex);
    } else {
      this._logger.logPageTable("CAPACITY_MISS", address, oldFrameIndex);
    }

    // Update PageTable
    entries[oldFrameIndex].virtualAddress = address.getPageIndex();

    return entries;
  }

  private getRandomFrameIndex(entries: RAND_PageTableEntry[]) {
    return Math.floor(Math.random() * entries.length);
  }

  private RAND_handleHit(entries: RAND_PageTableEntry[], index: number, address: Address): RAND_PageTableEntry[] {
    this._logger.logPageTable("HIT", address, index);

    return entries;
  }
}
