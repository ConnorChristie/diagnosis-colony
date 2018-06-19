import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoriesController } from './controllers/stories.controller';
import { StoriesService } from './services/stories.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    StoriesController
  ],
  providers: [
    AppService,
    StoriesService
  ]
})
export class AppModule {}
