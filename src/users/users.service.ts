import { BadRequestException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'typeorm/platform/PlatformTools';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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

  async update(userId: number, createUserDto: CreateUserDto): Promise<User> {

    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    let hashedPassword;
    if (!createUserDto.password) {
      hashedPassword = user.password;
    } else {
      const salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    }

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

  async addAdmin(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: id });
    user.isAdmin = true;
    return this.usersRepository.save(user);
  }

  async removeAdmin(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: id });
    user.isAdmin = false;
    return this.usersRepository.save(user);
  }

  // async upload(img: string, userId: number): Promise<User> {
  //   const user = await this.usersRepository.findOneBy({ id: userId });
  //   const imgBuffer = Buffer.from(img.split(',')[1], 'base64');

  //   const maxSize = 2 * 1024 * 1022;
  //   if (imgBuffer.length > maxSize) {
  //     throw new BadRequestException('File is too large.');
  //   }

  //   const fileName = `${user.username}.jpg`;

  //   // Note: Replace 'avatarbucket' with the name of your MinIO bucket
  //   const fileUrl = await this.uploadToMinio('avatarbucket', fileName, imgBuffer);

  //   user.avatar = fileUrl;
  //   return this.usersRepository.save(user);
  // }


}

export { User };
