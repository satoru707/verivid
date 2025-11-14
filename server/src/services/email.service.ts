import nodemailer from 'nodemailer';

export interface EmailService {
  sendRecoveryEmail(email: string, recoveryLink: string): Promise<void>;
  sendVerificationEmail(email: string, verificationLink: string): Promise<void>;
  sendNotification(
    email: string,
    subject: string,
    message: string
  ): Promise<void>;
}

export class SmtpEmailService implements EmailService {
  private transporter;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      throw new Error('SMTP credentials (HOST, USER, PASS) missing in .env');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  }

  async sendRecoveryEmail(email: string, recoveryLink: string): Promise<void> {
    const from = process.env.SMTP_FROM_EMAIL || 'no-reply@verivid.app';

    await this.transporter.sendMail({
      from: `"VeriVid" <${from}>`,
      to: email,
      subject: 'VeriVid Account Recovery',
      text: `Click here to recover your account: ${recoveryLink}`,
      html: `<p>Click <a href="${recoveryLink}">here</a> to recover your account.</p>`,
    });
  }

  async sendVerificationEmail(
    email: string,
    verificationLink: string
  ): Promise<void> {
    const from = process.env.SMTP_FROM_EMAIL || 'no-reply@verivid.app';

    await this.transporter.sendMail({
      from: `"VeriVid" <${from}>`,
      to: email,
      subject: 'Verify Your VeriVid Email',
      text: `Click here to verify your email: ${verificationLink}`,
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });
  }

  async sendNotification(
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    const from = process.env.SMTP_FROM_EMAIL || 'no-reply@verivid.app';

    await this.transporter.sendMail({
      from: `"VeriVid" <${from}>`,
      to: email,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    });
  }
}

export const emailService = new SmtpEmailService();
