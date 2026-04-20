import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { QRCodeComponent } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';
import {  Product, Sku } from '../../../core/services/db.service';
import * as XLSX from 'xlsx';

import { LocalDbService } from '../../../core/repositories/local.db.service';
import { read } from 'fs';
@Component({
  selector: 'app-qr-generator-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    QRCodeComponent,
    
],
  templateUrl:'./qr-generator-modal.html' ,
  styleUrl: './qr.generator.modal.css'

})
export class QrGeneratorModalComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<QrGeneratorModalComponent>);
  private localDb = inject(LocalDbService);

  qrForm = this.fb.group({
    productName: new FormControl('', [Validators.required]),
    sku_code: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    tax: new FormControl(15),
    discount: new FormControl(0)
  });

  qrData = signal('');
  fileName = signal('');
  fileSize = signal('');
  qrBulkData = signal<any[]>([]);
onSampleDownload(){
  window.open('/upload/sample.csv')
}
// Prepare Qr data to save in db 
// private prepareData(){
//   // console.log(this.qrBulkData());
  
//  const data = this.qrBulkData().reduce((acc , item) =>{
//   let exist = acc.product.find((p :any) => p.name == item.name)
//   if(!exist){
//     acc.product.push({name : item.name , category: item.category || 'General', is_active: true})
//   }
//       acc.sku.push({
//           price  : item .price,
//           sku_code : item .sku_code,
//           tax : item .tax,
//           discount : item .discount,
//       })
//       return acc;
//   }, {product : [] as any[] , sku : [] as any[]});
// return data
// }

