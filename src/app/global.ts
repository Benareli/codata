import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Injectable({providedIn: 'root'})

export class Globals{
    username?: string;
    userid?: string;
    roles?: string[];
    isPOS?: boolean;
    cost_general?: boolean;
    pos_shift?: boolean;
    pos_open?: boolean;
    pos_session?: string;
    pos_session_id?: string;
    product_global?: Product[];
}