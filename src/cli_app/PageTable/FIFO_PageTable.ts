import { writable, type Subscriber } from "svelte/store";
import type { Address } from "../Address";
import GLOBAL_CONFIG from "../Config/config";
import type { Logger } from "../Logger";
import type { PageTable, PageTableEntry } from "./PageTableFactory";

export type FIFO_PageTableEntry = PageTableEntry & {
  indicator: number;
};

export class FIFO_PageTable implements PageTable {
  private _storage = writable<FIFO_PageTableEntry[]>([]);
  private _logger: Logger;

  constructor(logger: Logger) {
    this._logger = logger;

    this._storage.update((currState) => {
      currState.length = 0;

      for (let i = 0; i < GLOBAL_CONFIG.pageTable.numPhysicalPages; ++i) {
        currState.push({
          indicator: 0,
          virtualAddress: null,
          physicalAddress: i,
        });
      }

      currState[0].indicator = 1;

      return currState;
    });
  }

  subscribe(subscribe_function: Subscriber<FIFO_PageTableEntry[]>) {
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
        currState = this.FIFO_handleHit(currState, entryIndex, address);
      } else {
        wasInPageTable = false;
        currState = this.FIFO_handleMiss(currState, address);
      }

      return currState;
    });

    return wasInPageTable;
  }

  private FIFO_handleMiss(entries: FIFO_PageTableEntry[], address: Address): FIFO_PageTableEntry[] {
    // Choose old frame to kick out
    const oldFrameIndex = this.getOldestFrameIndex(entries);

    // Log miss based on whether the Page Table has empty entries or not
    if (entries[oldFrameIndex].virtualAddress === null) {
      this._logger.logPageTable("COMPULSORY_MISS", address, oldFrameIndex);
    } else {
      this._logger.logPageTable("CAPACITY_MISS", address, oldFrameIndex);
    }

    // Update PageTable
    entries[oldFrameIndex].virtualAddress = address.getPageIndex();

    // Update FIFO
    entries[oldFrameIndex].indicator = 0;

    if (oldFrameIndex + 1 === GLOBAL_CONFIG.pageTable.numPhysicalPages) {
      entries[0].indicator = 1;
    } else {
      entries[oldFrameIndex + 1].indicator = 1;
    }

    return entries;
  }

  private getOldestFrameIndex(entries: FIFO_PageTableEntry[]) {
    return entries.findIndex((entry) => entry.indicator === 1);
  }

  private FIFO_handleHit(entries: FIFO_PageTableEntry[], index: number, address: Address): FIFO_PageTableEntry[] {
    this._logger.logPageTable("HIT", address, index);

    return entries;
  }
}
