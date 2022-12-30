export class Sale {
	id?: any;
	sale_id?: string;
	date?: Date;
	expected?: Date;
	disc_type?: string;
	discount?: number;
	amount_untaxed?: number;
	amount_tax?: number;
	amount_total?: number;
	warehouse?: any;
	customer?: any;
	user?: any;
	delivery_state?: number;
	sale_detail?: string[];
	payment?: string[];
	paid?: number;
	open?: boolean;
}