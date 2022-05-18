import { Injectable } from '@nestjs/common';
import axios from 'axios'

@Injectable()
export class IamportService {
  async getToken() {
      try {
          const result = await axios.post('https://api.iamport.kr/users/getToken', {
              imp_key: process.env.IMP_KEY,
              imp_secret: process.env.IMP_SECRET,
          })
          
      }
  }

}
