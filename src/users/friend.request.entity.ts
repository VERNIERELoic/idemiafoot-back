import { FriendRequest_status } from 'src/models/friend-request.interface';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';


@Entity('requests')
export class FriendRequestEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (User) => User.sentFriendRequests)
  creator: User

  @ManyToOne(() => User, (User) => User.receivedFriendRequests)
  receiver: User

  @Column()
  status: FriendRequest_status;

}
