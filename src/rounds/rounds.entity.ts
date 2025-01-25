import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Round {
    @PrimaryColumn()
    round: number

    @Column()
    assignments: string

    @Column()
    startTime : string
}

