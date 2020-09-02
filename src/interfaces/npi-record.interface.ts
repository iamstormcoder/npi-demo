import { AddressInfo } from "./address-info.interface";
import { BasicInfo } from "./basic-info.interface";
import { TaxonomyInfo } from "./taxonomy-info.interface";

export interface NpiRecord {
  addresses: AddressInfo[];

  taxonomies: TaxonomyInfo[];

  basic: BasicInfo;

  created_epoch: number;
  
  enumeration_type: string;

  last_updated_epoch: number;
  
  number: number;
}