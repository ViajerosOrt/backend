import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import {Location} from '../location/entities/location.entity'

@Injectable()
export class LocationSeeder implements Seeder {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async seed(): Promise<any> {
    const locations = [
      {
        name: 'Cabo Polonio',
        state: 'Rocha',
        address: 'Acceso por Ruta 10',
        longLatPoint: '-34.3995, -53.7913',
      },
      {
        name: 'Punta del Este',
        state: 'Maldonado',
        address: 'Rambla Claudio Williman',
        longLatPoint: '-34.9641, -54.9444',
      },
      {
        name: 'Colonia del Sacramento',
        state: 'Colonia',
        address: 'Barrio Histórico',
        longLatPoint: '-34.4713, -57.8485',
      },
      {
        name: 'La Paloma',
        state: 'Rocha',
        address: 'Avenida Solari',
        longLatPoint: '-34.6656, -54.1530',
      },
      {
        name: 'Piriápolis',
        state: 'Maldonado',
        address: 'Rambla de los Argentinos',
        longLatPoint: '-34.8687, -55.2747',
      },
      {
        name: 'Montevideo',
        state: 'Montevideo',
        address: 'Ciudad Vieja',
        longLatPoint: '-34.9075, -56.2025',
      },
      {
        name: 'Termas del Daymán',
        state: 'Salto',
        address: 'Ruta 3, km 487',
        longLatPoint: '-31.4827, -57.9119',
      },
      {
        name: 'Salto del Penitente',
        state: 'Lavalleja',
        address: 'Ruta 8, km 125',
        longLatPoint: '-34.2824, -55.2293',
      },
      {
        name: 'Valle Edén',
        state: 'Tacuarembó',
        address: 'Ruta 26, km 208',
        longLatPoint: '-31.7115, -56.0834',
      },
      {
        name: 'Carmelo',
        state: 'Colonia',
        address: 'Playa Seré',
        longLatPoint: '-33.9881, -58.2858',
      },
    ];

    await this.locationRepository.save(locations)
  }

  async drop(): Promise<any> {
      await this.locationRepository.delete({})
  }
}
