import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;
}