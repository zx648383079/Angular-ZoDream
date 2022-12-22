import { IUser } from '../../theme/models/user';

export interface ICheckIn {
    id: number;
    created_at: string;
    running: number;
    type: number;
    user?: IUser;
}