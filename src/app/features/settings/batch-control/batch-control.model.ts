import { Model } from '@shared/models/model';

export interface BatchSize extends Model
    {
        batchCode: string;
        itemCode: string;
        itemName: number;
        uom: string;
        batchSizeMinQuantity: number;
        batchSizeMaxQuantity: number;
        isBatchOutputRequired: boolean;
        productionLineId:number;
        productionLineCode: string;
        productionLineName:string;
        remarks: string;
        
    }