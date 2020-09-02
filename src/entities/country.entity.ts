import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Address } from "./address.entity";

@Entity()
export class Country extends BaseEntity {
  @Column()
  code: string;

  @Column()
  name: string;
  
  @OneToMany(() => Address, address => address.country, { cascade: ['insert', 'remove', 'update'] })
  addresses: Address[];
}