// src/notifications/entities/sms-notification.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
@Entity('sms_notifications')
export class SmsNotification {

  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 30 })
  fromPhoneNumber: string;

  //@Index()
  @Column({ type: 'varchar', length: 30 })
  toPhoneNumber: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
