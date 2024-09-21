import { Module } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path'
import { registerAs } from '@nestjs/config';

dotenvConfig({ path: '.env' });

    const config = {
      type: 'postgres',
      host: `localhost`,
      port: `5432`,
      username: `postgres`,
      password: `postgres`,
      database: `database_viajeros`,
      entities: ["dist/**/*.entity{.ts,.js}"],
      migrations: ["dist/migrations/*{.ts,.js}"],
      autoLoadEntities: true,
      synchronize: false,
  }
  
  export default registerAs('typeorm', () => config)
  export const connectionSource = new DataSource(config as DataSourceOptions);