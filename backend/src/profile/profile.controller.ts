import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProfileDto } from './dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

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

  @Patch()
  @ApiCreatedResponse({
    description: 'Update profile bio.',
    type: ProfileDto,
  })
  async updateBioProfile(
    @Query('username') user: string,
    @Body() dto: ProfileDto,
  ) {
    return await this.profileService.updateBioProfile(user, dto);
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
