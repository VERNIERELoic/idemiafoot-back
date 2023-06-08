import { Events } from 'src/events/events.entity';
import { userEvent } from 'src/user-event/user-event.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, ManyToMany, JoinTable, AfterLoad, BeforeUpdate, BeforeInsert, OneToMany } from 'typeorm';
@Entity('teams')
export class Teams {
    @PrimaryGeneratedColumn()
    id: number;
}