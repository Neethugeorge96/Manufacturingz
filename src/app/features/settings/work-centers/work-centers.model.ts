import { Model } from '@shared/models/model';

export interface WorkCenter extends Model {
    workCenterCode: string;
    workCenterName: string;
    plantId: number;
    plantName: string;
    productionLineId:number;
    productionLineCode: string;
    productionLineName:string;
    supervisorId: number;
    supervisor:string;
    description: string;
    isAssigned: boolean;
}