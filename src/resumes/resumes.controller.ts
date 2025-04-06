import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumesService } from './resumes.service';
import { UploadResumeDto } from './dto/upload-resume.dto';
import { ResumeAnalysis } from '../utils/interface';

@Controller('resumes')
export class ResumesController {
  private readonly logger = new Logger(ResumesController.name);

  constructor(private readonly resumesService: ResumesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
      fileFilter: (req, file, cb) => {
        const validMimetypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (validMimetypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Only PDF and DOCX files are allowed'),
            false,
          );
        }
      },
    }),
  )
  async uploadResume(
    @UploadedFile() file,
    @Body() uploadResumeDto: UploadResumeDto,
  ): Promise<{ success: boolean; analysis: ResumeAnalysis }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.logger.log(
      `Resume upload request received for ${uploadResumeDto.candidateEmail}`,
    );

    const analysis = await this.resumesService.processResume(
      file,
      uploadResumeDto.candidateEmail,
      uploadResumeDto.jobTitle,
      uploadResumeDto.jobDescription,
    );

    return {
      success: true,
      analysis,
    };
  }
}
