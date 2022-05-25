import { Model } from '@shared/models/model';

export interface Plant extends Model {
    plantCode:string;
    plantName:string;
    branchId:number;
    branchName:string;
    plantAddressId:number;
    plantAddress:string;
    plantManagerId:number;
    plantManager:string;
    description:string;
    isAssigned :boolean; 
}