
import { Model } from '@shared/models/model';
export interface POheader extends Model {

    ProductionOrderNumber: string;
    PODate: Date;
    ProductionItem: string;
    ProductionQuantity: number;
    BatchSize: number;
    productionLineId:number;
    productionLineCode: string;
    productionLineName:string;
}