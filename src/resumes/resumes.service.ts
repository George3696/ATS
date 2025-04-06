import { Injectable, Logger } from '@nestjs/common';
import { ResumeAnalysis } from '../utils/interface';
import { FileProcessingService } from '../file-processing/file-processing.service';
import { KeywordMatchingService } from '../keyword-matching/keyword-matching.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ResumesService {
  private readonly logger = new Logger(ResumesService.name);

  constructor(
    private fileProcessingService: FileProcessingService,
    private keywordMatchingService: KeywordMatchingService,
    private notificationService: NotificationService,
  ) {}

  async processResume(
    file,
    candidateEmail: string,
    jobTitle: string,
    jobDescription: string,
  ) {
    this.logger.log(
      `Processing resume for ${candidateEmail} for position ${jobTitle}`,
    );

    try {
      // Extract text from resume file
      const resumeText = await this.fileProcessingService.parseDocument(file);

      // Calculate match score
      const matchScore = await this.keywordMatchingService.calculateMatchScore(
        jobDescription,
        resumeText,
      );

      // Determine if shortlisted
      const isShortlisted =
        this.keywordMatchingService.isShortlisted(matchScore);

      // Save analysis to database ( for future )
      // const resumeAnalysis = await this.saveResumeAnalysis({
      //   candidateEmail,
      //   jobTitle,
      //   matchScore,
      //   isShortlisted,
      // });

      // Send email notification if shortlisted
      if (isShortlisted) {
        this.notificationService.sendShortlistEmail(
          candidateEmail,
          jobTitle,
          matchScore,
        );
      } else {
        this.notificationService.sendShortlistEmail(
          candidateEmail,
          jobTitle,
          matchScore,
        );
      }
      return {
        candidateEmail,
        jobTitle,
        matchScore,
        isShortlisted,
      };
    } catch (error) {
      this.logger.error(
        `Error processing resume: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // implement this foe future

  // private async saveResumeAnalysis(
  //   analysis: ResumeAnalysis,
  // ): Promise<ResumeAnalysis> {
  //   const resume = this.resumeRepository.create({
  //     ...analysis,
  //     submittedAt: new Date(),
  //   });

  //   await this.resumeRepository.save(resume);
  //   return analysis;
  // }
}
