import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({})
export class Example {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  readonly title: string;

  @Column()
  readonly content: string;

  @Column()
  readonly isActive: boolean;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  readonly updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  readonly deletedAt: Date | null;
}
