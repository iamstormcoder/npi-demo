import { PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { nanoid } from 'nanoid';

export abstract class BaseEntity {
  constructor(id?: string) {
    this.id = id ?? nanoid();
  }

  @PrimaryColumn()
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}