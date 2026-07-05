import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { FamilyOrmEntity } from '../families/family.orm-entity';
import { TypeFruitOrmEntity } from '../type-fruits/type-fruit.orm-entity';

@Entity('fruits')
export class FruitOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'common_name', type: 'varchar', length: 50 })
  commonName: string;

  @Column({ name: 'scientific_name', type: 'varchar', length: 100, unique: true })
  scientificName: string;
  
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => FamilyOrmEntity, { nullable: false })
  @JoinColumn({ name: 'family_id' })
  family: FamilyOrmEntity;

  @RelationId((fruit: FruitOrmEntity) => fruit.family)
  familyId: number;

  @ManyToOne(() => TypeFruitOrmEntity, { nullable: false })
  @JoinColumn({ name: 'type_fruit_id' })
  typeFruit: TypeFruitOrmEntity;

  @RelationId((fruit: FruitOrmEntity) => fruit.typeFruit)
  typeFruitId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
