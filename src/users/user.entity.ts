
import { Teams } from 'src/teams/teams.entity';
import { userEvent } from 'src/user-event/user-event.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => userEvent, (userEvent) => userEvent.user)
  userEvents: userEvent[];

  @ManyToMany(() => Teams, (team) => team.users)
  @JoinTable()
  teams: Teams[];
}
