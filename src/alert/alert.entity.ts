import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('alert')
export class Alert {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chain: string;

    @Column({ name: 'target_price', type: 'decimal', precision: 10, scale: 2 })
    targetPrice: number;

    @Column()
    email: string;

    @Column({ default: false })
    triggered: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}