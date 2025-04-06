import { Module } from '@nestjs/common';

import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';
import { FileProcessingModule } from '../file-processing/file-processing.module';
import { KeywordMatchingModule } from '../keyword-matching/keyword-matching.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [FileProcessingModule, KeywordMatchingModule, NotificationModule],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}
