import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DeliveryStatus } from '../enums/DeliveryStatus.enum';

@Entity('sms_notifications')
export class SmsNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  fromPhoneNumber: string;

  @Column({ type: 'varchar', length: 30 })
  toPhoneNumber: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'text', nullable: true })
  lastError: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date | null;
}
