import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransportService } from './transport.service';
import { Transport } from './entities/transport.entity';
import { CreateTransportInput } from './dto/create-transport.input';
import { UpdateTransportInput } from './dto/update-transport.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Transport)
@UseGuards(JwtAuthGuard)
export class TransportResolver {
  constructor(private readonly transportService: TransportService) {}

  @Mutation(() => Transport)
  createTransport(@Args('createTransportInput') createTransportInput: CreateTransportInput) {
    return this.transportService.create(createTransportInput);
  }

  @Query(() => [Transport], { name: 'transports' })
  findAll() {
    return this.transportService.findAll();
  }

  @Query(() => Transport, { name: 'transport' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.transportService.findOne(id);
  }

}
