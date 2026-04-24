import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Meme } from './meme.entity';

export enum VoteType {
  UP = 'up',
  DOWN = 'down',
}

@Entity('votes')
@Index(['meme', 'createdAt'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: VoteType,
    nullable: false,
  })
  type: VoteType;

  @ManyToOne(() => Meme, meme => meme.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meme_id' })
  meme: Meme;

  @Column({ name: 'meme_id' })
  memeId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
