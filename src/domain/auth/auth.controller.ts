import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './auth.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiBody({ description: 'Body login', type: SignInDto })
  @ApiResponse({
    status: 200,
    example: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTczMjQwNTI3OX0.bk2dm1Ccq0dYnRJZAIgp3O8DKJfZJaoZipsQcVzqxYg'}
  })
  @Post('login')
  async signIn(@Body() body: SignInDto): Promise<{ token: string }> {
    return this.authService.generateToken(body.phone);
  }
}
