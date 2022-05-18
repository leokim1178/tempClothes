// import { Strategy } from 'passport-google-oauth20';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import { config } from 'dotenv';

// config();

// @Injectable()
// export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor() {
//     const googleClientID = process.env.GOOGLE_CLIENT_ID;
//     const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
//     super({
//       clientID: googleClientID,
//       clientSecret: googleClientSecret,
//       callbackURL: 'http://localhost:3000/login/google',
//       scope: ['email', 'profile'],
//     });
//   }

//   validate(accessToken: string, refreshToken: string, profile: any) {
//     console.log('1//////', accessToken);
//     console.log('2//////', refreshToken);

//     return {
//       email: profile.emails[0].value,
//       password: '1111',
//       name: profile.displayName,
//       age: '20-29',
//     };
//   }
// }
