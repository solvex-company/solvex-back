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
            <a href="https://solvex-front.vercel.app/login" class="button">
              Ir a portal de asistencia
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
    const translateStatus = (status: string) => {
      const statusMap: Record<string, string> = {
        pending: 'Pendiente',
        completed: 'Resuelto',
      };

      return statusMap[status.toLowerCase()] || status;
    };
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Actualización de Ticket #${updateInfo.id}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f5f7fa;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #2c3e50, #34495e);
          color: white;
          padding: 25px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 25px;
        }
        .ticket-details {
          margin-bottom: 20px;
        }
        .detail-row {
          display: flex;
          margin-bottom: 12px;
        }
        .detail-label {
          font-weight: 600;
          color: #555;
          min-width: 150px;
        }
        .detail-value {
          flex: 1;
        }
        .status {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 4px;
          font-weight: 600;
          color: white;
        }
        .response-box {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #3498db;
          margin: 15px 0;
          font-size: 15px;
          line-height: 1.5;
        }
        .button-container {
          text-align: center;
          margin: 25px 0 15px;
        }
        .ticket-button {
          display: inline-block;
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .ticket-button:hover {
          background: linear-gradient(135deg, #2980b9, #2472a4);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(41, 128, 185, 0.3);
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #777;
          font-size: 12px;
          background-color: #f9f9f9;
          border-top: 1px solid #eee;
        }
        .highlight {
          background-color: #fffde7;
          padding: 2px 4px;
          border-radius: 3px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Actualización del Ticket #${updateInfo.id}</h1>
        </div>
        
        <div class="content">
          <div class="ticket-details">
            <div class="detail-row">
              <span class="detail-label">Título:</span>
              <span class="detail-value">${updateInfo.title}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Estado actual:</span>
              <span class="detail-value">
                <span class="status">${translateStatus(updateInfo.status)}</span>
              </span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Atendido por:</span>
              <span class="detail-value highlight">${updateInfo.helper}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Actualizado el:</span>
              <span class="detail-value">${updateInfo.date}</span>
            </div>
          </div>
          
          <p class="detail-label">Respuesta:</p>
          <div class="response-box">
            ${updateInfo.response}
          </div>
          
          <div class="button-container">
            <a href="https://solvex-front.vercel.app/login" class="ticket-button">
              Ir a portal de asistencia
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>Este es un mensaje automático, por favor no responda directamente.</p>
          <p>© ${new Date().getFullYear()} TuEmpresa. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  }

  getPaymentCreationTicket(paymentInfo: {
    paymentUrl: string;
    amount: number;
    currency: string;
    expiration: string;
  }) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { 
          background-color: #3498db;
          color: white; 
          padding: 15px; 
          text-align: center; 
          border-radius: 5px 5px 0 0;
        }
        .content { 
          background-color: #f9f9f9; 
          padding: 20px; 
          border-radius: 0 0 5px 5px;
          border: 1px solid #ddd;
          border-top: none;
        }
        .footer { 
          margin-top: 20px; 
          text-align: center; 
          font-size: 12px; 
          color: #777; 
        }
        .button {
          display: inline-block;
          background-color: #2980b9;
          color: white;
          padding: 12px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin: 15px 0;
          font-weight: bold;
        }
        .payment-summary {
          background-color: #e3f2fd;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
        }
        .expiration-warning {
          color: #d32f2f;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Ya casi terminas!</h1>
        </div>
        <div class="content">
          <p>Hemos preparado tu orden de pago. Por favor completa el proceso para finalizar tu compra.</p>
          
          <div class="payment-summary">
            <p><strong>Monto:</strong> ${paymentInfo.amount} ${paymentInfo.currency}</p>
            <p><strong>Válido hasta:</strong> <span class="expiration-warning">${paymentInfo.expiration}</span></p>
          </div>

          <a href="${paymentInfo.paymentUrl}" class="button">
            Ir a pagar ahora
          </a>
          
          <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
          <p><small>${paymentInfo.paymentUrl}</small></p>
        </div>
        <div class="footer">
          <p>Este es un mensaje automático, por favor no responda directamente.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  }

  getPaymentApprovalEmail(paymentInfo: {
    amount: number;
    currency: string;
    paymentDate: string;
    transactionId?: number;
    paymentMethod?: string;
  }) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { 
          background-color: #27ae60; /* Verde para indicar éxito */
          color: white; 
          padding: 15px; 
          text-align: center; 
          border-radius: 5px 5px 0 0;
        }
        .content { 
          background-color: #f9f9f9; 
          padding: 20px; 
          border-radius: 0 0 5px 5px;
          border: 1px solid #ddd;
          border-top: none;
        }
        .footer { 
          margin-top: 20px; 
          text-align: center; 
          font-size: 12px; 
          color: #777; 
        }
        .button {
          display: inline-block;
          background-color: #2ecc71;
          color: white;
          padding: 10px 15px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 15px;
        }
        .payment-details {
          background-color: #e8f5e9;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
        }
        .payment-id {
          font-weight: bold;
          color: #2e7d32;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Pago Aprobado!</h1>
        </div>
        <div class="content">
          <p>Gracias por tu compra. Hemos recibido tu pago exitosamente.</p>
          
          <div class="payment-details">
            <h3>Detalles del pago</h3>
            <p><strong>Monto:</strong> ${paymentInfo.amount} ${paymentInfo.currency}</p>
            <p><strong>Fecha de pago:</strong> ${paymentInfo.paymentDate}</p>
          </div>

          <p>Hemos procesado tu pago y ya puedes acceder a los servicios contratados.</p>
          
        </div>
        <div class="footer">
          <p>Este es un mensaje automático, por favor no responda directamente.</p>
          <p>Si tienes alguna duda, contáctanos en soporte@tudominio.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
  }
}
