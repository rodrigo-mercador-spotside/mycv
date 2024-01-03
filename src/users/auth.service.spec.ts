import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

//Apicla uma descrição mais especifica
describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  // Vai ser corrido antes de cada teste
  beforeEach(async () => {
    //Create a fake copy of users service
    const users: User[] = [];
    fakeUsersService = {
      //   find: () => Promise.resolve([]),
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      //   create: (email: string, password: string) =>
      //     Promise.resolve({ id: 1, email, password } as User),

      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;

        users.push(user);

        return Promise.resolve(user);
      },
    };

    //temporary testing DI Container
    const module = await Test.createTestingModule({
      //list of all the different classes we want  to inject on the DI container
      providers: [
        AuthService,
        {
          provide: UsersService, // If someone asks for this <-
          useValue: fakeUsersService, // GIve them this <---------
        },
      ],
    }).compile();

    //Tells the DI container to create an instance of AuthService
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    //make suer service is defined
    expect(service).toBeDefined();
  });

  it('creates a new User with salted and hashed password', async () => {
    const user = await service.signup('email@something.com', 'asdf');

    // Garantees the pass was salted and hashed ---
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
    // ----
  });

  //   it('throws an error if user signs up with email that is in use', async () => {
  //     // redefine the find function
  //     fakeUsersService.find = () =>
  //       Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
  //     await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
  //       BadRequestException,
  //     );
  //   });

  //   it('throws if signin is called with an unused email', async () => {
  //     await expect(
  //       service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
  //     ).rejects.toThrow(NotFoundException);
  //   });

  //   it('throws if an invalid password is provided', async () => {
  //     fakeUsersService.find = () =>
  //       Promise.resolve([
  //         { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
  //       ]);
  //     await expect(
  //       service.signin('laskdjf@alskdfj.com', 'passowrd'),
  //     ).rejects.toThrow(BadRequestException);
  //   });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       email: 'asdf@asdf.com',
    //       password:
    //         '9b3e22d2b09c80db.820b8883ad1878988de07b170fa1edda17e2ed5cbe328b308d00fd0261bb9c81',
    //     } as User,
    //   ]);

    await service.signup('asdf@asdf.com', 'mypassword');

    const user = await service.signin('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();

    // get salted and hashed password --- bad way
    // const user = await service.signup('asdf@asdf.com', 'mypassword');
    // console.log(user);
  });
});
