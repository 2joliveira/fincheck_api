import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UsersRepository } from 'src/shared/repositories/users.repository';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate({ email, password }: AuthDto) {
    const user = await this.usersRepository.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const accessToken = await this.jwtService.signAsync({ sub: user.id });

    return { accessToken };
  }
}
