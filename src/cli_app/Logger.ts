import type { Address } from "./Address";
import GLOBAL_CONFIG from "./Config/config";
import { StringUtils } from "./Utils/string.utils";

export class Logger {
  /* Note: The first number is the width of the column headers, defined in this.print() */
  public columnWidths = {
    address: Math.max(7, GLOBAL_CONFIG.mostHexCharsNeeded.address),
    virtPageNum: Math.max(7, GLOBAL_CONFIG.mostHexCharsNeeded.pageTable.virtPageNum),
    pageOff: Math.max(6, GLOBAL_CONFIG.mostHexCharsNeeded.pageTable.pageOffset),
    pageTableResult: 6,
    physPageNum: Math.max(6, GLOBAL_CONFIG.mostHexCharsNeeded.pageTable.physPageNum),
    l1Tag: Math.max(6, GLOBAL_CONFIG.mostHexCharsNeeded.l1.tag),
    l1Set: Math.max(6, GLOBAL_CONFIG.mostHexCharsNeeded.l1.setIndex),
    l1Line: Math.max(7, GLOBAL_CONFIG.mostHexCharsNeeded.l1.lineIndex),
    l1Result: 6,
  };

  public columnSeparator = "   ";

  public lines: string[] = [];

  public metrics = {
    numPageTableCmp: 0,
    numPageTableCap: 0,
    numPageTableHits: 0,
    numDataCacheCmp: 0,
    numDataCacheCap: 0,
    numDataCacheHits: 0,
  };

  public log(line: string) {
    this.lines.push(line);
  }

  public clear() {
    this.lines = [];
    this.metrics = {
      numPageTableCmp: 0,
      numPageTableCap: 0,
      numPageTableHits: 0,
      numDataCacheCmp: 0,
      numDataCacheCap: 0,
      numDataCacheHits: 0,
    };
  }

  public print() {
    console.log(this.toString());
  }

  public toString() {
    const headerLine1 = [
      StringUtils.center("", this.columnWidths.address),
      StringUtils.center("Virtual", this.columnWidths.virtPageNum),
      StringUtils.center("Page", this.columnWidths.pageOff),
      StringUtils.center("PT", this.columnWidths.pageTableResult),
      StringUtils.center("Phys", this.columnWidths.physPageNum),
      StringUtils.center("", this.columnWidths.l1Tag),
      StringUtils.center("DC Set", this.columnWidths.l1Set),
      StringUtils.center("DC Line", this.columnWidths.l1Set),
      StringUtils.center("DC", this.columnWidths.l1Result),
    ];

    const headerLine2 = [
      StringUtils.center("Address", this.columnWidths.address),
      StringUtils.center("Page # ", this.columnWidths.virtPageNum),
      StringUtils.center("Offset", this.columnWidths.pageOff),
      StringUtils.center("Result", this.columnWidths.pageTableResult),
      StringUtils.center("Page #", this.columnWidths.physPageNum),
      StringUtils.center("DC Tag", this.columnWidths.l1Tag),
      StringUtils.center("Index", this.columnWidths.l1Set),
      StringUtils.center("Index", this.columnWidths.l1Line),
      StringUtils.center("Result", this.columnWidths.l1Result),
    ];

    const sep = [
      "".padEnd(this.columnWidths.address, "-"),
      "".padEnd(this.columnWidths.virtPageNum, "-"),
      "".padEnd(this.columnWidths.pageOff, "-"),
      "".padEnd(this.columnWidths.pageTableResult, "-"),
      "".padEnd(this.columnWidths.physPageNum, "-"),
      "".padEnd(this.columnWidths.l1Tag, "-"),
      "".padEnd(this.columnWidths.l1Set, "-"),
      "".padEnd(this.columnWidths.l1Line, "-"),
      "".padEnd(this.columnWidths.l1Result, "-"),
    ];

    return (
      "\n" +
      headerLine1.join(this.columnSeparator) +
      "\n" +
      headerLine2.join(this.columnSeparator) +
      "\n" +
      sep.join(this.columnSeparator) +
      this.lines.join(this.columnSeparator)
    );
  }

  public toStringArray() {
    return this.lines
      .join("|")
      .split("\n")
      .map((line) => {
        return line.split("|").map((piece) => piece.trim());
      });
  }

  public logAddress(address: Address) {
    const addr_string = address.toHex();
    this.log("\n" + StringUtils.center(addr_string, this.columnWidths.address));
  }

  public logPageTable(
    state: "HIT" | "COMPULSORY_MISS" | "CAPACITY_MISS",
    address: Address,
    physicalPageNumber: number
  ) {
    const virt_page = address
      .getPageIndex()
      .toString(16)
      .padStart(GLOBAL_CONFIG.mostHexCharsNeeded.pageTable.virtPageNum, "0");
    const page_off = address
      .getPageOffset()
      .toString(16)
      .padStart(GLOBAL_CONFIG.mostHexCharsNeeded.pageTable.pageOffset, "0");

    this.log(StringUtils.center(virt_page, this.columnWidths.virtPageNum));
    this.log(StringUtils.center(page_off, this.columnWidths.pageOff));

    switch (state) {
      case "HIT":
        this.log(StringUtils.center("+", this.columnWidths.pageTableResult));
        this.metrics.numPageTableHits++;
        break;
      case `COMPULSORY_MISS`:
        this.log(StringUtils.center("CMP", this.columnWidths.pageTableResult));
        this.metrics.numPageTableCmp++;
        break;
      case `CAPACITY_MISS`:
        this.log(StringUtils.center("CAP", this.columnWidths.pageTableResult));
        this.metrics.numPageTableCap++;
        break;
    }

    const phys_page = physicalPageNumber
      .toString(16)
      .padStart(GLOBAL_CONFIG.mostHexCharsNeeded.pageTable.physPageNum, "0");
    this.log(StringUtils.center(phys_page, this.columnWidths.physPageNum));
  }

  public logDataCache(
    state: "HIT" | "COMPULSORY_MISS" | "CAPACITY_MISS",
    address: Address,
    setIndex: number,
    lineIndex: number
  ) {
    const tag = address.getL1TagHex();
    const set = setIndex.toString(16).padStart(GLOBAL_CONFIG.mostHexCharsNeeded.l1.setIndex);
    const line = lineIndex.toString(16).padStart(GLOBAL_CONFIG.mostHexCharsNeeded.l1.lineIndex);

    this.log(StringUtils.center(tag, this.columnWidths.l1Tag));
    this.log(StringUtils.center(set, this.columnWidths.l1Set));
    this.log(StringUtils.center(line, this.columnWidths.l1Line));

    switch (state) {
      case "HIT":
        this.log(StringUtils.center("+", this.columnWidths.pageTableResult));
        this.metrics.numDataCacheHits++;
        break;
      case `COMPULSORY_MISS`:
        this.log(StringUtils.center("CMP", this.columnWidths.pageTableResult));
        this.metrics.numDataCacheCmp++;
        break;
      case `CAPACITY_MISS`:
        this.log(StringUtils.center("CAP", this.columnWidths.pageTableResult));
        this.metrics.numDataCacheCap++;
        break;
    }
  }
}

export const GLOBAL_LOGGER = new Logger();
