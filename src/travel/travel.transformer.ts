import { Injectable } from '@nestjs/common';
import { TravelDto } from './dto/travel.dto.reolver';
import { Travel } from './entities/travel.entity';

@Injectable()
export class TravelTransformer {
  async toDto(travel: Travel, userId?: string): Promise<TravelDto> {
    const travelDTO = new TravelDto();
    Object.assign(travelDTO, travel);
    travelDTO.isJoined =
      travel.usersTravelers.some((traveler) => traveler.id === userId) || false;
    travelDTO.usersCount = travel.usersTravelers.length;

    return travelDTO;
  }

  async toDTOs(travels: Travel[], userId?: string): Promise<TravelDto[]> {
    return travels.map((travel) =>
      Object.assign(new TravelDto(), {
        ...travel,
        isJoined: travel.usersTravelers.some(
          (traveler) => traveler.id === userId,
        ),
        usersCount: travel.usersTravelers.length,
      }),
    );
  }


  async toEntity(travelDto: TravelDto):Promise<Travel>{
    const travel = new Travel();
    Object.assign(travel, travelDto);
    return travel;
  }
}
