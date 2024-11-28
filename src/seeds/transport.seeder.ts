import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Transport } from '../transport/entities/transport.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransportSeeder implements Seeder {
  constructor(
    @InjectRepository(Transport)
    private readonly transportRepository: Repository<Transport>,
  ) {}

  async seed(): Promise<any> {
    const transports = [
      { name: 'avión' },
      { name: 'barco' },
      { name: 'auto' },
      { name: 'moto' },
      { name: 'tren' },
    ];

    await this.transportRepository.save(transports);
  }

  async drop(): Promise<any> {
    await this.transportRepository.delete({});
  }
}
