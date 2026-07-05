import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HarvestSeasonOrmEntity } from '../harvest-seasons/harvest-season.orm-entity';
import { FruitOrmEntity } from './fruit.orm-entity';

/**
 * Bridge table between fruits and harvest seasons (N:M).
 */
@Entity('fruit_harvest_seasons')
export class FruitHarvestSeasonOrmEntity {
  @PrimaryColumn({ name: 'fruit_id', type: 'integer' })
  fruitId: number;

  @PrimaryColumn({ name: 'harvest_season_id', type: 'integer' })
  harvestSeasonId: number;

  @ManyToOne(() => FruitOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fruit_id' })
  fruit: FruitOrmEntity;

  @ManyToOne(() => HarvestSeasonOrmEntity, { nullable: false })
  @JoinColumn({ name: 'harvest_season_id' })
  harvestSeason: HarvestSeasonOrmEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
