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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
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
}
