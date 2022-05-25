import { Model } from '@shared/models/model';
import { ManpowerType } from 'src/app/models/common/types/manpowertype';

export interface ManpowerToShift extends Model {
    shiftCode: string;
    shiftName: string;
    shiftId: number;
    manpowerType: ManpowerType;
    manpowerName: string;
    manpowerCode: string;
    manpowerCategoryCode: string;
    ManpowerCategoryName: string;
    remarks: string;
    numberOfManpower?: number;
}
