import GLOBAL_CONFIG from "./Config/config";
import { getDataCache, type DataCache } from "./DataCache/DataCacheFactory";
import { GLOBAL_LOGGER } from "./Logger";
import { getPageTable, type PageTable } from "./PageTable/PageTableFactory";
import { getMainRequestList } from "./Request/RequestList";

class CLI_App {
  public run() {
    console.clear();
    GLOBAL_LOGGER.clear();
    console.log("Hello, this is the CLI!!!");

    const [requests, mostHexCharsNeeded] = getMainRequestList();
    GLOBAL_CONFIG.request.mostHexCharsNeeded = mostHexCharsNeeded;

    const pageTable: PageTable = getPageTable(GLOBAL_LOGGER);
    const dataCache: DataCache = getDataCache(GLOBAL_LOGGER);

    GLOBAL_CONFIG.print();

    for (let request of requests) {
      GLOBAL_LOGGER.logAddress(request.address);

      pageTable.query(request.address);
      dataCache.query(request.address);
    }

    GLOBAL_LOGGER.print();
  }
}

export const cli_app: CLI_App = new CLI_App();
