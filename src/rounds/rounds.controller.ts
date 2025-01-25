import { Controller, Get, Post, Req } from '@nestjs/common';
import { RoundsService } from './rounds.service';
import { ResponseRoundDTO } from 'src/dto/rounds.responseDTO';
import { RequestRoundDTO } from 'src/dto/rounds.requestDTO';

@Controller('rounds')
export class RoundsController {
    constructor(private RoundsService : RoundsService) {}
    @Get()
    async findAll() : Promise<ResponseRoundDTO[]> {
        return this.RoundsService.getAll();
    }
    @Post()
    async create(@Req() rounds : RequestRoundDTO[]){
        return this.RoundsService.create(rounds)

    } 
}
