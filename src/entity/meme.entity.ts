import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Vote } from './vote.entity';

@Entity('memes')
@Index(['author'])
@Index(['score'])
@Index(['createdAt'])
export class Meme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  title: string;

  @Column({ name: 'image_url', length: 500, nullable: false })
  imageUrl: string;

  @Column({ length: 100, nullable: false })
  author: string;

  @Column({ default: 0, type: 'int' })
  score: number;

  @OneToMany(() => Vote, vote => vote.meme)
  votes: Vote[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}