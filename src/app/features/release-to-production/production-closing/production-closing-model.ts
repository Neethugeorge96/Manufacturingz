import { Model } from '@shared/models/model';

export class productionTimeTracker extends Model {
    productionOrderId: number;
    startTime: string;
    endTime: string;
    totalOutput: number;
    uOM: string
    batchOutput: number
    remarks: string
}