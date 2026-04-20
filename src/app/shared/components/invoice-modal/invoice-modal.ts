import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { EmailValidator, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

// Material Imports
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatAnchor, MatButtonModule } from "@angular/material/button";
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardTitle, MatCardContent, MatCardSubtitle, MatCardHeader } from '@angular/material/card';
import { MatInput } from "@angular/material/input";
import { MatIcon } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';

// Custom & Third Party
import { ApiService } from '../../../api';
import { Customers, DbService, Reciepts, Sku } from '../../../core/services/db.service';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
// import html2pdf from 'html2pdf.js';
import {  MatListOption, MatSelectionList } from '@angular/material/list';
import { LocalDbService } from '../../../core/repositories/local.db.service';

@Component({
  selector: 'app-invoice-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAnchor,
    MatButtonModule,
    MatLabel,
    MatFormField,
    MatCard,
    MatInput,
    MatIcon,
    MatCheckboxModule,
    MatTabsModule,
    DatePipe,
    ZXingScannerModule,
    MatCardContent, 
    MatSelectionList,
    MatListOption,
    MatError,
TranslateModule
  ],
  templateUrl: './invoice-modal.html',
  styleUrl: './invoice-modal.css'
})
export class InvoiceModalComponent {
  // -------------------
  // Dependencies
  // -------------------
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private dialog = inject(MatDialog);
  private platformId = inject(PLATFORM_ID);
  private localDb = inject(LocalDbService);

  // -------------------
  // Signals & State
  // -------------------
  quickBilling = signal(false);
  showScanner = signal(false);
  scannedResult = signal('');
  scanStatusMessage = signal('');
  errorMessage = signal('');
  skuSuggestions = signal<Sku[]>([]);
  customerSuggestions = signal<Customers[]>([]);
  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice!: MediaDeviceInfo;
  showAdvancedFields = signal(false);

  // Helpers
  readonly today = new Date();
  readonly randomId = crypto.randomUUID();
  objectKeys = Object.keys;

  // -------------------
  // Forms
  // -------------------
  currentItem: FormGroup = this.createItem();
  form = this.fb.group({
    Name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    Contact: new FormControl('92', { nonNullable: true, validators: [
      Validators.required, Validators.maxLength(12), Validators.pattern(/^92[0-9]{10}$/)
    ]}),
    Email: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(50)] }),
    Items: this.fb.array([]),
    Total: new FormControl(0, { nonNullable: true }),
    QuickBilling: new FormControl(this.quickBilling(), { nonNullable: true })
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMsg());

    this.form.get('QuickBilling')?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe(val => this.quickBilling.set(!!val));

    const scanSound = new Audio('/success-chime.mp3');
    scanSound.load();
  }

  // -------------------
  // Form Getters
  // -------------------
  get items(): FormArray {
    return this.form.get('Items') as FormArray;
  }

  createItem(): FormGroup {
    const group = this.fb.group({
      Sku: new FormControl('', [Validators.required]),
      Price: new FormControl(0, [Validators.required]),
      Tax: new FormControl(15, [Validators.required]),
      Discount: new FormControl(0, [Validators.required]),
      Units: new FormControl(1, [Validators.required]),
      Total: new FormControl(0, [Validators.required])
    });

    group.valueChanges.subscribe(vals => {
      group.get('Total')?.setValue(
        this.calculateItemTotal(vals.Price , vals.Units, vals.Tax, vals.Discount),
        { emitEvent: false }
      );
    });

    return group;
  }

