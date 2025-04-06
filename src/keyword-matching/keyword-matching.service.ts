import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Anthropic } from '@anthropic-ai/sdk';

@Injectable()
export class KeywordMatchingService {
  private readonly logger = new Logger(KeywordMatchingService.name);
  private readonly anthropic: Anthropic;

  constructor(private configService: ConfigService) {
    this.anthropic = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
    });
  }

  async calculateMatchScore(
    jobDescription: string,
    resumeText: string,
  ): Promise<number> {
    const prompt = `
    You are an expert recruiter. Given a job description and a resume, analyze how well the resume matches the job. 
    Provide a score between 0 to 100 based on relevance and keyword alignment.
    
    Job Description:
    ${jobDescription}
    
    Resume:
    ${resumeText}
    
    Respond with only the score as a number (e.g., 85). No explanation.
    `;
    // calculate the input tokens
    const inputTokenCount = await this.anthropic.messages.countTokens({
      model: 'claude-3-7-sonnet-20250219',
      system: 'You are a scientist',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    console.log(
      `Input token count for this API call - ${JSON.stringify(
        inputTokenCount,
      )}`,
    );

    const response = await this.anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219', // or opus
      max_tokens: 10,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    console.log('-------', response);

    const rawScore = response.content?.[0]?.['text']?.trim();
    const score = parseInt(rawScore, 10);

    console.log('-----score', score);

    if (isNaN(score)) {
      this.logger.warn(`Failed to parse AI score from response: ${rawScore}`);
      return 0;
    }

    return score;
  }

  isShortlisted(matchScore: number): boolean {
    const threshold = this.configService.get<number>(
      'resume.shortlistThreshold',
      70,
    );
    return matchScore >= threshold;
  }
}
