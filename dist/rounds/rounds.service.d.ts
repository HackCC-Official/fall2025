import { RequestRoundDTO } from 'src/dto/rounds.requestDTO';
import { Round } from './rounds.entity';
import { Repository } from 'typeorm';
export declare class RoundsService {
    private roundsRepository;
    constructor(roundsRepository: Repository<Round>);
    getAll(): Promise<Round[]>;
    get(round: number): Promise<Round>;
    create(createRoundsDTO: RequestRoundDTO[]): Promise<Round[]>;
}
