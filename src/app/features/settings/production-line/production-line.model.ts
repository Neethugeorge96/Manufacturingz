import { Model } from '@shared/models/model';

export interface ProductionLine extends Model {
    productionLineCode: string;
    productionLineName: string;
    plantId: number;
    plantName: string;
    remarks:string;
    isAssigned: boolean;
}