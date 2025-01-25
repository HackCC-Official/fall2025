import { RoundsService } from './rounds.service';
import { ResponseRoundDTO } from 'src/dto/rounds.responseDTO';
import { RequestRoundDTO } from 'src/dto/rounds.requestDTO';
export declare class RoundsController {
    private RoundsService;
    constructor(RoundsService: RoundsService);
    findAll(): Promise<ResponseRoundDTO[]>;
    create(rounds: RequestRoundDTO[]): Promise<import("./rounds.entity").Round[]>;
}
