import { NpiRecord } from "./npi-record.interface";

export interface NpiResponse {
  result_count: number;

  results: NpiRecord[];
}