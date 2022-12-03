import configContents from "../../../trace.config?raw";
import type { ReplacementPolicy } from "../Types/replacementPolicy";

export class Config {
  request: { mostHexCharsNeeded: number };
  tlb: { use: boolean; numSets: number; setSize: number };
  pageTable: {
    use: boolean;
    numVirtualPages: number;
    numPhysicalPages: number;
    pageSize: number;
    alg: ReplacementPolicy;
  };
  l1: {
    use: boolean;
    numSets: number;
    setSize: number;
    lineSize: number;
    policy: "write-through" | "write-back";
    alg: ReplacementPolicy;
  };
  l2: {
    use: boolean;
    numSets: number;
    setSize: number;
    lineSize: number;
    policy: "write-through" | "write-back";
    alg: ReplacementPolicy;
  };

  public get mostHexCharsNeeded() {
    return {
      get address() {
        return GLOBAL_CONFIG.request.mostHexCharsNeeded;
      },

      get pageTable() {
        return {
          get virtPageNum() {
            return Math.ceil(
              (GLOBAL_CONFIG.request.mostHexCharsNeeded * 4 - Math.log2(GLOBAL_CONFIG.pageTable.pageSize)) / 4
            );
          },

          get physPageNum() {
            return Math.ceil(Math.log2(GLOBAL_CONFIG.pageTable.numPhysicalPages) / 4);
          },

          get pageOffset() {
            return Math.ceil(Math.log2(GLOBAL_CONFIG.pageTable.pageSize) / 4);
          },
        };
      },

      get l1() {
        return {
          get tag() {
            const setIndexBits = Math.log2(GLOBAL_CONFIG.l1.numSets);
            const wordIndexBits = Math.log2(GLOBAL_CONFIG.l1.lineSize);

            return Math.ceil((GLOBAL_CONFIG.request.mostHexCharsNeeded * 4 - setIndexBits - wordIndexBits) / 4);
          },
          get setIndex() {
            return Math.ceil(Math.log2(GLOBAL_CONFIG.l1.numSets) / 4);
          },
          get lineIndex() {
            return Math.ceil(Math.log2(GLOBAL_CONFIG.l1.setSize) / 4);
          },
        };
      },

      get l2() {
        return {
          get tag() {
            const setIndexBits = Math.log2(GLOBAL_CONFIG.l2.numSets);
            const wordIndexBits = Math.log2(GLOBAL_CONFIG.l2.lineSize);

            return Math.ceil((GLOBAL_CONFIG.request.mostHexCharsNeeded * 4 - setIndexBits - wordIndexBits) / 4);
          },
          get setIndex() {
            return Math.ceil(Math.log2(GLOBAL_CONFIG.l2.numSets) / 4);
          },
          get lineIndex() {
            return Math.ceil(Math.log2(GLOBAL_CONFIG.l2.setSize) / 4);
          },
        };
      },
    };
  }

  print() {
    console.table(this.prettify());
  }

  prettify() {
    const TLB = this.tlb.use ? { Sets: this.tlb.numSets, Set_Size: this.tlb.setSize } : { used: "no" };
    const Page_Table = this.pageTable.use
      ? {
          Virtual: this.pageTable.numVirtualPages,
          Physical: this.pageTable.numPhysicalPages,
          Page_Size: this.pageTable.pageSize,
          Alg: this.pageTable.alg,
        }
      : { used: "no" };
    const Data_Cache = this.l1.use
      ? {
          Sets: this.l1.numSets,
          Set_Size: this.l1.setSize,
          Line_Size: this.l1.lineSize,
          Policy: this.l1.policy,
          Alg: this.l1.alg,
        }
      : { used: "no" };
    const L2_Cache = this.l2.use
      ? {
          Sets: this.l2.numSets,
          Set_Size: this.l2.setSize,
          Line_Size: this.l2.lineSize,
          Policy: this.l2.policy,
          Alg: this.l2.alg,
        }
      : { used: "no" };

    return { Data_Cache, L2_Cache, TLB, Page_Table };
  }
}

function getConfig(): Config {
  const configInput = parseConfigInput();

  const config: Config = new Config();

  config.request = { mostHexCharsNeeded: 0 };

  // TLB configuration
  if (configInput[4]["virtual addresses"] === "y" && configInput[4]["tlb"] === "y") {
    config.tlb = {
      use: true,
      numSets: parseInt(configInput[0]["number of sets"] ?? "2"),
      setSize: parseInt(configInput[0]["set size"] ?? "1"),
    };
  }

  // Page Table configuration
  if (configInput[4]["virtual addresses"] === "y") {
    config.pageTable = {
      use: true,
      numVirtualPages: parseInt(configInput[1]["number of virtual pages"] ?? "64"),
      numPhysicalPages: parseInt(configInput[1]["number of physical pages"] ?? "4"),
      pageSize: parseInt(configInput[1]["page size"] ?? "256"),
      alg:
        configInput[1]["replacement policy"] === "fifo"
          ? "FIFO"
          : configInput[1]["replacement policy"] === "random"
          ? "RAND"
          : "LRU",
    };
  }

  // Data Cache (L1) configuration
  config.l1 = {
    use: true,
    numSets: parseInt(configInput[2]["number of sets"] ?? "4"),
    setSize: parseInt(configInput[2]["set size"] ?? "1"),
    lineSize: parseInt(configInput[2]["line size"] ?? "16"),
    policy: configInput[2]["write through/no write allocate"] === "n" ? "write-back" : "write-through",
    alg:
      configInput[2]["replacement policy"] === "fifo"
        ? "FIFO"
        : configInput[2]["replacement policy"] === "random"
        ? "RAND"
        : "LRU",
  };

  // L2 Cache configuration
  if (configInput[4]["l2 cache"] === "y") {
    config.l2 = {
      use: true,
      numSets: parseInt(configInput[3]["number of sets"] ?? "16"),
      setSize: parseInt(configInput[3]["set size"] ?? "4"),
      lineSize: parseInt(configInput[3]["line size"] ?? "16"),
      policy: configInput[2]["write through/no write allocate"] === "n" ? "write-back" : "write-through",
      alg:
        configInput[3]["replacement policy"] === "fifo"
          ? "FIFO"
          : configInput[3]["replacement policy"] === "random"
          ? "RAND"
          : "LRU",
    };
  }

  return config;
}

function parseConfigInput() {
  return configContents.split("\n\n").map((lines) => {
    return lines
      .split("\n")
      .filter((line) => line.includes(":"))
      .reduce((obj, line) => {
        const parts = line.split(":");
        obj[parts[0].trim().toLowerCase()] = parts[1].trim().toLowerCase();
        return obj;
      }, {});
  });
}

const GLOBAL_CONFIG = getConfig();

export default GLOBAL_CONFIG;
