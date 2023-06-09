import { Teams } from 'src/teams/teams.entity';
import { userEvent } from 'src/user-event/user-event.entity';
import { Column, Entity, JoinColumn, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Events {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  sport: string;

  @OneToMany(() => userEvent, (userEvent) => userEvent.event)
  userEvents: userEvent[];

  @OneToMany(() => Teams, (teams) => teams.event)
  teams: Teams[];
}

