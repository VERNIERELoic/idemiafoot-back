import { Events } from 'src/events/events.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, ManyToMany, JoinTable, AfterLoad, BeforeUpdate, BeforeInsert } from 'typeorm';
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

    @Column()
    userId: number;

    @Column()
    eventId: number;

    @Column({ nullable: true })
    username: string;

    @Column({ default: false })
    confirmed: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    updateUsername() {
        if (this.user && this.user.username) {
            this.username = this.user.username;
        }
    }

}