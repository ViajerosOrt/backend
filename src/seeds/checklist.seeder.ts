import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import { Checklist } from '../checklist/entities/checklist.entity';
import { TravelService } from '../travel/travel.service';
import { Item } from '../item/entities/item.entity';
import { ItemService } from '../item/item.service';
import { CreateChecklistInput } from '../checklist/dto/create-checklist.input';

@Injectable()
export class ChecklistSeeder implements Seeder {
  constructor(
    @InjectRepository(Checklist)
    private readonly checklistRepository: Repository<Checklist>,
    private readonly travelService: TravelService,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly itemService: ItemService,
  ) {}

  async seed(): Promise<void> {
    const travels = await this.travelService.findAll();

    const itemsList = [
      'Sunscreen',
      'Swimwear',
      'Beach Towel',
      'Water Bottle',
      'Hiking Boots',
      'Trail Map',
      'Backpack with essentials',
      'Travel guide or map',
      'Portable charger',
      'Reusable water bottle',
    ];

    const items = await this.itemService.createAllItems(itemsList);
    const savedItems: Item[] = [];

    for (const item of items) {
      savedItems.push(await this.itemService.save(item));
    }

    for (const travel of travels) {
      const createChecklist = new CreateChecklistInput();
      createChecklist.name = travel.travelTitle;
      const checklist = this.checklistRepository.create(createChecklist);
      checklist.travel = travel;
      checklist.items = checklist.items || [];
      checklist.items.push(...(await this.randomsItems(savedItems)));
      travel.checklist = await this.checklistRepository.save(checklist);
      await this.travelService.save(travel);
    }
  }

  async drop(): Promise<void> {
    await this.checklistRepository.delete({});
    await this.itemRepository.delete({});
  }

  async randomsItems(items: Item[]): Promise<Item[]> {
    const itemsChecklist: Item[] = [];
    const itemsFiltered = new Set<string>();

    while (itemsChecklist.length <= 3) {
      const rItem = items[Math.floor(Math.random() * items.length)];

      if (!itemsFiltered.has(rItem.id)) {
        itemsChecklist.push(rItem);
        itemsFiltered.add(rItem.id);
      }
    }

    return itemsChecklist;
  }
}
