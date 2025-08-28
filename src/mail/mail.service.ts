import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendAssignmentEmail(to: string, sopTitle: string) {
    await this.mailerService.sendMail({
      to,
      subject: `Penugasan SOP Baru: ${sopTitle}`,
      template: './assignment', // pakai templates/email/assignment.hbs
      context: {
        sopTitle,
      },
    });
  }
}
