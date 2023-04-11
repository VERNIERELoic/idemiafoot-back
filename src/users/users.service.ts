import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { FriendRequestEntity } from './friend.request.entity';
import { Friendship } from './friendship.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = new User();
    user.username = createUserDto.username;
    user.firstname = createUserDto.firstname;
    user.lastname = createUserDto.lastname;
    user.email = createUserDto.email;
    user.password = hashedPassword
    user.phone = createUserDto.phone;

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username: username } });
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // Méthode pour envoyer une demande d'ami
  async sendFriendRequest(creator: User, receiver: User): Promise<FriendRequestEntity> {
    const friendRequest = new FriendRequestEntity();
    friendRequest.creator = creator;
    friendRequest.receiver = receiver;
    friendRequest.status = 'pending';
    return await this.friendRequestRepository.save(friendRequest);
  }

  async acceptFriendRequest(friendRequest: FriendRequestEntity): Promise<void> {
    friendRequest.status = 'accepted';
    await this.friendRequestRepository.save(friendRequest);
    await this.addFriend(friendRequest.creator, friendRequest.receiver);
    await this.addFriend(friendRequest.receiver, friendRequest.creator);
  }

  async declineFriendRequest(friendRequest: FriendRequestEntity): Promise<void> {
    friendRequest.status = 'declined';
    await this.friendRequestRepository.save(friendRequest);
  }

  async findFriendRequest(id: number): Promise<FriendRequestEntity> {
    return this.friendRequestRepository.findOne({
      where: { id },
      relations: ['creator', 'receiver']
    });
  }

  async findFriendRequestByCreatorReceiver(creatorUsername: string, receiverUsername: string): Promise<FriendRequestEntity> {
    const [creator, receiver] = await Promise.all([
      this.findByUsername(creatorUsername),
      this.findByUsername(receiverUsername)
    ]);
  
    return this.friendRequestRepository.findOne({
      where: { creator: { id: creator.id }, receiver: { id: receiver.id } },
      relations: ['creator', 'receiver']
    });
  }

  async addFriend(user: User, friend: User): Promise<Friendship> {
    const friendship = new Friendship();
    friendship.user = user;
    friendship.friend = friend;
    return this.friendshipRepository.save(friendship);
  }

  async removeFriend(user: User, friend: User): Promise<void> {
    const friendship = await this.friendshipRepository.findOne({
      where: { user: user, friend: friend },
    });
    if (friendship) {
      await this.friendshipRepository.remove(friendship);
    }
  }

  async getFriends(user: User): Promise<User[]> {
    const friendships = await this.friendshipRepository.find({
      where: { user: user },
      relations: ['friend'],
    });
    return friendships.map((friendship) => friendship.friend);
  }
}

export { User };
