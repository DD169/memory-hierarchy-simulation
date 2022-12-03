import { writable, type Subscriber } from "svelte/store";
import type { Address } from "../Address";
import GLOBAL_CONFIG from "../Config/config";
import type { Logger } from "../Logger";
import type { DataCache, DataCacheEntry } from "./DataCacheFactory";

export type LRU_DataCacheEntry = DataCacheEntry & {
  counter: number;
};

export type LRU_DataCacheSet = {
  lines: LRU_DataCacheEntry[];
};

export class LRU_DataCache implements DataCache {
  private _storage = writable<LRU_DataCacheSet[]>([]);
  private _logger: Logger;

  constructor(logger: Logger) {
    this._logger = logger;

    this._storage.update((currState) => {
      currState = [];

      for (let i = 0; i < GLOBAL_CONFIG.l1.numSets; ++i) {
        const cacheSet = { lines: [] };

        for (let j = 0; j < GLOBAL_CONFIG.l1.setSize; ++j) {
          const cacheLine = { counter: 0, tag: null, isValid: false };

          cacheSet.lines.push(cacheLine);
        }

        currState.push(cacheSet);
      }

      return currState;
    });
  }

  subscribe(subscribe_function: Subscriber<LRU_DataCacheSet[]>) {
    return this._storage.subscribe(subscribe_function);
  }

  /**
   * Returns whether address was already in Cache.
   */
  query(address: Address): boolean {
    let wasInPageTable = false;

    this._storage.update((currState) => {
      const tag = address.getL1Tag();
      const setIndex = address.getL1SetIndex();
      const lineIndex = currState[setIndex].lines.findIndex((line) => line.tag === tag);

      if (lineIndex !== -1) {
        wasInPageTable = true;
        currState = this.LRU_handleHit(currState, setIndex, lineIndex, address);
      } else {
        wasInPageTable = false;
        currState = this.LRU_handleMiss(currState, setIndex, address);
      }

      return currState;
    });

    return wasInPageTable;
  }

  private LRU_handleMiss(sets: LRU_DataCacheSet[], setIndex: number, address: Address): LRU_DataCacheSet[] {
    // Choose old line to kick out
    const oldLineIndex = this.getOldestLineIndex(sets[setIndex]);

    // Log miss based on whether the Cache has empty entries or not
    if (sets.some((entry) => entry.lines.some((line) => line.tag === null))) {
      this._logger.logDataCache("COMPULSORY_MISS", address, setIndex, oldLineIndex);
    } else {
      this._logger.logDataCache("CAPACITY_MISS", address, setIndex, oldLineIndex);
    }

    // Update Cache
    const tag = address.getL1Tag();
    sets[setIndex].lines[oldLineIndex].tag = tag;

    // Update LRU
    for (let i = 0; i < sets[setIndex].lines.length; ++i) {
      if (i === oldLineIndex) {
        sets[setIndex].lines[i].counter = 0;
      } else {
        sets[setIndex].lines[i].counter++;
      }
    }

    return sets;
  }

  private getOldestLineIndex(set: LRU_DataCacheSet) {
    // Iterate to find oldest
    let oldestLineIndex = 0;
    let oldestCounterSoFar = 0;

    for (let i = 0; i < set.lines.length; ++i) {
      if (set.lines[i].counter > oldestCounterSoFar) {
        oldestCounterSoFar = set.lines[i].counter;
        oldestLineIndex = i;
      }
    }

    return oldestLineIndex;
  }

  private LRU_handleHit(
    sets: LRU_DataCacheSet[],
    setIndex: number,
    lineIndex: number,
    address: Address
  ): LRU_DataCacheSet[] {
    this._logger.logDataCache("HIT", address, setIndex, lineIndex);

    // Update LRU
    for (let i = 0; i < sets[setIndex].lines.length; ++i) {
      if (i === lineIndex) {
        sets[setIndex].lines[i].counter = 0;
      } else {
        sets[setIndex].lines[i].counter++;
      }
    }

    return sets;
  }
}
