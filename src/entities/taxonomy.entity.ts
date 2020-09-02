import { Entity, Column, ManyToOne, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Provider } from "./provider.entity";

@Entity()
export class Taxonomy extends BaseEntity {
  @Column()
  code: string;

  @Column()
  desc: string;

  @Column({ nullable: true })
  license: string;

  @Column()
  primary: boolean;

  @Column()
  state: string;
  
  @ManyToOne(() => Provider, provider => provider.taxonomies, { onDelete: 'CASCADE' })
  @Index()
  provider: Provider;
}