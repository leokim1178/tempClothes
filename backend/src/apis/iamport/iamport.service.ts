import {
  Injectable,
  HttpException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';

import axios from 'axios';

@Injectable()
export class IamportService {
  async getToken() {
    try {
      const result = await axios.post('https://api.iamport.kr/users/getToken', {
        imp_key: process.env.IMP_KEY,
        imp_secret: process.env.IMP_SECRET,
      });
      return result.data.response.access_token;
    } catch (error) {
      throw new HttpException(
        // 아임포트에서 준 에러메시지 반환
        error.response.data.message,
        error.response.status,
      );
    }
  }

  async checkpaid({ imp_uid, amount, token }) {
    try {
      const result = await axios.get(
        `https://api.iamport.kr/payments/${imp_uid}`,
        {
          headers: { Authorization: token },
        },
      );
      if (result.data.response.status !== 'paid')
        // 아임포트를 이용해 결제를 하고, 웹에서 확인 하는 과정
        throw new ConflictException('결제내역이 존재하지 않습니다.');

      if (result.data.response.amount !== amount)
        throw new UnprocessableEntityException('결제 금액이 다릅니다.');

    } catch (error) {
      if (error?.response?.data?.message) {
        throw new HttpException( // 플레이 그라운드는 정상,,, 프론트한테 에러 반환!
          error.response.data.message,
          error.response.status,
        );
      } else {
        throw error; // 아임포트에서 에러메시지를 주지 않았을떄
      }
    }
  }

  async cancel({ imp_uid, token }) {
    try {
      const result = await axios.post(
        'https://api.iamport.kr/payments/cancel',
        { imp_uid: imp_uid },
        { headers: { Authorization: token } },
      );
      console.log(result,'AAA')
      return result.data.response.cancel_amount;
    } catch (error) {
      throw new HttpException(
        error.response.data.message, // 아임포트에서 준 에러메시지를 반환
        error.response.status,
      );
    }
  }
}
