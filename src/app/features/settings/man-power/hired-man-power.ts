import { Model } from '@shared/models/model';

export interface HiredManPower extends Model {
    manpowerName: string;
    manPowerId: string;
    manpowerType: number;
    email: string;
    phone: string;
    remarks: string;
}
