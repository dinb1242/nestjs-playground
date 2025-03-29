import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';

export class CipherUtils {
  /**
   * AES256 CTR 알고리즘을 활용한 데이터 암호화 메소드
   * @param text 암호화 할 텍스트
   */
  static async encryptWithAES256CTR(text: string) {
    const iv = Buffer.from(process.env.CIPHER_IV as string, 'utf-8');
    const password = process.env.CIPHER_SECRET as string;

    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv, {});

    let encVal = cipher.update(text, 'utf-8', 'base64');
    encVal += cipher.final('base64');

    return encVal;
  }

  /**
   * AES256 CTR 로 암호화된 평문을 복호화하는 메소드
   * @param encrypted 암호화 평문
   */
  static async decryptWithAES256CTR(encrypted: string) {
    const iv = Buffer.from(process.env.CIPHER_IV as string, 'utf-8');
    const password = process.env.CIPHER_SECRET as string;

    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);

    let decVal = decipher.update(encrypted, 'base64', 'utf-8');
    decVal += decipher.final('utf-8');

    return decVal;
  }
}
