import { Model } from '@shared/models/model';

export interface BatchTimeTrackerModel extends Model {
    productionOrderId: number;
    batchNumber: number;
    batchCode: string;
    startTime: string;
    endTime: string;
    batchOutput: number;
    uom: string;
    damageQuantity: number;
    damageReason: string;
    remarks: string;
}
