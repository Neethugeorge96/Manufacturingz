import { Model } from '@shared/models/model';

export interface Task extends Model {
    operationId: number;
    operationNumber: number;
    taskCode: string;
    taskName: string;
    description: string;
    qualityControlRequired:boolean;
    isRelatedTask: boolean;
    relatedTaskId: string;
}
