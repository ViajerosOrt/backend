import { Mutation, Resolver, Args, Int } from '@nestjs/graphql';
import { ActivitesService } from './activites.service';
import { Query } from '@nestjs/graphql';
import { Activite } from './activites.entity';
import { CreateActiviteInput } from './dto/create-activite.input';

@Resolver()
export class ActivitesResolver {

    constructor(private activiteService: ActivitesService) {}


    @Query((returns)=> [Activite])
    activites(){
        return this.activiteService.findAll();
    }

    @Query((returns)=> Activite)
    activite(@Args('id', {type: ()=> Int}) id: number){
        return this.activiteService.findActiviteById(id);
    }

    @Mutation((returns)=> Activite)
    createActivite(@Args('activiteInp') activiteInp: CreateActiviteInput){
        return this.activiteService.createActivite(activiteInp);
    }
}
