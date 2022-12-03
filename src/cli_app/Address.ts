import GLOBAL_CONFIG from "./Config/config";

export class Address {
  public value: number;

  constructor(value: number) {
    this.value = value;
  }

  public toHex() {
    return this.value.toString(16).padStart(GLOBAL_CONFIG.request.mostHexCharsNeeded, "0");
  }

  public toBinary() {
    return this.value.toString(2).padStart(GLOBAL_CONFIG.request.mostHexCharsNeeded * 4, "0");
  }

  public getPageIndex() {
    const pageIndex = Math.floor(this.value / GLOBAL_CONFIG.pageTable.pageSize);
    return pageIndex;
  }

  public getPageIndexHex(options: { padded: boolean } = { padded: true }) {
    const pageIndex = this.getPageIndex();
    const padAmount = GLOBAL_CONFIG.mostHexCharsNeeded.pageTable.physPageNum;
    return this.hexify(pageIndex, padAmount, options);
  }

  public getPageOffset() {
    const pageOffset = Math.floor(this.value % GLOBAL_CONFIG.pageTable.pageSize);
    return pageOffset;
  }

  public getPageOffsetHex(options: { padded: boolean } = { padded: true }) {
    const pageOffset = this.getPageOffset();
    const padAmount = GLOBAL_CONFIG.mostHexCharsNeeded.pageTable.pageOffset;
    return this.hexify(pageOffset, padAmount, options);
  }

  public getL1Tag() {
    const tag = Math.floor(this.value / (GLOBAL_CONFIG.l1.setSize * GLOBAL_CONFIG.l1.numSets));
    return tag;
  }

  public getL1TagHex(options: { padded: boolean } = { padded: true }) {
    const tag = this.getL1Tag();
    const padAmount = GLOBAL_CONFIG.mostHexCharsNeeded.l1.tag;
    return this.hexify(tag, padAmount, options);
  }

  public getL1SetIndex() {
    const tagAndSetIndex = Math.floor(this.value / GLOBAL_CONFIG.l1.setSize);
    const setMask = GLOBAL_CONFIG.l1.numSets - 1;
    const setIndex = tagAndSetIndex & setMask;
    return setIndex;
  }

  public getL1SetIndexHex(options: { padded: boolean } = { padded: true }) {
    const setIndex = this.getL1SetIndex();
    const padAmount = GLOBAL_CONFIG.mostHexCharsNeeded.l1.setIndex;
    return this.hexify(setIndex, padAmount, options);
  }

  public getL1Offset() {
    const offsetMask = GLOBAL_CONFIG.l1.lineSize - 1;
    const offset = this.value & offsetMask;
    return offset;
  }

  public getL1OffsetHex(options: { padded: boolean } = { padded: true }) {
    const offset = this.getL1Offset();
    const padAmount = GLOBAL_CONFIG.mostHexCharsNeeded.l1.lineIndex;
    return this.hexify(offset, padAmount, options);
  }

  public getL2Tag() {
    const tag = Math.floor(this.value / (GLOBAL_CONFIG.l2.setSize * GLOBAL_CONFIG.l2.numSets));
    return tag;
  }

  public getL2TagHex(options: { padded: boolean } = { padded: true }) {
    const tag = this.getL2Tag();
    const padAmount = GLOBAL_CONFIG.mostHexCharsNeeded.l2.tag;
    return this.hexify(tag, padAmount, options);
  }

  public getL2SetIndex() {
    const tagAndSetIndex = Math.floor(this.value / GLOBAL_CONFIG.l2.setSize);
    const setMask = GLOBAL_CONFIG.l2.numSets - 1;
    const setIndex = tagAndSetIndex & setMask;
    return setIndex;
  }

  public getL2SetIndexHex(options: { padded: boolean } = { padded: true }) {
    const setIndex = this.getL2SetIndex();
    const padAmount = GLOBAL_CONFIG.mostHexCharsNeeded.l2.setIndex;
    return this.hexify(setIndex, padAmount, options);
  }

  public getL2Offset() {
    const offsetMask = GLOBAL_CONFIG.l2.lineSize - 1;
    const offset = this.value & offsetMask;
    return offset;
  }

  public getL2OffsetHex(options: { padded: boolean } = { padded: true }) {
    const offset = this.getL2Offset();
    const padAmount = GLOBAL_CONFIG.mostHexCharsNeeded.l2.lineIndex;
    return this.hexify(offset, padAmount, options);
  }

  private hexify(value: number, padAmount: number, options?: { padded?: boolean }) {
    if (!options.padded) {
      return value.toString(16);
    }

    return value.toString(16).padStart(padAmount, "0");
  }
}