// Generate printable html and store to db 
async printAllQRs() {
 const prepareData = await this.prepareBulk(this.qrBulkData());  
  await this.onSave(prepareData);

  // Select the table rows to ensure we keep data together
  const rows = document.querySelectorAll('tbody tr');
  
  if (rows.length === 0) {
    console.warn("No data found to print");
    return;
  }

  const printWindow = window.open('', '_blank', 'height=800,width=900');
  



  if (printWindow) {
      const html = this.getPrintBody(rows)
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
generateQRString(item : any){
  
    const { name, sku_code, price, tax = null, discount  =null } =item;
  if(!name ||  !sku_code  || !price){
    return ""
  }
  const qrString = `${name},${sku_code},${price}${tax ? ',' + tax : ''}${discount ? ',' + discount : ''}`;
  return qrString 
  
}
  onGenerate() {
    if (this.qrForm.invalid) return;

    const { productName, sku_code, price, tax, discount } = this.qrForm.value;
    const qrString = `${productName},${sku_code},${price}${tax ? ',' + tax : ''}${discount ? ',' + discount : ''}`;
    this.qrData.set(qrString);
  }
onFileUpload(event: any) {
  const file = event.target.files[0];
  const reader = new FileReader();

  if (file) {
    
    this.fileName.set(file.name);
    this.fileSize.set((file.size / 1024 ).toFixed(4)); 
    
    reader.onload = (e: any) => {
      const data = e.target.result;

      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json(worksheet);      
      this.qrBulkData.set(json);
      
      
    };

    reader.readAsArrayBuffer(file);
       
  }
}
// clear Attachements 
@ViewChild('fileInput') fileInput! : ElementRef<HTMLInputElement>;
removeAttach(){
  
  if(this.fileInput){
    this.fileInput.nativeElement.value  ='';

  }
  this.fileName.set('');
  this.fileSize.set('');
  this.qrBulkData.set([]);
}
// printable QR for one SKU
 async printQR() {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
        const div =  document.createElement('div');
      div.classList.add('qr-wrapper');
      const qrElement = document.querySelector('.qr-code-container')?.innerHTML || '';
      div.innerHTML = qrElement;      
      const form = this.qrForm.value;
      printWindow.document.write(`
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Code - ${form.productName}</title>
  <style>
    :root {
      --primary-color: #4f46e5;
      --text-main: #1f2937;
      --text-muted: #6b7280;
      --bg-color: #f3f4f6;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg-color);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    .card { 
      background: white;
      width: 100%;
      max-width: 450px; 
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      text-align: center;
    }

    .header {
      margin-bottom: 24px;
    }

    h1 { 
      font-size: 1.5rem;
      color: var(--text-main);
      margin-bottom: 4px;
    }

    .sku {
      display: block;
      font-size: 0.875rem;
      color: var(--primary-color);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .qr-wrapper {
      background: #fafafa;
      padding: 20px;
      border-radius: 12px;
      border: 1px dashed #e5e7eb;
      display: inline-block;
      margin: 0 auto;
    }

    /* Ensures the injected SVG/IMG is centered and responsive */
    .qr-wrapper svg, 
    .qr-wrapper img {
      display: block;
      margin: 0 auto;
      max-width: 100%;
      height: auto;
    }

    .footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #f3f4f6;
      color: var(--text-muted);
      font-size: 0.75rem;
    }

    @media print {
      body { background: white; padding: 0; }
      .card { 
        box-shadow: none; 
        border: none; 
        max-width: 100%; 
      }
      .no-print { display: none; }
    }
  </style>
</head>
<body>

  <div class="card">
    <header class="header">
      <span class="sku">SKU: ${form.sku_code}</span>
      <h1>${form.productName}</h1>
    </header>
    
    <div class="qr-wrapper">
      ${div.innerHTML}
    </div>
    
    <footer class="footer">
      <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    </footer>
  </div>

</body>
</html>
      `);
      printWindow.document.close();     
        const product : Product = {
          id : crypto.randomUUID(),
           name : form.productName ?? '' , 
            category : 'General'  ,
            is_active: true,   
                  created_at: new Date(),
                  updated_at: new Date()
        }
             
     await this.localDb.Product.upsert(product)
     const productExist  = await this.localDb.Product.getByName(form.productName || "")
   
        const sku : Sku = {
            product_id :productExist?.id, 
          price : form.price ?? 0, 
          sku_code : form.sku_code ??'' , 
          tax : form.tax ?? 15 , 
          discount : form.discount ?? 0 , 
          created_at: new Date(),
          updated_at: new Date()
        }
        await this.localDb.Sku.upsert(sku)
    
      setTimeout(() => printWindow.print(), 250);
    }
  }
// Store product and sku to db 
async onSave(data: any) {
  const skusData = data.sku || [];
  const productsData = data.product || [];

  let productMap = new Map<string, string>();

  //  PRODUCTS 
  if (productsData.length > 0) {
    const productsToSave: Product[] = await Promise.all(
      productsData.map(async (i: any) => {
        const existing = await this.localDb.Product.getByName(i.name);
        return {
          id: existing ? existing.id : crypto.randomUUID(),
          name: i.name,
          category: null,
          is_active: true,
          created_at: existing?.created_at || new Date(),
          updated_at: new Date()
        };
      })
    );

    await this.localDb.Product.insertBulk(productsToSave)

    productsToSave.forEach(p => {
      productMap.set(p.name, p.id!);
    });
  }

  //  SKUS 
  if (skusData.length > 0) {
    const skusToSave: Sku[] = await Promise.all(
      skusData.map(async (s: any) => {
        const result = await this.localDb.Sku.getBySkuCode(s.sku_code);      

        const associatedProductId = productMap.get(s.product_name);

        return {
          id: result?.id || crypto.randomUUID(),
          product_id: associatedProductId,
          price: s.price,
          sku_code: s.sku_code,
          tax: s.tax,
          discount: s.discount
        };
      })
    );

    await this.localDb.Sku.insertBulk(skusToSave);
  }
}
  onCancel() {
    this.dialogRef.close();
  }
  // generate print body
  private getPrintBody(rows : NodeListOf<Element>){
    let htmlContent = '';
      rows.forEach(row => {
    const qrHtml = row.querySelector('.table-qr-wrapper')?.innerHTML;
    const productName = row.querySelector('.p-name')?.textContent || 'Product';
    const sku = row.querySelector('.sku-text')?.textContent || '';

    if (qrHtml) {
      htmlContent += `
        <div class="label-card">
          <div class="qr-code">${qrHtml}</div>
          <div class="product-details">
            <div class="name">${productName}</div>
            <div class="sku">${sku}</div>
          </div>
        </div>`;
    }
  });
    return`
       <html>
        <head>
          <title>Print QR Labels</title>
          <style>
            * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            /* Grid Layout for Print */
            body { 
              display: grid; 
              grid-template-columns: repeat(4, 1fr); 
              gap: 15px; 
            }

            .label-card {
              border: 1px solid #eee;
              padding: 10px;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              page-break-inside: avoid;
              background: #fff;
            }

            .qr-code {
              width: 100%;
              display: flex;
              justify-content: center;
            }

            /* Fixes the "white space" issue in SVGs */
            svg, img { 
              display: block;
              width: 100px !important; 
              height: 100px !important; 
              margin: 0 auto;
            }

            .product-details {
              margin-top: 8px;
            }

            .name {
              font-size: 11px;
              font-weight: bold;
              color: #333;
              /* Truncate long names */
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .sku {
              font-size: 10px;
              color: #666;
              margin-top: 2px;
            }

            @media print {
              body { padding: 0; }
              .label-card { border: 1px solid #ddd; }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                window.close();
              }, 500); // Small delay to ensure SVGs render
            };
          </script>
        </body>
      </html>`
  }
     
  async prepareBulk (items: any[]): Promise<Product[]> {
     
        const data = items.reduce(
          (acc: any, item: any) => {
            let exist = acc.product.find((p: any) => p.name == item.name);
            if (!exist) {
              acc.product.push({
                name: item.name,
                category: item.category || 'General',
                is_active: true,
              });
            }
            acc.sku.push({
              price: item.price,
              sku_code: item.sku_code,
              tax: item.tax,
              discount: item.discount,
            });
            return acc;
          },
          { product: [] as any[], sku: [] as any[] },
        );
        return data;
      }
}

