/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';

configDotenv({ path: '.env.development' });

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendTicketCreationEmail(to: string, ticketInfo: any) {
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to,
      subject: 'Nuevo Ticket Creado',
      html: `
        <h1>Se ha creado un nuevo ticket</h1>
        <p><strong>ID:</strong> ${ticketInfo.id}</p>
        <p><strong>Título:</strong> ${ticketInfo.title}</p>
        <p><strong>Descripción:</strong> ${ticketInfo.description}</p>
        <p><strong>Área:</strong> ${ticketInfo.area}</p>
        <p><strong>Fecha:</strong> ${ticketInfo.date}</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send notification email');
    }
  }
}
