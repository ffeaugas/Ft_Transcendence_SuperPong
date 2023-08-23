import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AchievementService } from './achievement.service';

@ApiTags('achievement')
@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Get('all')
  async getAllAchievements() {
    return await this.achievementService.getAllAchievements();
  }
}
