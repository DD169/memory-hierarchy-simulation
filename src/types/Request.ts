export class Request {
  addr: number;
  mode: "W" | "R";
  isCompleted: boolean;

  constructor(_addr: number, _mode: "W" | "R", _isCompleted: boolean = false) {
    this.addr = _addr;
    this.mode = _mode;
    this.isCompleted = _isCompleted;
  }

  toString(numHexDigits: number = 8) {
    const addrHexString = "0x" + this.addr.toString(16).padStart(numHexDigits, "0");
    return `${this.mode}:${addrHexString}`;
  }
}
