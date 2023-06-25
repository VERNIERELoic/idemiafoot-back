import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('message')
export class Message {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    text: string;

    @CreateDateColumn()
    createdAt: Date;
}
