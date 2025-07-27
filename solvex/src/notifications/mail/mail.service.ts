/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';
import { MailTemplatesService } from './templates/mailTemplate.service';

configDotenv({ path: '.env.development' });

@Injectable()
export class MailService {
  private transporter;

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

  async sendPaymentStatusEmail(
    to: string,
    paymentInfo: {
      status: string;
      amount: number;
      currency: string;
      paymentId: string;
      date: string;
    },
  ) {
    const statusMessages = {
      approved: 'aprobado',
      rejected: 'rechazado',
      pending: 'pendiente',
      refunded: 'reembolsado',
      cancelled: 'cancelado',
      unknown: 'en proceso',
    };

    const status = statusMessages[paymentInfo.status] || paymentInfo.status;
    const subject = `Estado de tu pago: ${status}`;

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Estado de tu pago</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p><strong>ID de pago:</strong> ${paymentInfo.paymentId}</p>
            <p><strong>Estado:</strong> ${status}</p>
            <p><strong>Monto:</strong> ${paymentInfo.amount} ${paymentInfo.currency}</p>
            <p><strong>Fecha:</strong> ${paymentInfo.date}</p>
            ${
              paymentInfo.status === 'approved'
                ? '<p style="color: #27ae60;">¡Gracias por tu compra! Tu acceso ha sido activado.</p>'
                : paymentInfo.status === 'rejected'
                  ? '<p style="color: #e74c3c;">Por favor intenta con otro método de pago.</p>'
                  : ''
            }
          </div>
          <p style="text-align: center; margin-top: 20px;">
            <a href="https://tudominio.com/mis-compras" 
               style="background: #3498db; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
              Ver mis compras
            </a>
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending payment status email:', error);
      throw new Error('Failed to send payment status email');
    }
  }
}
