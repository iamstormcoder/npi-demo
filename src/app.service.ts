import { Injectable, HttpService } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindConditions, Raw } from 'typeorm';
import * as moment from 'moment';

import countries from './countries';

import { Country, Provider, Address, Taxonomy } from './entities';
import { EnumerationType, Gender, AddressPurpose } from './enums';
import { GetProviders, NpiResponse, PaginatedResponse, ProviderResponse } from './interfaces';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Provider) private providerRepository: Repository<Provider>,
    @InjectRepository(Country) private countryRepository: Repository<Country>,
    private httpService: HttpService
  ) {}

  @Cron('*/10 * * * *', {
    name: 'import'
  })
  async importData(): Promise<{ success: boolean }> {
    try {
      await Promise.all(countries.map(async countryData => {
        let country = await this.countryRepository.findOne({
          code: countryData.code
        });

        if (!country) {
          country = new Country();

          country.code = countryData.code;
          country.name = countryData.name;

          await this.countryRepository.save(country);
        }

        let firstLetter = 'a', skip = 0;
        const limit = 200;

        while(firstLetter !== String.fromCharCode('z'.charCodeAt(0) + 1)) {
          let secondLetter = 'a';

          while(secondLetter !== String.fromCharCode('z'.charCodeAt(0) + 1)) {
            const [ npi1, npi2 ] = await Promise.all([
              this.httpService.get<NpiResponse>('https://npiregistry.cms.hhs.gov/api', {
                params: {
                  version: '2.1',
                  country_code: country.code,
                  first_name: `${firstLetter}${secondLetter}*`,
                  enumeration_type: 'NPI-1',
                  limit,
                  skip
                }
              }).toPromise(),
              this.httpService.get<NpiResponse>('https://npiregistry.cms.hhs.gov/api', {
                params: {
                  version: '2.1',
                  country_code: country.code,
                  organization_name: `${firstLetter}${secondLetter}*`,
                  enumeration_type: 'NPI-2',
                  limit,
                  skip
                }
              }).toPromise(),
            ]);

            const providers = [
              ...npi1.data.results,
              ...npi2.data.results
            ];

            await Promise.all(providers.map(async providerData => {
              let provider = await this.providerRepository.findOne({
                number: providerData.number,
                enumerationType: providerData.enumeration_type === 'NPI-1' ? EnumerationType.NPI1 : EnumerationType.NPI2
              });

              if (provider) {
                return;
              }

              provider = new Provider();

              provider.credential = providerData.basic.credential;
              provider.first_name = providerData.basic.first_name;
              provider.last_name = providerData.basic.last_name;
              provider.name = providerData.basic.name;
              provider.gender = providerData.basic.gender === 'M' ? Gender.male : Gender.female;
              provider.enumeration_date = moment(providerData.basic.enumeration_date).toDate();
              provider.last_updated = moment(providerData.basic.last_updated).toDate();
              provider.sole_proprietor = providerData.basic.sole_proprietor !== 'NO';
              provider.status = providerData.basic.status;
              provider.number = providerData.number;
              provider.enumerationType = providerData.enumeration_type === 'NPI-1' ? EnumerationType.NPI1 : EnumerationType.NPI2;
              provider.addresses = [];
              provider.taxonomies = [];

              providerData.addresses.forEach(addressData => {
                const address = new Address();

                address.line_1 = addressData.address_1;
                address.line_2 = addressData.address_2;
                address.phone = addressData.telephone_number;
                address.purpose = AddressPurpose[addressData.address_purpose];
                address.type = addressData.address_type;
                address.postalCode = addressData.postal_code;
                address.state = addressData.state;
                address.country = country;

                provider.addresses.push(address);
              })

              providerData.taxonomies.forEach(taxonomyData => {
                const taxonomy = new Taxonomy();

                taxonomy.code = taxonomyData.code;
                taxonomy.desc = taxonomyData.desc;
                taxonomy.license = taxonomyData.license;
                taxonomy.primary = taxonomyData.primary;
                taxonomy.state = taxonomyData.state;

                provider.taxonomies.push(taxonomy);
              })

              return this.providerRepository.save(provider);
            }))

            secondLetter = String.fromCharCode(secondLetter.charCodeAt(0) + 1);
          }

          firstLetter = String.fromCharCode(firstLetter.charCodeAt(0) + 1);
        }
      }));

      console.log('FINISHED');

      return { success: true };
    } catch(e) {
      console.log(e);

      return { success: false };
    }
  }

  async getProviders(query: GetProviders): Promise<PaginatedResponse<ProviderResponse>> {
    const where: FindConditions<Provider> = {};

    if (query.enumeration_type) {
      where.enumerationType = query.enumeration_type === 'NPI-1' ?
        EnumerationType.NPI1 :
        EnumerationType.NPI2;
    }

    if (query.name) {
      where.name = Raw(alias => `${alias} ILIKE '%${query.name}%'`);
    }

    if (query.number) {
      where.number = parseInt(query.number);
    }

    const [providers, total] = await this.providerRepository
      .findAndCount({
        where,
        take: parseInt(query.limit),
        skip: parseInt(query.offset)
      });

    return {
      items: providers.map(provider => new ProviderResponse(provider)),
      total,
      hasMore: total - (parseInt(query.offset) + parseInt(query.limit)) > 0
    }
  }
}
