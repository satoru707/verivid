import sgMail from '@sendgrid/mail';

export interface EmailService {
  sendRecoveryEmail(email: string, recoveryLink: string): Promise<void>;
  sendVerificationEmail(email: string, verificationLink: string): Promise<void>;
  sendNotification(
    email: string,
    subject: string,
    message: string
  ): Promise<void>;
}

export class SendGridEmailService implements EmailService {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error(
        'SENDGRID_API_KEY is not defined in environment variables'
      );
    }
    sgMail.setApiKey(apiKey);
  }

  async sendRecoveryEmail(email: string, recoveryLink: string): Promise<void> {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@verivid.app',
      subject: 'VeriVid Account Recovery',
      text: `Click here to recover your account: ${recoveryLink}`,
      html: `<p>Click <a href="${recoveryLink}">here</a> to recover your account.</p>`,
    };
    await sgMail.send(msg);
  }

  async sendVerificationEmail(
    email: string,
    verificationLink: string
  ): Promise<void> {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@verivid.app',
      subject: 'VeriVid Email Verification',
      text: `Click here to verify your email: ${verificationLink}`,
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    };
    await sgMail.send(msg);
  }

  async sendNotification(
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@verivid.app',
      subject,
      text: message,
      html: `<p>${message}</p>`,
    };
    await sgMail.send(msg);
  }
}

export const emailService = new SendGridEmailService();
