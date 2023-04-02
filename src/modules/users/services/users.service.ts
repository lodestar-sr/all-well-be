import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { genSalt, hash } from "bcrypt";
import { Repository } from "typeorm";

import { MessagingService } from "./messaging.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";
import { EMAIL_VERIFY_URL, RESET_PASSWORD_URL } from "../users.constants";
import { IPayload } from "../../auth/auth.types";
import { Token } from "../../tokens/entities/token.entity";
import { TokensService } from "../../tokens/tokens.service";
import { TokenType } from "../../../shared/constants/global.constants";
import * as process from "process";

@Injectable()
export class UsersService {
  constructor(
    private tokensService: TokensService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    if (user.password) {
      const salt = await genSalt(parseInt(process.env.SALT_ROUNDS));
      user.password = await hash(user.password, salt);
    }

    return await this.usersRepository.save(user);
  }

  findOne(user: Partial<User>): Promise<User> {
    return this.usersRepository.findOne({
      where: { ...user },
    });
  }

  async findOneById(id: number) {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email: email },
    });
  }

  update(id: number, updateUser: UpdateUserDto, user: IPayload) {
    if (user.id === id) {
      return this.usersRepository.update(id, updateUser);
    } else {
      throw new ForbiddenException();
    }
  }

  changePassword(id: number, password: string) {
    return this.usersRepository.update(id, { password });
  }

  async requestChangePassword(email: string) {
    const existingUser: User = await this.usersRepository.findOne({ email });

    const payload = {
      email: existingUser.email,
      id: existingUser.id,
    };

    const savedToken: Token = await this.tokensService.create({
      token: this.jwtService.sign(payload),
      type: TokenType.CHANGE_PASSWORD,
    });

    const mailService = new MessagingService();
    const url = `${RESET_PASSWORD_URL}/${savedToken.token}`;

    await mailService.sendMail({
      to: existingUser.email,
      subject: 'Change Password',
      body: `
        <p>
          Hello, ${existingUser.lastname}
          <br/><br/>
          Your request to change password is accepted.<br/>
          Please click <a href="${url}">here</a> to change password.
        </p>`,
      link: {
        link: url,
        label: 'Reset your password',
      },
    });
  }
}
