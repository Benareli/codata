export class Product {
	id?: any;
	sku?: string;
	name?: string;
	description?: string;
	barcode?: string;
	bund?: boolean;
	prod?: boolean;
	nosell?: boolean;
	image?: string;
    listprice?: number;
    botprice?: number;
    cost?: number;
    min?: number;
    max?: number;
    supplier?: any;
    isStock?: boolean;
	active?: boolean;
	productcat_id?: number;
	productcats?: any;
	brand_id?: number;
	brands?: any;
	uom_id?: number;
	uoms?: any;
	puom_id?: number;
	puoms?: any;
	tax_id?: number;
	taxs?: any;
	taxout_id?: number;
	taxouts?: any;

	categoryName?: string;
	brandName?: string;
	suomName?: string;
	suom?: any;
	puom?: any;
	category?: any;
	taxin?: any;
	taxout?: any;
	brand?: any;
}