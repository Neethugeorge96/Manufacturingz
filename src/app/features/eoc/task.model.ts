import { Model } from '@shared/models/model';
import { EOCMachine } from './machine-to-task.model';
import { EOCManpower } from './manpower-to-task.model';

export interface EOCTask extends Model {
    eocOperationId: number;
    taskCode: string;
    taskName: string;
    eocManpowerCollection: EOCManpower;
    eocMachineCollection: EOCMachine;
}
