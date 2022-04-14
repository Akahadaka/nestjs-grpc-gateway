import { Controller, Logger, Get, Query, OnModuleInit } from '@nestjs/common';
import { ParseArrayPipe } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Observable } from 'rxjs';

export interface IGrpcService {
  sum(numberArray: INumberArray): Observable<any>;
}

interface INumberArray {
  data: number[];
}

// Same options object used by microservice server
const microserviceOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'app',
    protoPath: join(__dirname, '../../protobufs/app.proto'),
  },
};

@Controller('api')
export class AppController implements OnModuleInit {
  private logger = new Logger('AppController');

  @Client(microserviceOptions)
  private client: ClientGrpc;

  private grpcService: IGrpcService;

  onModuleInit() {
    this.grpcService = this.client.getService<IGrpcService>('AppController');
  }

  @Get('sum')
  async sum(@Query('data', ParseArrayPipe) data: number[]) {
    this.logger.log('Adding ' + data);
    return this.grpcService.sum({ data });
  }
}
