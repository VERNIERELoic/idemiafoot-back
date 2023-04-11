export class CreateUserDto {
  id(id: any): Promise<import("../user.entity").User> {
    throw new Error('Method not implemented.');
  }
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
}
