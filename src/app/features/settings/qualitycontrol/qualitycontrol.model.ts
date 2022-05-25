import { Model } from '@shared/models/model';
import { QCType } from 'src/app/models/common/qualitycontrol';

export interface QualityControl extends Model
    {
        qcNumber: string;
        qcName: string;
        qcType: QCType;
        frequency: number;
        isCheckListRequired: boolean;
        isAssigned: boolean;
        remarks: string;


        
    }
