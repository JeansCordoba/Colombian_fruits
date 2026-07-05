import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NaturalRegionOrmEntity } from '../natural-regions/natural-region.orm-entity';
import { FruitOrmEntity } from './fruit.orm-entity';

/**
 * Bridge table between fruits and natural regions (N:M).
 */
@Entity('fruit_natural_regions')
export class FruitNaturalRegionOrmEntity {
  @PrimaryColumn({ name: 'fruit_id', type: 'integer' })
  fruitId: number;

  @PrimaryColumn({ name: 'natural_region_id', type: 'integer' })
  naturalRegionId: number;

  @ManyToOne(() => FruitOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fruit_id' })
  fruit: FruitOrmEntity;

  @ManyToOne(() => NaturalRegionOrmEntity, { nullable: false })
  @JoinColumn({ name: 'natural_region_id' })
  naturalRegion: NaturalRegionOrmEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
