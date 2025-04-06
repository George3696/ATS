import { Module } from '@nestjs/common';
import { KeywordMatchingService } from './keyword-matching.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [KeywordMatchingService],
  exports: [KeywordMatchingService],
})
export class KeywordMatchingModule {}
