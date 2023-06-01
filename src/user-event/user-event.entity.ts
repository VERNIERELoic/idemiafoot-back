import { Events } from 'src/events/events.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity('user-events')
export class userEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @ManyToOne(() => User, (user) => user.userEvents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Events, (event) => event.userEvents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'eventId' })
    event: Events;
    static user: User;

    @Column({ default: false })
    confirmed: boolean;
}
