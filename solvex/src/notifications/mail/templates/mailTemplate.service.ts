import { Injectable } from '@nestjs/common';

@Injectable()
export class MailTemplatesService {
  getTicketCreationTemplate(ticketInfo: {
    id: number;
    title: string;
    description: string;
    area: string;
    date: string;
  }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2c3e50; color: white; padding: 15px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #777; }
          .button {
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nuevo Ticket Creado</h1>
          </div>
          <div class="content">
            <p><strong>ID:</strong> ${ticketInfo.id}</p>
            <p><strong>Título:</strong> ${ticketInfo.title}</p>
            <p><strong>Descripción:</strong></p>
            <p>${ticketInfo.description}</p>
            <p><strong>Área:</strong> ${ticketInfo.area}</p>
            <p><strong>Fecha de creación:</strong> ${ticketInfo.date}</p>
            <a href="http://localhost:3000" class="button">
              Ver Ticket
            </a>
          </div>
          <div class="footer">
            <p>Este es un mensaje automático, por favor no responda directamente.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getTicketUpdateTemplate(updateInfo: {
    id: number;
    title: string;
    status: string;
    response: string;
    helper: string;
    date: string;
  }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* Mismos estilos que arriba o personalizados para actualizaciones */
          .status-update { color: #e74c3c; font-weight: bold; }
          .response { background-color: #ecf0f1; padding: 10px; border-left: 4px solid #3498db; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Actualización de Ticket #${updateInfo.id}</h1>
          </div>
          <div class="content">
            <p><strong>Título:</strong> ${updateInfo.title}</p>
            <p><strong>Nuevo estado:</strong> <span class="status-update">${updateInfo.status}</span></p>
            <p><strong>Respuesta:</strong></p>
            <div class="response">${updateInfo.response}</div>
            <p><strong>Atendido por:</strong> ${updateInfo.helper}</p>
            <p><strong>Fecha de actualización:</strong> ${updateInfo.date}</p>
            <a href="http://localhost:3000" class="button">
              Ver Ticket
            </a>
          </div>
          <div class="footer">
            <p>Este es un mensaje automático, por favor no responda directamente.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
