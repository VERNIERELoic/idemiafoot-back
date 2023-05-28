import { User } from 'src/users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Events {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  sport: string;

  @ManyToMany(() => User, (user) => user.events)
  @JoinTable()
  user: User[];
}

