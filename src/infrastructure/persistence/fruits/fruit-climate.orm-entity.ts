import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClimateOrmEntity } from '../climates/climate.orm-entity';
import { FruitOrmEntity } from './fruit.orm-entity';

/**
 * Bridge table between fruits and climates (N:M).
 */
@Entity('fruit_climates')
export class FruitClimateOrmEntity {
  @PrimaryColumn({ name: 'fruit_id', type: 'integer' })
  fruitId: number;

  @PrimaryColumn({ name: 'climate_id', type: 'integer' })
  climateId: number;

  @ManyToOne(() => FruitOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fruit_id' })
  fruit: FruitOrmEntity;

  @ManyToOne(() => ClimateOrmEntity, { nullable: false })
  @JoinColumn({ name: 'climate_id' })
  climate: ClimateOrmEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
