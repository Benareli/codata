export class Ticket {
	_id?: string;
	id?: string;
	ticketid?: string;
    fullname?: string;
    message?: string;
    phone?: string;
    email?: string;
    date_submitted?: Date;
    date_expected?: Date;
    date_closed?: Date;
    stage?: number; //0 Open, 1 Handle, 2 Pending, 3 Done
    asignee?: string[];
}
