import mainRequestInput from "../../../requestList_USE_THIS.dat?raw";
import shortRequestInput from "../../../requestList_short.dat?raw";
import mediumRequestInput from "../../../requestList_medium.dat?raw";
import longRequestInput from "../../../requestList_superLong.dat?raw";

import { Address } from "../Address";

import type { Request } from "./Request";

export type RequestList = Request[];

export function getMainRequestList() {
  return parseRequests(mainRequestInput);
}

export function getShortRequestList() {
  return parseRequests(shortRequestInput);
}

export function getMediumRequestList() {
  return parseRequests(mediumRequestInput);
}

export function getLongRequestList() {
  return parseRequests(longRequestInput);
}

function parseRequests(requestsStr: string): [RequestList, number] {
  const requestList = requestsStr.trim().split("\n");
  let longestRequest = 0;

  const requests = requestList.map((requestStr) => {
    const [modeStr, addressStr] = requestStr.split(":");

    if (addressStr.length > longestRequest) {
      longestRequest = addressStr.length;
    }

    const request: Request = { mode: modeStr === "R" ? "R" : "W", address: new Address(parseInt(addressStr, 16)) };
    return request;
  });

  return [requests, longestRequest];
}
