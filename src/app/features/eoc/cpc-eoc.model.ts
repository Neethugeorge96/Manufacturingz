import { Model } from '@shared/models/model';
import { CPCType } from 'src/app/models/common/types/costpricecomponent';

export interface CPCEOCModel extends Model {
    cpcId: number;
    cpcCode: string;
    cpcName: string;
    cpcType: CPCType;
    costPerHour:number;
    totalHours:number;
    totalCost: number;
    manufacturedProductCode:string;
    manufacturedProduct:string;
}