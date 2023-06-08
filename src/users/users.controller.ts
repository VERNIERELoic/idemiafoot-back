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
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UserIsSelfGuard } from 'src/auth/guards/user-is-self-guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard, UserIsSelfGuard)
  async update(
    @Param('id') id: number,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, createUserDto);
  }

  // WARNING ! ----- DEBUG ONLY -----
  
  // @Post('findByUsername')
  // @UseGuards(JwtAuthGuard)
  // async findByUsername(@Body() body: { username: string }) {
  //   const user = await this.usersService.findByUsername(body.username);
  //   if (user) {
  //     return user;
  //   } else {
  //     return { message: 'User not found' };
  //   }
  // }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // findAll(): Promise<User[]> {
  //   return this.usersService.findAll();
  // }

  // WARNING ! ----- DEBUG ONLY -----

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
  @UseGuards(JwtAuthGuard, UserIsSelfGuard)
  async remove(@Param('id') id: string): Promise<any> {
    return this.usersService.remove(id);
  }

}
