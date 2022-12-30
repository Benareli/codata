export class Purchase {
	id?: any;
	purchase_id?: string;
	date?: Date;
	expected?: Date;
	disc_type?: string;
	discount?: number;
	amount_untaxed?: number;
	amount_tax?: number;
	amount_total?: number;
	warehouse?: any;
	supplier?: any;
	user?: any;
	delivery_state?: number;
	purchase_detail?: string[];
	payment?: string[];
	paid?: number;
	open?: boolean;
}
