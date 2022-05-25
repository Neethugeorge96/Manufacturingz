import { Model } from '@shared/models/model';
import { ManpowerType } from 'src/app/models/common/types/manpowertype';

export interface OwnManPower extends Model {
    manpowerId: string;
    manpowerCategoryId: number;
    manpowerType: ManpowerType
    manpowerName: string;
    email: string;
    phone: string;
    remarks: string;
}

export interface ManpowerToWorkCenter extends Model {
    id: number;
    workCenterId: number;
    manpowerId: number;
    manpowerType: ManpowerType
    manpowerCategoryId:number;
    manpowerCategoryCode: string;
    manpowerCategoryName: string;
    manpowerName: string;
    manpowerCode: string;
    budgetedCostPerHour: number;
    budgetedCostCurrencyCode: string;
    actualCostPerHour: number;
    actualCostCurrencyCode: string;
    remarks: string;
    isValid: boolean;
}