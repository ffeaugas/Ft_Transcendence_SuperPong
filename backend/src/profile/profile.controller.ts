import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProfileBioUpdateDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer/multer.config';
import * as fs from 'node:fs';

@Controller('profiles')
@ApiBearerAuth()
@ApiTags('profiles')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfiles(
    @Query('username') username?: string,
    @Query('id') uid?: string,
  ) {
    if (username) {
      return await this.profileService.getProfileByUsername(username);
    } else if (uid) {
      return await this.profileService.getProfileById(+uid);
    } else {
      return await this.profileService.getAllProfiles();
    }
  }

  @Post('upload-pp')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadFile(@Req() req: any, @UploadedFile() file) {
    console.log(file);
    return await this.profileService.uploadFile(req, file);
  }

  @Patch('update-bio')
  async updateProfileBio(@Body() dto: ProfileBioUpdateDto) {
    return await this.profileService.updateProfileBio(dto);
  }

  @Delete()
  async deleteProfiles(
    @Query('username') username?: string,
    @Query('id') uid?: string,
  ) {
    if (username) {
      return await this.profileService.deleteProfileByUsername(username);
    } else if (uid) {
      return await this.profileService.deleteProfileById(+uid);
    } else {
      return await this.profileService.deleteAllProfiles();
    }
  }
}
