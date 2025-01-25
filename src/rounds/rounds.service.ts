import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestRoundDTO } from 'src/dto/rounds.requestDTO';
import { Round } from './rounds.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoundsService {
    constructor(
        @InjectRepository(Round)
        private roundsRepository: Repository<Round>,
    ){}

    async getAll() : Promise<Round[]> {
        return this.roundsRepository.find();
    }
    async get(round: number) : Promise<Round> {
        return this.roundsRepository.findOneByOrFail({ round });
    }
    async create(createRoundsDTO: RequestRoundDTO[]) : Promise<Round[]>{
        return this.roundsRepository.save(createRoundsDTO);
    }
}
