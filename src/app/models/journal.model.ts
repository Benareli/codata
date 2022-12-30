export class Journal {
    id?: string;
    _id?: string;
	journal_id?: string;
    entries?: string[];
    payment?: string[];
    amount?: number;
    payments?: number;
    date?: Date;
    duedate?: Date;
    state?: number;
    type?: string;
    origin?: string;
    partner?: string;
    lock?: boolean;
}
