import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

//1º solution
// import { setupApp } from '../src/setup-app';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    //1º solution
    // setupApp(app);

    await app.init();
  });

  it('Handles a signup request ', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'asdf@asdf6.com', password: 'asdf' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual('asdf@asdf6.com');
      });
  });

  it('signup as new user then get the currently logged in user', async () => {
    // 1º - Sign up
    const email = 'asdf@adsf.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'asdf' })
      .expect(201);
    // 2º - Get access to the cookie
    const cookie = res.get('Set-Cookie');
    // 3º - Attach cookie to the outgoing request
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie) // Sets cookie header on outgoing request
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
