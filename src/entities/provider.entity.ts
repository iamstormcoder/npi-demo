import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Gender, EnumerationType } from '../enums';
import { Taxonomy } from './taxonomy.entity';
import { Address } from './address.entity';

@Entity()
export class Provider extends BaseEntity {
  @Column({ nullable: true })
  credential: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({ type: 'timestamp with time zone' })
  enumeration_date: Date;

  @Column({ type: 'timestamp with time zone' })
  last_updated: Date;
  
  @Column()
  sole_proprietor: boolean;

  @Column()
  status: string;

  @Column()
  @Index()
  number: number;

  @Column({
    type: 'enum',
    enum: EnumerationType,
  })
  enumerationType: EnumerationType;

  @OneToMany(() => Taxonomy, taxonomy => taxonomy.provider, { cascade: ['insert', 'remove', 'update'] })
  taxonomies: Taxonomy[];

  @OneToMany(() => Address, address => address.provider, { cascade: ['insert', 'remove', 'update'] })
  addresses: Address[];
}