import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import { Checklist } from '../checklist/entities/checklist.entity';
import { TravelService } from '../travel/travel.service';
import { Item } from '../item/entities/item.entity';
import { ItemService } from '../item/item.service';
import { CreateChecklistInput } from '../checklist/dto/create-checklist.input';
import { Travel } from '../travel/entities/travel.entity';


@Injectable()
export class ChecklistSeeder implements Seeder{
  constructor(
    @InjectRepository(Checklist)
    private readonly checklistRepository: Repository<Checklist>,
    private readonly travelService: TravelService,
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly itemService: ItemService
  ) {}

  async seed(): Promise<void> {
    const travels = await this.travelService.findAll(); 
    //const travel = travels[0] 
    /*
    if (!travel) {
      console.log('No Travel found to associate with Checklist');
      return;
    }
    */

    const itemsList =   [
      'Sunscreen' ,
       'Swimwear' ,
      'Beach Towel' ,
       'Water Bottle' ,
      'Hiking Boots' ,
       'Trail Map' ,
    ]

    const items = await this.itemService.createAllItems(itemsList);



    const itemsChecklist: Item[] = [];

    for(let i = 0; i < items.length; i++){
      itemsChecklist.push(items[Math.floor(Math.random() * items.length)])
    }

   for(const travel of travels){
    const createChecklist = new CreateChecklistInput()
    createChecklist.name = travel.travelTitle
    const checklist = this.checklistRepository.create(createChecklist)
    checklist.travel = travel
    checklist.items = checklist.items || []
    checklist.items.push(...itemsChecklist)
    await this.checklistRepository.save(checklist);
   }
  
  }

  async drop(): Promise<void> {
    await this.checklistRepository.delete({});
    await this.itemRepository.delete({});
  }
  
}