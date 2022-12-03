import type { Address } from "../Address";

export type Request = {
  mode: "R" | "W";
  address: Address;
};
