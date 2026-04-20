import { Injectable, Signal } from '@angular/core';
import { Customers, DbService, Product, Reciepts, Sku } from '../services/db.service';

@Injectable({
  providedIn: 'root',
})
export class LocalDbService {
  constructor(private db: DbService) {}

  // =========================
  // SKU Repository
  // =========================
  readonly Sku = {
    suggestions: (query: string, limit: number = 10) =>
      this.db.skus.where('sku_code').startsWith(query).limit(limit).toArray(),

    getById: (id: string) => this.db.skus.get(id),

    getBySkuCode: (sku_code: string) => this.db.skus.where('sku_code').equals(sku_code).first(),

    insertBulk: (bulkSku: Sku[]) => this.db.skus.bulkPut(bulkSku),
    upsert : async (sku: Sku) => {
      const exist = await this.db.skus.where('sku_code').equals(sku.sku_code).first();      
      this.db.skus.put(sku , exist?.id)
    },
    prepareBulk: async (items: any[]): Promise<Sku[]> => {
      return Promise.all(
        items.map(async (item) => {
          const existingSku = await this.db.skus.where('sku_code').equals(item.Sku).first();

          return {
            id: existingSku?.id,
            product_id: existingSku?.product_id || item.product_id,
            price: item.Price,
            sku_code: item.Sku,
            tax: item.Tax,
            discount: item.Discount,
            created_at: existingSku?.created_at || new Date(),
            updated_at: new Date(),
          };
        }),
      );
    },
  };
  // =========================
  // Product Repository
  // =========================
  readonly Product = {
    store: (product: Product) => this.db.products.add(product),

    getById: (id: string) => this.db.products.get(id),
 upsert : async (product: Product) => {
      const exist = await this.db.products.where('name').equals(product.name).first();      
      this.db.products.put(product , exist?.id)
    },
    recent: (limit: number = 20) =>
      this.db.products.orderBy('created_at').reverse().limit(limit).toArray(),

    insertBulk: (productsToSave: Product[]) => this.db.products.bulkPut(productsToSave),
      getByName :(name:string) => this.db.products.where('name').equals(name).first()
  
  };

  // =========================
  // Customer Repository
  // =========================
  readonly Customer = {
    getByContact: (contact: string) => this.db.customers.where('contact').equals(contact).first(),

    suggestions: (query: string, limit: number = 10) =>
      this.db.customers.where('contact').startsWith(query).limit(limit).toArray(),

    store: (customer: Customers) => this.db.customers.add(customer),

    update: (id: string, customer: Partial<Customers>) => this.db.customers.update(id, customer),

    upsert: async (customer: Customers) => {
      const existing = await this.db.customers.where('contact').equals(customer.contact).first();

      if (existing) {
        customer.id = existing.id;
        await this.db.customers.put(customer);
        return existing.id;
      }

      return this.db.customers.add(customer);
    },
  };

  // =========================
  // Receipt Repository
  // =========================
  readonly Receipt = {
    store: (receipt: Reciepts) => this.db.receipts.add(receipt),

    getById: (id: string) => this.db.receipts.get(id),

    recent: (limit: number = 20) =>
      this.db.receipts.orderBy('created_at').reverse().limit(limit).toArray(),

   
  };

  // =========================
  // Combined Billing Save
  // =========================
  async saveBill(receipt: Reciepts, customer: Customers, bulkSku: Sku[]) {
    return this.db.transaction(
      'rw',
      this.db.receipts,
      this.db.customers,
      this.db.skus,
      async () => {
        await this.Receipt.store(receipt);
        await this.Customer.upsert(customer);
        await this.Sku.insertBulk(bulkSku);
      },
    );
  }
}
