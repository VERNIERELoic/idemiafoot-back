import { User } from "src/users/user.entity";

export type FriendRequest_status = 'pending' | 'accepted' | 'declined';

export interface FriendRequestStatus {
    status?: FriendRequest_status;
}

export interface FriendRequest {
    id?: number;
    creator?: User;
    receiver?: User;
    status?: FriendRequest_status;
}