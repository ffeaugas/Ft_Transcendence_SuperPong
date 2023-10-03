import { $Enums, Prisma, Role } from '@prisma/client';

export class Users implements Prisma.UserCreateInput {
  hash: string;
  otp_secret?: string;
  otp_url?: string;
  user42?: boolean;
  channelId?: number;
  otpEnabled?: boolean;
  otpValidated?: boolean;
  id: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  lastConnexionPing?: number;
  role?: Role;
  login: string;
  username: string;
  friends?: any;
  tokenTmp?: string;
  friendsAddedMe?: any;
  friendReqReceived?: any;
  blockedByUsers?: any;
  blockedUsers?: any;
  gameReqReceived?: any;
}
