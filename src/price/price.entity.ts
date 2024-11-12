import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('price')
export class Price {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chain: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @CreateDateColumn({ name: 'timestamp' })
    timestamp: Date;
}