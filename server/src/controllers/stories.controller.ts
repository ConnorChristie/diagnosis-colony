import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { StoriesService } from '../services/stories.service';

@Controller('api/stories')
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Get(':id/researchers')
  getResearchInterests(@Param('id') id: number) {
    return this.storiesService.getResearchInterests(id);
  }

  @Post(':id/researchers')
  submitResearchInterest(
    @Param('id') id: number,
    @Body('user') user: string,
    @Body('duration') duration: number,
    @Body('durationSig') durationSig: {}
  ) {
    this.storiesService.addResearchInterest(id, user, {
      duration,
      durationSig
    });
  }

  @Delete(':id/researchers/:user')
  removeResearchInterest(@Param('id') id: number, @Param('user') user: string) {
    this.storiesService.removeResearchInterest(id, user);
  }
}
