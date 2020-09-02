import { Provider } from "../entities";
import { EnumerationType, Gender } from "../enums";

export class ProviderResponse {
  constructor(provider: Provider) {
    const { enumerationType, gender, ...otherProps } = provider;

    Object.assign(this, otherProps);

    this.enumerationType = enumerationType === EnumerationType.NPI1 ? 'NPI-1' : 'NPI-2';

    this.gender = Gender[gender];
  }

  credential: string;

  first_name: string;

  last_name: string;

  name: string;

  gender: string;

  enumeration_date: Date;

  last_updated: Date;
  
  sole_proprietor: boolean;

  status: string;

  number: number;

  enumerationType: string;
}