import { Events } from 'src/events/events.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, ManyToMany, JoinTable, AfterLoad, BeforeUpdate, BeforeInsert, OneToMany } from 'typeorm';
@Entity('teams')
export class Teams {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Events, (events) => events.teams)
    events: Events

    @ManyToOne(() => User, (user) => user.userEvents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Events, (event) => event.teams, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'eventId' })
    event: Events;

    @Column()
    userId: number;

    @Column()
    eventId: number;

}