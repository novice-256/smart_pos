import Dexie, { Table } from 'dexie';
import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';

export interface User {
    id : string , 
    name : string  | "" , 
    email : string ,
    number : number | null , 
    last_login_at?: Date
    is_active: boolean,
    role: 'admin' | 'staff',
    created_at?: Date , 
    updated_at?: Date ,


}

export interface Customers {
    id? : string , 
    contact : string ,
    name : string   , 
    email : string | "",
    type?: "wholseller" | "retailer"  | "consumer",
    last_shop_at?: Date,
    is_active?: boolean,
    created_at?: Date , 
    updated_at?: Date ,


}
export interface Product {
    id : string , 
    name : string  , 
    category : string | null  ,
    description?: string 
    is_active: boolean | true,
    created_at?: Date,
    updated_at?: Date 

}
export interface Sku {
    id ?: string , 
    product_id? : string   , 
    price : number , 
    sku_code : string , 
    tax : number , 
    discount : number , 
    created_at?: Date,
    updated_at?: Date

}
export interface Reciepts {
id? : string , 
// sku_id : string  | "" , 
// email? : string ,
// user_id : string , 
// cost_price?: number,
name: string ,
is_active: boolean,
type : 'sale' | 'purchase'| 'return' | 'exchange' | 'adjustment' ,
items: any[],
url  : string,
total_items :number,
grand_total : number 
contact : string,
created_at: Date,
updated_at?: Date ,

}
@Injectable({ providedIn: 'root' })
export class DbService extends Dexie {

  users!: Table<User, string>;
  products!: Table<Product, string>;
  skus!: Table<Sku, string>;
  receipts!: Table<Reciepts, string>;
  customers!: Table<Customers, string>;

  constructor() {
    super('db_smart_invoice');

    this.version(1).stores({
      users: 'id,email',
      products: '++id,category,&name,is_active',  
      skus: '++id,product_id,&sku_code',
      receipts: '++id,user_id,receipt_id,created_at,type',
      customers: '++id,type,&contact'
    });

    this.setupHooks();
  }

  private setupHooks() {
    this.tables.forEach(table => {

      table.hook('creating', (_, obj: any) => {
        const now = new Date();
        obj.created_at ??= now;
        obj.updated_at = now;
      });

      table.hook('updating', (mods: any) => {
        mods.updated_at = new Date();
        return mods;
      });

    });
  }
}