import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('email_notifications')
export class EmailNotification {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  fromEmail: string;

  //@Index()
  @Column({ type: 'varchar', length: 255 })
  toEmail: string;

  @Column({ type: 'simple-json', nullable: true })
  ccList?: string[];

  @Column({ type: 'simple-json', nullable: true })
  bccList?: string[];

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
