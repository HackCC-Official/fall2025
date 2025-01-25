import { Module } from '@nestjs/common';
import { RoundsModule } from './rounds/rounds.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from './rounds/rounds.entity';

@Module({
    imports: [RoundsModule, 
        ConfigModule.forRoot({
            envFilePath: ['.env','.env.development.local']
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [Round],
            synchronize: true,
        })

    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
