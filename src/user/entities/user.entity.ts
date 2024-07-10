import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserInt } from '../interface/user.interface';

@Entity()
export class User implements UserInt {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ default: "" })
  password: string;

  @Column()
  description: string;

  @Column()
  avatarUrl: string;

  @Column({ default: 0 })
  subscriptionAmount: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isActive: boolean;

  @Column("text", { array: true })
  stack: string[];

  @Column()
  city: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
