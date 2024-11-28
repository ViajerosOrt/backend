import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportResolver } from './transport.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transport } from './entities/transport.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Transport])],
  providers: [TransportResolver, TransportService],
  exports:[TransportService]
  
})
export class TransportModule {}
