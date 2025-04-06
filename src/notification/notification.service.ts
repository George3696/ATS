import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailgun from 'mailgun.js';
import * as FormData from 'form-data';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly mailgun;

  constructor(private configService: ConfigService) {
    const mg = new Mailgun(FormData);
    this.mailgun = mg.client({
      username: 'api',
      key: process.env.MAIL_GUN_API_KEY,
    });
  }

  async sendShortlistEmail(
    to: string,
    jobTitle: string,
    matchScore: number,
  ): Promise<void> {
    const threshold = 70;
    const domain = process.env.MAIL_GUN_DOMAIN;
    const from = process.env.SENDER_EMAIL;
    const template = emailTemplate(
      matchScore > threshold,
      jobTitle,
      matchScore,
    );
    try {
      await this.mailgun.messages.create(domain, {
        from,
        to,
        subject: `You're Shortlisted for ${jobTitle}!`,
        html: template,
      });

      this.logger.log(`✅ Shortlist email sent to ${to}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to send shortlist email to ${to}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}

function emailTemplate(isShortlisted: boolean, jobTitle, matchScore) {
  if (isShortlisted) {
    return `
    <div style="font-family: Arial, sans-serif; color: #333;">
<h2 style="color: #2c3e50;">Congratulations!</h2>
<p>You've been shortlisted for the <strong>${jobTitle}</strong> position.</p>
<p>Your resume matched <strong>${matchScore}%</strong> of our job criteria.</p>
<p>We’ll be in touch soon for the next steps. Good luck!</p>
<br/>
<p style="font-size: 14px; color: #888;">— HR Team</p>
</div>
  `;
  } else {
    return `<div style="font-family: Arial, sans-serif; color: #333;">
  <h2 style="color: #c0392b;">Thank You for Applying</h2>
  <p>We appreciate your interest in the <strong>${jobTitle}</strong> position.</p>
  <p>After carefully reviewing your resume, we found it did not meet enough of our current requirements.</p>
  <p>Your match score was <strong>${matchScore}%</strong>.</p>
  <p>We encourage you to apply for future openings that better align with your profile.</p>
  <br/>
  <p style="font-size: 14px; color: #888;">— HR Team</p>
</div>`;
  }
}
