export class Possession {
	id?: any;
	session_id?: string;
    store?: string;
    time_open?: Date;
    time_close?: Date;
    shift?: number;
    user?: string;
    pos?: string[];
    payment?: string[];
    start_balance?: number;
    end_balance?: number;
    money_in?: number;
    money_out?: number;
    total_discount?: number;
    total_amount_untaxed?: number;
    total_amount_tax?: number;
    total_amount_total?: number;
    open?: boolean;
}
