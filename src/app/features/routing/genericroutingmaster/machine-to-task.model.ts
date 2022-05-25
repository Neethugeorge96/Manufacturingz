import { Model } from '@shared/models/model';

export interface MachineToTask extends Model {
    taskId: number;
    taskCode:string;
    machineId: string;
    machineName: string;
    costRatePerHour: number;
    currencyCode: string;
}