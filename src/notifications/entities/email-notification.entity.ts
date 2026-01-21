import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DeliveryStatus } from '../enums/DeliveryStatus.enum';

@Entity('email_notifications')
export class EmailNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  fromEmail: string;

  @Column({ type: 'varchar', length: 255 })
  toEmail: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  // name of template
  @Column({ type: 'varchar', length: 100 })
  template: string;

  // data of template
  @Column({ type: 'json' })
  templateData: Record<string, any>;

  @Column({ type: 'longtext', nullable: true })
  renderedHtml: string | null;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  // number of time sent the email
  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'text', nullable: true })
  lastError: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date | null;
}
