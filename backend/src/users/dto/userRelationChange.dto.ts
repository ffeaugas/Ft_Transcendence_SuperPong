import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

enum RelationType {
  FRIEND = 'FRIEND',
  BLOCK = 'BLOCK',
}

export class UserRelationChangeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'target username' })
  targetUsername: string;
  @IsNotEmpty()
  @ApiProperty({
    description: 'type of relation to update : friend, block, etc...',
  })
  relationType: RelationType;
}
