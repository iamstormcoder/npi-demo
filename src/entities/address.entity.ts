import { BaseEntity } from "./base.entity";
import { Entity, Column, ManyToOne, Index } from "typeorm";
import { AddressPurpose } from "../enums";
import { Country } from "./country.entity";
import { Provider } from "./provider.entity";

@Entity()
export class Address extends BaseEntity {
  @Column()
  line_1: string;

  @Column({ nullable: true })
  line_2: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: AddressPurpose,
  })
  purpose: AddressPurpose;

  @Column()
  type: string;

  @Column()
  postalCode: string;

  @Column({ nullable: true })
  state: string;

  @ManyToOne(() => Provider, provider => provider.addresses, { onDelete: 'CASCADE' })
  @Index()
  provider: Provider;

  @ManyToOne(() => Country, country => country.addresses, { onDelete: 'CASCADE' })
  @Index()
  country: Country;
}