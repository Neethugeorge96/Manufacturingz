import { Model } from '@shared/models/model';

export interface EOCMachine extends Model {
    taskId: number;
    taskCode: string;
    taskName: string;
    machineCode: string;
    machineName: string;
    costRatePerHour: number;
    machineHour: number;
    machineCost:number;
    idleHours: number;
    idleHourCost: number;
    currencyCode: string;
}
