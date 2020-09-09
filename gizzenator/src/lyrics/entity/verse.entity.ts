import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Verse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  songId: string;

  @Column()
  verseNumber: number;

  @Column()
  lyric: string;
}