export class Stockrequest {
	id?: any;
	trans_id?: string;
	user?: string;
	product?: string;
	partner?: string;
	warehouse?: string;
	origin?: string;
    qin?: number;
    qout?: number;
    cost?: number;
    date?: Date;
    req?: boolean;
    totalLine?: number;
    totalQin?: number;
    totalQout?: number;
    user_id?: number;
    users?: any;
}
