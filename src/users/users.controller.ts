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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UserIsSelfGuard } from 'src/auth/guards/user-is-self-guard';
import { AdminGuard } from 'src/auth/guards/admin-guard';

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

  @Post('findByUsername')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findByUsername(@Body() body: { username: string }) {
    const user = await this.usersService.findByUsername(body.username);
    if (user) {
      return user;
    } else {
      return { message: 'User not found' };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
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
  @UseGuards(JwtAuthGuard, AdminGuard)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async remove(@Param('id') id: string): Promise<any> {
    return this.usersService.remove(id);
  }


  @Post('addAdmin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async addAdmin(@Body('userId') userId: number): Promise<User> {
    return this.usersService.addAdmin(userId);
  }

  @Post('removeAdmin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getUsersByTeam(@Body('userId') userId: number): Promise<User> {
    return this.usersService.removeAdmin(userId);
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('image'))
  // async uploadSingle(
  //   @UploadedFile() image: BufferedFile
  // ) {
  //   this.minioClientService.upload(image);
  //   console.log(image)
  // }

  // ## Using S3 storage from now
  // @Post('upload')
  // async uploadFile(@Body('avatar') img: string, @Body('userId') userId: number) {
  //   return this.usersService.upload(img, userId);
  // }
}
