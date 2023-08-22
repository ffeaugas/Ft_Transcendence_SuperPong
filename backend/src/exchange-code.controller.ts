import { Controller, Post, Body, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth/auth.service';
import { Response } from 'express';

@Controller('api')
export class ExchangeCodeController {
  constructor(
    private httpService: HttpService,
    private readonly authService: AuthService,
  ) {}

  @Post('exchange-code')
  async exchangeCode(
    @Body() body: { code: string; redirectUri: string },
    @Res() res: Response,
  ) {
    try {
      const clientId = process.env.OAUTH42_UID as string;
      const clientSecret = process.env.OAUTH42_SECRET as string;
      const tokenEndpoint = 'https://api.intra.42.fr/oauth/token';
      console.log('JE SUIS LE POST DU BACK');
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code: body.code,
          redirect_uri: body.redirectUri,
        }),
      });
      const data = await response.json();
      const accessToken = data.access_token;
      const [access_token, isFirstConnection] =
        await this.authService.handleSuccessful42Auth(accessToken);
      return {
        ...res
          .status(200)
          .json({ access_token, isFirstConnection: isFirstConnection }),
      };
    } catch (error) {
      console.error('Error exchanging code for access token:', error);
      return res
        .status(500)
        .json({ error: 'Error exchanging code for access token' });
    }
  }
}
