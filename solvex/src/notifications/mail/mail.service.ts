/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';
import { MailTemplatesService } from './templates/mailTemplate.service';

configDotenv({ path: '.env.development' });

@Injectable()
export class MailService {
  private transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly mailTemplates: MailTemplatesService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendTicketCreationEmail(
    to: string,
    ticketInfo: {
      id: number;
      title: string;
      description: string;
      area: string;
      date: string;
    },
  ) {
    const html = this.mailTemplates.getTicketCreationTemplate(ticketInfo);

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to,
      subject: `Nuevo Ticket Creado #${ticketInfo.id}`,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send notification email');
    }
  }

  async sendTicketUpdateEmail(
    to: string,
    updateInfo: {
      id: number;
      title: string;
      status: string;
      response: string;
      helper: string;
      date: string;
    },
  ) {
    const html = this.mailTemplates.getTicketUpdateTemplate(updateInfo);

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to,
      subject: `Actualización de Ticket #${updateInfo.id}`,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending update email:', error);
      throw new Error('Failed to send update notification email');
    }
  }

  async sendPaymentCreationEmail(
    to: string,
    paymentInfo: {
      paymentUrl: string;
      amount: number;
      currency: string;
      expiration: string;
    },
  ) {
    const subject = 'Link de pago generado';
    const html = this.mailTemplates.getPaymentCreationTicket(paymentInfo);

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending payment creation email:', error);
      throw new Error('Failed to send payment creation email');
    }
  }
  async sendPaymentApprovalEmail(
    to: string,
    data: {
      amount: number;
      currency: string;
      paymentDate: string;
      transactionId?: number;
      paymentMethod?: string;
    },
  ): Promise<void> {
    const html = this.mailTemplates.getPaymentApprovalEmail(data);
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to,
      subject: `✅ Pago aprobado - #${data.transactionId || ''}`,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Correo de aprobación enviado a ${to}`);
    } catch (error) {
      this.logger.error(`Error enviando correo de aprobación a ${to}`, {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
