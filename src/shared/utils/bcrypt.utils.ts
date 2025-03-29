import * as bcrypt from 'bcrypt';

export class BcryptUtils {
  /**
   * Bcrypt 평문 암호화
   * @param text
   */
  static async encrypt(text: string) {
    const saltOrRounds = await bcrypt.genSalt();
    const hash = await bcrypt.hash(text, saltOrRounds);

    return hash;
  }

  /**
   * Bcrypt 평문 비교
   * @param text
   * @param hash
   */
  static async match(text: string, hash: string) {
    const isMatch = await bcrypt.compare(text, hash);
    console.log(isMatch);
  }
}
