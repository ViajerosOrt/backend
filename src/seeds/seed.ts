import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SeederModule } from './seeder.module';
import { Seeder } from './seeder.sevice';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const logger = new Logger('SeederBootstrap');
  const seeder = appContext.get(Seeder);  

  try {
    await seeder.seed();
    logger.debug('Seeding complete!');
  } catch (error) {
    logger.error('Seeding failed!', error);
  } finally {
    await appContext.close();
  }
}

bootstrap();
