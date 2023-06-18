import { Events } from 'src/events/events.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, ManyToMany, JoinTable, AfterLoad, BeforeUpdate, BeforeInsert, OneToMany } from 'typeorm';
@Entity('teams')
export class Teams {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User, (user) => user.teams)
    users: User[];

    @ManyToOne(() => Events, (event) => event.teams, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'eventId' })
    event: Events;
}
