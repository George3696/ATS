import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResumesModule } from './resumes/resumes.module';
import { FileProcessingModule } from './file-processing/file-processing.module';
import { KeywordMatchingModule } from './keyword-matching/keyword-matching.module';
import { NotificationModule } from './notification/notification.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ResumesModule,
    FileProcessingModule,
    KeywordMatchingModule,
    NotificationModule,
  ],
})
export class AppModule {}
