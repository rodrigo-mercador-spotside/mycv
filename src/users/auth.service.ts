import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util'; // Takes callback function and turns them into promisses

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  @Post()
  async signup(email: string, password: string) {
    //See if email already exists
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('This Email is already in use');
    }
    //Hash users password
    /// Generate Salt
    const salt = randomBytes(8).toString('hex'); // 8*2 = 16 characters
    /// Hash the salt and pass togheter
    const hash = (await scrypt(password, salt, 32)) as Buffer; // 32 characters, Buffer is for TS
    // Join the hashed result and the salt togheter
    const result = salt + '.' + hash.toString('hex');
    //Create and save the new user
    const user = await this.usersService.create(email, result);
    //Return user
    return user;
  }
  // email, password

  @Post()
  async signin(email: string, password: string) {
    // Find the user inside DB
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Look for the password and split of the salt
    const [salt, storedHash] = user.password.split('.');

    // Take the Salt and join it to the user password
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    return user;

    // Hash the result

    // Compare the hash agains the db hash stored
  }
  //cookie(id), email, password
}
