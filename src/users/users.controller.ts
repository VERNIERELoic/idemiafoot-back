import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
  UseGuards,
  Req,
  Put,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { request, STATUS_CODES } from 'http';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FriendRequest } from 'src/models/friend-request.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { FriendRequestEntity } from './friend.request.entity';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Post('findByUsername')
  @UseGuards(JwtAuthGuard)
  async findByUsername(@Body() body: { username: string }) {
    const user = await this.usersService.findByUsername(body.username);
    if (user) {
      return user;
    } else {
      return { message: 'User not found' };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  async current(@Req() request) {
    const { username } = request.user;
    const user = await this.usersService.findByUsername(username);
    return user;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string): Promise<any> {
  return this.usersService.remove(id);
  }

  @Post(':creatorUsername/friend-requests/:receiverUsername')
  @UseGuards(JwtAuthGuard)
  async sendFriendRequest(
    @Param('creatorUsername') creatorUsername: string,
    @Param('receiverUsername') receiverUsername: string
  ): Promise<FriendRequestEntity> {
    const creator = await this.usersService.findByUsername(creatorUsername);
    const receiver = await this.usersService.findByUsername(receiverUsername);
    if (!receiver) {
      throw new NotFoundException(`User with Username ${receiverUsername} not found`);
    }
    if (creator.username === receiver.username) {
      throw new ConflictException('Cannot send friend request to yourself');
    }
    
    const existingFriendRequest = await this.usersService.findFriendRequestByCreatorReceiver(creatorUsername, receiverUsername);
    if (existingFriendRequest) {
      throw new ConflictException('Friend request already sent');
    }
    
    return this.usersService.sendFriendRequest(creator, receiver);
  }


  @Put(':friendRequestId/accept-friend-request')
  @UseGuards(JwtAuthGuard)
  async acceptFriendRequest(@Param('friendRequestId') friendRequestId: string): Promise<void> {
    const friendRequest = await this.usersService.findFriendRequest(+friendRequestId);
    if (!friendRequest) {
      throw new NotFoundException(`Friend request with ID ${friendRequestId} not found`);
    }
    try {
      await this.usersService.acceptFriendRequest(friendRequest);
    } catch (error) {
      throw new Error('Unable to accept friend request');
    }
  }

  @Put(':friendRequestId/decline-friend-request')
  async declineFriendRequest(@Param('friendRequestId') friendRequestId: string): Promise<void> {
    const friendRequest = await this.usersService.findFriendRequest(+friendRequestId);
    return this.usersService.declineFriendRequest(friendRequest);
  }

  @Delete(':userId/remove-friend/:friendId')
  @UseGuards(JwtAuthGuard)
  async removeFriend(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('friendId', ParseIntPipe) friendId: number,
  ): Promise<void> {
    const user = await this.usersService.findOne(userId);
    const friend = await this.usersService.findOne(friendId);
    return this.usersService.removeFriend(user, friend);
  }

  @Get(':userId/friends')
  @UseGuards(JwtAuthGuard)
  async getFriends(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<User[]> {
    const user = await this.usersService.findOne(userId);
    return this.usersService.getFriends(user);
  }
}
