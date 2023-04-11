import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FriendRequestEntity } from './friend.request.entity';
import { Friendship } from './friendship.entity';

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

  @OneToMany(() => FriendRequestEntity,(FriendRequestEntity) => FriendRequestEntity.creator)
  sentFriendRequests: FriendRequestEntity[];

  @OneToMany(() => FriendRequestEntity,(FriendRequestEntity) => FriendRequestEntity.receiver)
  receivedFriendRequests: FriendRequestEntity[];

  @OneToMany(() => Friendship, (friendship) => friendship.user)
  friends: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.friend)
  friendOf: Friendship[];
}
