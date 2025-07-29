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
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">¡Listo para pagar!</h2>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
        <p>Hemos generado tu link de pago:</p>
        <p><strong>Monto:</strong> ${paymentInfo.amount} ${paymentInfo.currency}</p>
        <p><strong>Válido hasta:</strong> ${paymentInfo.expiration}</p>
        <p style="text-align: center; margin-top: 20px;">
          <a href="${paymentInfo.paymentUrl}" 
             style="background: #3498db; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
            Realizar pago ahora
          </a>
        </p>
      </div>
    </div>
  `;

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
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to,
      subject: `✅ Pago aprobado - #${data.transactionId || ''}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <img src="https://tuempresa.com/logo.png" alt="Logo" width="150">
        <h2 style="color: #4CAF50;">¡Gracias por tu compra!</h2>
        <p>Hemos recibido tu pago exitosamente.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
          <p><strong>Monto:</strong> ${data.amount} ${data.currency}</p>
          <p><strong>Fecha:</strong> ${data.paymentDate}</p>
          <p><strong>Producto:</strong> Acceso al chat de soporte</p>
        </div>
        <p>¿Qué sigue? <a href="https://tuempresa.com/acceso">Haz clic aquí para acceder</a></p>
      </div>
    `,
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
