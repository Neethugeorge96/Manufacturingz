import { Model } from '@shared/models/model';
import { CPCType } from 'src/app/models/common/types/costpricecomponent';

export interface CostPriceComponet extends Model {
    id:number;
    cpcCode: string;
    cpcType: CPCType;
    cpcName: string;
    description: string;
    isAssigned: boolean;
}