private calculateItemTotal(price: any, units: any, tax: any , discount: any): number {
    const p = Number(price) || 0;
    const u = Number(units) || 0;
    const t = Number(tax) || 0;
    const d = Number(discount) || 0;
    const subtotal = p * u;
    return subtotal + (subtotal * t / 100) - (subtotal * d / 100);
}

  updateFormTotal() {
    const total = this.items.controls.reduce((sum, item) => sum + (Number(item.get('Total')?.value) || 0), 0);
    this.form.get('Total')?.setValue(total, { emitEvent: false });
  }

  updateErrorMsg() {
    Object.keys(this.form.controls).forEach(key => {
      if (key === 'Items') return;
      const control = this.form.get(key);
      if (control?.hasError('required') && control.touched) {
        this.errorMessage.set(`${key} is required`);
      }
    });
  }

  // -------------------
  // Suggestions (via Repository)
  // -------------------
  async getCustomerSuggestions(contact?: string) {
    if (!contact) return this.customerSuggestions.set([]);
    const results = await this.localDb.Customer.suggestions(contact);
    this.customerSuggestions.set(results);
  }

  async getSkuSuggestions(sku?: string) {
    if (!sku) return this.skuSuggestions.set([]);
    const results = await this.localDb.Sku.suggestions(sku);
    this.skuSuggestions.set(results);
  }

  selectCustomer(person: Customers) {
    this.form.patchValue({ Name: person.name, Contact: person.contact });
    this.customerSuggestions.set([]);
  }

  selectSku(item: Sku) {
    this.currentItem.patchValue({ Sku: item.sku_code, Price: item.price, Tax: item.tax || 0, Discount: item.discount || 0 });
    this.skuSuggestions.set([]);
  }

  addItem() {
    if (this.currentItem.invalid || this.form.invalid) return this.currentItem.markAllAsTouched();

    const skuValue = this.currentItem.get('Sku')?.value;
    if (this.items.controls.some(item => item.get('Sku')?.value === skuValue)) {
      this.errorMessage.set(`SKU "${skuValue}" already added`);
      return;
    }

    this.items.push(this.currentItem);
    this.updateFormTotal();
    this.currentItem = this.createItem();
    this.errorMessage.set('');
  }

  removeItem(i: number) {
    this.items.removeAt(i);
    this.updateFormTotal();
  }

  resetAllItems() {
    this.items.clear();
    this.updateFormTotal();
  }

  // -------------------
  // Scanner Logic
  // -------------------
  toggleScanner() { this.showScanner.set(!this.showScanner()); }

  onScanSuccess(result: string) {
    const [product, sku, price, tax] = result.split(',');
    if (!sku || !price) return;

    this.currentItem.patchValue({ Sku: sku, Price: Number(price), Tax: Number(tax) || 15 });
    if (this.quickBilling()) this.addItem();

    this.scanStatusMessage.set(`${product} added`);
    const scanSound = new Audio('/success-chime.mp3');
    scanSound.play();
    setTimeout(() => { this.scanStatusMessage.set(''); scanSound.pause(); }, 1000);
  }

  onScanError(error: any) { this.scannedResult.set(error); }

  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
    this.selectedDevice = devices.find(d => /back|rear|environment/i.test(d.label)) || devices[0];
  }

  onCamerasNotFound() { this.scannedResult.set('Camera not found or permission denied'); }

  // -------------------
  // PDF & Print
  // -------------------
  private recieptStruc(): string {
    const original = document.querySelector('.receipt-paper');
    if (!original) return '';

    const clone = original.cloneNode(true) as HTMLElement;
    ['.remove-item', '.reset-all-btn', '.remove-on-print'].forEach(s =>
      clone.querySelectorAll(s).forEach(el => el.remove())
    );

    return `<style>
    <style>
      body { font-family: 'Courier New', Courier, monospace; padding:10px; background:#fff; color:#000; }
      .receipt-paper { max-width:400px; margin:0 auto; }
       
       /* Header Styles */
       .receipt-header { text-align: center; margin-bottom: 15px; }
       .store-name { font-size: 22px; font-weight: bold; margin: 0; }
       .store-address { font-size: 12px; margin: 5px 0; }
       .fbr-badge { border: 1px solid #000; display: inline-block; padding: 2px 8px; font-size: 11px; margin-top: 5px; }
 
       /* Dividers */
       .receipt-divider-dash { border-top: 1px dashed #000; margin: 10px 0; }
       .receipt-divider-solid { border-top: 1px solid #000; margin: 10px 0; }
 
       /* Info Section */
       .info-section { font-size: 13px; margin-bottom: 10px; }
       .info-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
       .label { font-weight: bold; }
 
       /* Table Styles */
       table { width: 100%; border-collapse: collapse; font-size: 13px; }
       th { border-bottom: 1px solid #000; text-align: left; padding-bottom: 5px; }
       td { padding: 5px 0; vertical-align: top; }
       .text-center { text-align: center; }
       .text-right { text-align: right; }
 
       /* Totals */
       .total-section { font-size: 14px; }
       .total-row { display: flex; justify-content: space-between; margin: 3px 0; }
       .grand-total { font-weight: bold; font-size: 16px; margin-top: 5px; border-top: 1px double #000; padding-top: 5px; }
 
       /* Footer */
       .receipt-footer { text-align: center; margin-top: 20px; font-size: 12px; }
       .barcode-mock { font-size: 20px; letter-spacing: 2px; margin-top: 10px; }
     </style>
  ${clone.innerHTML}`;
  }

  printPDF() {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;
    printWindow.document.write(this.recieptStruc());
    printWindow.document.close();
    printWindow.print();
  }

  // -------------------
  // Generate Bill (with LocalDbService)
  // -------------------
  async onGenerateBill() {
    if (this.form.invalid || this.items.length === 0) return;

    const html = this.recieptStruc();
    const name = `Invoice-${this.randomId}.pdf`;

    if (!isPlatformBrowser(this.platformId)) return;

    const div = document.createElement('body');
    div.classList.add('receipt-paper');
    div.innerHTML = html;

    const html2pdf = (await import('html2pdf.js')).default;
    const pdfBlob = await html2pdf().set({
      html2canvas: { scale: 2, logging: true, backgroundColor: '#fff' },
      margin: 10, filename: name
    }).from(div).outputPdf('blob');

    const formData = new FormData();
    formData.append('file', pdfBlob, name);

    const res: any = await this.apiService.uploadInvoice(formData).toPromise();

    if (!res?.url) return window.alert('Invoice upload failed');

    const formValues = this.form.getRawValue();
    const receipt: Reciepts = {
      id: this.randomId,
      name: formValues.Name,
      is_active: true,
      type: 'sale',
      items: formValues.Items,
      url: res.url,
      total_items: formValues.Items?.length,
      grand_total: formValues.Total,
      contact: formValues.Contact,
      created_at: new Date(),
      updated_at: new Date()
    };

    const customer: Customers = {
      name: formValues.Name,
      contact: formValues.Contact,
      email: formValues.Email,
      type: 'consumer',
      last_shop_at: new Date(),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    };

    const bulkSku = await this.localDb.Sku.prepareBulk(formValues.Items);

    await this.localDb.saveBill(receipt, customer, bulkSku);

    // Optionally open WhatsApp
    const phoneNumber = '923422711773';
    const text = encodeURIComponent('Here is your invoice: ' + res.url);
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  }

  // -------------------
  // Close modal
  // -------------------
  closeSlip() { this.dialog.closeAll(); }
  
}