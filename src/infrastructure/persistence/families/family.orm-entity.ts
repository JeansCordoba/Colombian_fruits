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
import { TypePlantOrmEntity } from '../type-plants/type-plant.orm-entity';

@Entity('families')
export class FamilyOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 50 })
    name: string;

    @ManyToOne(() => TypePlantOrmEntity, { nullable: false })
    @JoinColumn({ name: 'type_plant_id' })
    typePlant: TypePlantOrmEntity;

    @RelationId((family: FamilyOrmEntity) => family.typePlant)
    typePlantId: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}
