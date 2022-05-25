import { Model } from "@shared/models/model";

export interface Document extends Model {
    name: string;
    path: string;
    extension: string;
} 