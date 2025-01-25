import { Module } from '@nestjs/common';
import { RoundsController } from './rounds.controller';
import { RoundsService } from './rounds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from './rounds.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Round])],
    controllers: [RoundsController],
    providers: [RoundsService]
})
export class RoundsModule {}
