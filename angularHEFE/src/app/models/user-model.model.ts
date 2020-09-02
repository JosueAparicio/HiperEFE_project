import { Room } from './room';

export interface UserModel {
    uid?: string;
    email?: string;
    photoURL?: string;
    displayName?: string;
    date?: string;
    cuenta?: string;
    conocimiento?: string;
    rooms?: Array<Room>
    
}