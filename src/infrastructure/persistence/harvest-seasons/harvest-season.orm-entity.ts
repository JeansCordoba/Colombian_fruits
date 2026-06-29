import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('harvest_seasons')
export class HarvestSeasonOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'start_month', type: 'integer' })
    startMonth: number;

    @Column({ name: 'end_month', type: 'integer' })
    endMonth: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}
