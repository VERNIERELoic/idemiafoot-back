import { User } from 'src/users/user.entity';
import { Entity, PrimaryColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity('message')
export class Message {
    @PrimaryColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.message, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    text: string;

    @CreateDateColumn()
    createdAt: Date;
}
