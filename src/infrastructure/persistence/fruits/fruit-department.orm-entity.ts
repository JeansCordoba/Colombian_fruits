import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DepartmentOrmEntity } from '../departments/department.orm-entity';
import { FruitOrmEntity } from './fruit.orm-entity';

/**
 * Bridge table between fruits and departments (N:M).
 */
@Entity('fruit_departments')
export class FruitDepartmentOrmEntity {
  @PrimaryColumn({ name: 'fruit_id', type: 'integer' })
  fruitId: number;

  @PrimaryColumn({ name: 'department_id', type: 'integer' })
  departmentId: number;

  @ManyToOne(() => FruitOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fruit_id' })
  fruit: FruitOrmEntity;

  @ManyToOne(() => DepartmentOrmEntity, { nullable: false })
  @JoinColumn({ name: 'department_id' })
  department: DepartmentOrmEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
