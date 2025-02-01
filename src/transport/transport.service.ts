import { Injectable } from '@nestjs/common';
import { CreateTransportInput } from './dto/create-transport.input';
import { UpdateTransportInput } from './dto/update-transport.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Transport } from './entities/transport.entity';
import { Repository } from 'typeorm';
import { GraphQLError } from 'graphql';
import { Travel } from 'src/travel/entities/travel.entity';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(Transport)
    private transportRepository: Repository<Transport>,
  ){}
  async create(createTransportInput: CreateTransportInput):Promise<Transport> {
    const transport = this.transportRepository.create(createTransportInput);
    return this.transportRepository.save(transport);
  }

  async findAll():Promise<Transport[]> {
    return this.transportRepository.find();
  }

  async findOne(id: string):Promise<Transport> {
    const transport = this.transportRepository.findOne({
      where:{
        id,
      }
    })

    if(!transport){
      throw new GraphQLError('this transport not exist');
    }

    return transport;
  }

}
