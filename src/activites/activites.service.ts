import { Injectable } from '@nestjs/common';
import {Activite} from './activites.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateActiviteInput } from './dto/create-activite.input';

@Injectable()
export class ActivitesService {

    constructor(
        @InjectRepository(Activite) 
        private activiteRepository: Repository<Activite>,
    ) {}

    async findAll(): Promise<Activite[]>{
        return this.activiteRepository.find();
    }

    async findActiviteById(id: number): Promise<Activite>{
        return this.activiteRepository.findOne({
            where:{
                id,
            }
        });
    }

    async findActivitesByAllId(ids: number[]):Promise<Activite[]>{
        return await this.activiteRepository.find({
            where:{
                id: In(ids), //Busca muchas id y debuelve un conjunto
            }
        })
    }

    createActivite(activite: CreateActiviteInput ): Promise<Activite>{
        const newAct = this.activiteRepository.create(activite);
        return this.activiteRepository.save(newAct)
    }


}
