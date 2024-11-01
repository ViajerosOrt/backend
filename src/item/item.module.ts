import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemResolver } from './item.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    UsersModule
  ],
  providers: [ItemResolver, ItemService],
  exports: [ItemService]

  
})
export class ItemModule {}
