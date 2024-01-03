import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  Patch,
  Post,
  Query,
  NotFoundException,
  Session,
  UseInterceptors,
} from '@nestjs/common';
//DTO's
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UserDto } from './dtos/user.dto';
//Services
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
//Decorators
import { CurrentUser } from './decorators/current-user.decorator';
//Interceptors
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
//Entities
import { User } from './user.entity';

@Controller('auth')
@Serialize(UserDto) // Show or hide properties
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   // console.log(session);
  //   return this.usersService.findOne(session.userId);
  // }

  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  //Testing cookies routes

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    return session.color;
  }

  //----

  @Get()
  allUsers() {
    return this.usersService.findAll();
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  // @UseInterceptors(new SerializeInterceptor(dto))
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('handler is running');
    const user = await this.usersService.findOne(parseInt(id));

    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    // console.log(this.usersService.create(body.email, body.password));
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    // console.log(this.usersService.create(body.email, body.password));
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
