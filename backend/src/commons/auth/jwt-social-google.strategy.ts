// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-google-oauth20';

// @Injectable()
// export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor() {
//     super({
//       clientID:
//         '659437918535-osnnqtvqepv3ccse0koraoc3jrilm0rp.apps.googleusercontent.com',
//       clientSecret: process.env.GOOGLE_OAUTH_KEY,
//       callbackURL: 'http://localhost:3000/login/google',
//       scope: ['email', 'profile'],
//     });
//   }

//   validate(accessToken: string, refreshToken: string, profile: any) {
//     console.log('1', accessToken);
//     console.log('2', refreshToken);
//     console.log('3', profile);
//     return {
//       email: profile.emails[0].value,
//       password: '1111',
//       name: profile.displayName,
//       birth: '1994-04-15',
//       rentId: 'ba5b74a2-2ade-4896-b6e3-0ebdb9efd485', // 구글에서 주는 기본 값에는 포함이 되어 있지 않다. 그래서 user값으로 넘겨주기 위해 값이 있어야 한다 why? 다 대 원 관계로 묶여있기 때문이다.
//     }; // ba5b74a2-2ade-4896-b6e3-0ebdb9efd485
//   }
// }
