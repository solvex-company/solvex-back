import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/roles.enum';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', //se tiene que activar cors manualmente para websockets
    credentials: true,
  },
})
export class MyGateway implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      const token = socket.handshake.auth?.token;
      console.log(token);
      console.log(socket.id);
      console.log('Connected');

      const secret = process.env.JWT_SECRET;
      try {
        const decoded = await this.jwtService.verify(token, { secret });
        console.log(decoded);
        const userId = decoded.id_user;

        let roleId = decoded.id_role;

        if (roleId === 1) roleId = [Role.ADMIN];
        if (roleId === 2) roleId = [Role.HELPER];
        if (roleId === 3) roleId = [Role.EMPLOYEE];

        const foundUser = await this.usersRepository.findOne({
          where: { id_user: userId },
        });
        console.log(foundUser);
        const userName = foundUser?.name;

        console.log('✅ Authenticated user:', userId);
        console.log('🛡️ Role ID:', roleId);

        socket.data.user = {
          name: userName,
          role: roleId,
          email: decoded.email,
        };
      } catch (err) {
        console.error('❌ Invalid or expired token');
        console.log('disc');
        socket.disconnect();
      }
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any, @ConnectedSocket() socket: any) {
    const user = socket.data.user;

    if (!user) {
      console.error('❌ User not authenticated');
      return;
    }

    this.server.emit('onMessage', {
      user: {
        name: user.name,
        role: user.role,
      },
      content: body,
    });
  }
}
