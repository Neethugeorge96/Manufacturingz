
import { Model } from '@shared/models/model';
import { Days } from 'src/app/models/common/types/days';

export interface ProductionShift extends Model {
    shiftCode: string;
    shiftName: string;
    shiftDurationInDays: number;
    shiftStartDay: Days;
    noOfBreaks: number;
    breakDurationInMinute: number;
    startTime: string;
    endTime: string;
    shiftTotalTime: number;
    isOverTimeRequired: boolean;
    minimumOverTimeHour: number;
    timeBeyondShiftHour: number;
    remarks: string;
    isAssigned: boolean;
}