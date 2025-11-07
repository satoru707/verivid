export interface EmailService {
  sendRecoveryEmail(email: string, recoveryLink: string): Promise<void>;
  sendVerificationEmail(email: string, verificationLink: string): Promise<void>;
  sendNotification(
    email: string,
    subject: string,
    message: string
  ): Promise<void>;
}

export class MockEmailService implements EmailService {
  async sendRecoveryEmail(email: string, recoveryLink: string): Promise<void> {
    console.log(`Recovery email would be sent to ${email}: ${recoveryLink}`);
  }

  async sendVerificationEmail(
    email: string,
    verificationLink: string
  ): Promise<void> {
    console.log(
      `Verification email would be sent to ${email}: ${verificationLink}`
    );
  }

  async sendNotification(
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    console.log(`Email notification to ${email}: ${subject}`);
  }
}

export const emailService = new MockEmailService();
