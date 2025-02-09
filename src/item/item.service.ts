import { Injectable } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { GraphQLError } from 'graphql';

@Injectable()
export class ItemService {

  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    private userService: UsersService
  ){}

  async create(item: string): Promise<Item> {
    const createItemInput = new CreateItemInput()
    createItemInput.name = item
    const newItem = this.itemRepository.create(createItemInput);
    return this.itemRepository.save(newItem);
  }

  async createAllItems(items: string[]): Promise<Item[]> {
    if (!items || items.length === 0) {
      throw new GraphQLError('Items array must not be empty');
    }

    const itemEntities = items.map(item => {
      const createItemInput = new CreateItemInput();
      createItemInput.name = item;
      createItemInput.isEndable = false;
      return this.itemRepository.create(createItemInput);
    });

    return this.itemRepository.save(itemEntities);
  }

  async addUser(itemId: string, userId: string):Promise<void>{
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new GraphQLError('This user does not exist');
    }
    const item = await this.findOne(itemId);
    item.user = user
    item.state = true
    this.userService.assingItem(await this.itemRepository.save(item), user.id)
  }

  async removeUser(itemsId: string[], userId: string):Promise<void>{
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new GraphQLError('This user does not exist');
    }
    for(const itemId of itemsId){
      const item = await this.findOne(itemId);
      if (!item) {
        throw new GraphQLError(`Item with id ${itemId} does not exist`);
      }
      item.user = null;
      item.state = false;
      this.userService.removeItem(item, user);
      this.itemRepository.save(item)
    }
  }



  async findOne(id: string) {
    return await this.itemRepository.findOne({
      where: {
        id
      },
      relations:['user']
    });

  }

  async save(item: Item):Promise<Item>{
    return this.itemRepository.save(item);
  }

  async delete(itemId: string):Promise<void>{
    await this.itemRepository.delete(itemId)
  }
}
