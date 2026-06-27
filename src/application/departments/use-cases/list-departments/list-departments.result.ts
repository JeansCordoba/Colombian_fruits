import { Department } from '../../../../domain/departments/entities/department.entity';

export interface ListDepartmentsMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ListDepartmentsResult {
    data: Department[];
    meta: ListDepartmentsMeta;
}
