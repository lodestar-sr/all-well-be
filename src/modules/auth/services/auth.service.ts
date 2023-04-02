import { compare, genSalt, hash } from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessagingService } from 'src/modules/users/services/messaging.service';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { IVerifiedUser } from '../auth.types';
import { TokensService } from '../../tokens/tokens.service';
import { Token } from '../../tokens/entities/token.entity';
import {
  RESET_PASSWORD_URL,
  TokenType,
} from '../../../shared/constants/global.constants';
import { UserPayload } from '../../users/users.types';
import {
  INVALID_TOKEN,
  USER_NOT_EXIST,
} from '../../../shared/constants/message.constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokensService: TokensService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && user.password && (await compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: IVerifiedUser) {
    console.log('user =>>>>>>>>>>', user);
    return { access_token: this.jwtService.sign(user), isValid: true };
  }

  async register(user: User) {
    const salt = await genSalt(parseInt(process.env.SALT_ROUNDS));
    user.password = await hash(user.password, salt);
    const res = await this.usersService.create(user);

    const payload = { email: res.email, sub: res.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException("The user doesn't exist");
    }

    const payload = {
      email: user.email,
      id: user.id,
    };

    const savedToken: Token = await this.tokensService.create({
      token: this.jwtService.sign(payload),
      type: TokenType.RESET_PASSWORD,
    });

    const url = `${RESET_PASSWORD_URL}/${savedToken.token}`;

    const mailService = new MessagingService();

    await mailService.sendMail({
      to: user.email,
      subject: 'Forgot Password',
      body: `
        <p>
          Hello, ${user.lastname}
          <br/>
          Please change your password by clicking <a href="${url}">here</a>.
        </p>`,
      link: {
        link: url,
        label: 'Reset your password',
      },
    });
  }

  async changePassword(password: string, token: string) {
    try {
      const existingToken: Token = await this.tokensService.findByToken(
        token,
        false,
      );

      if (!existingToken) {
        throw new BadRequestException(INVALID_TOKEN);
      } else {
        const { email, id }: UserPayload = this.jwtService.decode(
          token,
        ) as UserPayload;
        const user = await this.usersService.findOne({ email, id });

        if (user) {
          const salt = await genSalt(parseInt(process.env.SALT_ROUNDS));
          user.password = await hash(password, salt);
          await this.usersService.changePassword(id, user.password);
          await this.tokensService.update(existingToken.id, { used: false });
          return user;
        } else {
          throw new BadRequestException(USER_NOT_EXIST);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async validateEmailVerifyToken(token: string): Promise<User | undefined> {
    try {
      const existingToken: Token = await this.tokensService.findByToken(
        token,
        false,
      );

      if (existingToken) {
        const { email, id }: UserPayload = this.jwtService.decode(
          token,
        ) as UserPayload;

        return await this.usersService.findOne({ email, id });
      }
    } catch (error) {
      throw error;
    }
  }

  async createPassword(
    token: string,
    password: string,
  ): Promise<User | undefined> {
    try {
      const existingToken: Token = await this.tokensService.findByToken(
        token,
        false,
      );

      if (existingToken) {
        const { email, id }: UserPayload = this.jwtService.decode(
          token,
        ) as UserPayload;

        const user = await this.usersService.findOne({ email, id });

        if (user) {
          const userPayload = { id, email, sub: '' };
          const salt = await genSalt(parseInt(process.env.SALT_ROUNDS));
          user.password = await hash(password, salt);
          await this.usersService.update(
            id,
            { password: user.password },
            userPayload,
          );
          await this.tokensService.update(existingToken.id, { used: true });
        }

        return user;
      }
    } catch (error) {
      throw error;
    }
  }
}
