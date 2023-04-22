import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import * as html2pdf from 'html2pdf.js';

import { PrintService } from 'src/app/services/settings/print.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['../../../style/main.sass']
})
export class PrintComponent implements OnInit {
  htmlContent!: SafeHtml;
  title!: string;
  printHead!: any;
  printDet!: any;
  filenum?: string;

  text?: string;

  constructor(
    public dialogRef: MatDialogRef<PrintComponent>,
    private sanitizer: DomSanitizer,
    private printService: PrintService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}
  
  ngOnInit() {
    this.title = this.data[0];
    
    const actionMap: { [key: string]: () => void } = {
      purchase: () => this.renderPurchase(),
      sale: () => this.renderSale(),
      invoice: () => this.renderInvoice(),
      bill: () => this.renderBill(),
    };
  
    const action = actionMap[this.data[0] as string];
    if (action) {
      action();
    } else {
      console.error('Invalid action:', this.data[0]);
    }
  }


  renderPurchase() {
    this.printHead = this.data[1];
    this.printDet = this.data[2];

    this.filenum = this.data[1].purchase_id;
    var poNum = this.data[1].purchase_id;
    var partnerName = this.data[1].partners.name;
    var partnerStreet = this.data[1].partners.street ? this.data[1].partners.street : '';
    var partnerStreet2 = this.data[1].partners.street2 ? this.data[1].partners.street2 : '';
    var partnerCity = this.data[1].partners.city ? this.data[1].partners.city : '';
    var partnerState = this.data[1].partners.state ? this.data[1].partners.state : '';
    var partnerCountry = this.data[1].partners.country ? this.data[1].partners.country : '';
    var partnerZip = this.data[1].partners.zip ? this.data[1].partners.zip : '';
    var compName = this.data[1].companys.comp_name;
    var compStreet = this.data[1].companys.street ? this.data[1].companys.street : '';
    var compStreet2 = this.data[1].companys.street2 ? this.data[1].companys.street2 : '';
    var compCity = this.data[1].companys.city ? this.data[1].companys.city : '';
    var compState = this.data[1].companys.state ? this.data[1].companys.state : '';
    var compCountry = this.data[1].companys.country ? this.data[1].companys.country : '';
    var compZip = this.data[1].companys.zip ? this.data[1].companys.zip : '';
    var date = this.data[1].date;
    var wh = this.data[1].warehouses.name;
    var products = '';
    var qtys = '';
    var uoms = '';
    var priceUnits = '';
    var discs = '';
    var taxs = '';
    var subtotals = '';
    for(let x=0; x<this.data[2].length; x++){
      products = products + this.data[2][x].products.name + '<br/>';
      qtys = qtys + this.data[2][x].qty + '<br/>';
      uoms = uoms + this.data[2][x].uoms.uom_name + '<br/>';
      priceUnits = priceUnits + this.thousandDecimal(this.data[2][x].price_unit) + '<br/>';
      discs = discs + (this.data[2][x].discount ? this.data[2][x].discount : '<br/>');
      taxs = taxs + (this.data[2][x].tax ? this.data[2][x].tax : '<br/>');
      subtotals = subtotals + this.thousandDecimal(this.data[2][x].subtotal) + '<br/>';
    }
    var totalTax = this.data[1].amount_tax ? this.thousandDecimal(this.data[1].amount_tax) : '';
    var totalUntaxed = this.data[1].amount_untaxed ? this.thousandDecimal(this.data[1].amount_untaxed) : '';
    var total = this.data[1].amount_total ? this.thousandDecimal(this.data[1].amount_total) : '';

    this.printService.getByDet(this.data[0], localStorage.getItem("comp"))
      .subscribe(prints => {
        const evaluated = eval(prints.template);
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(evaluated);
      })
  }

  renderSale() {
    this.printHead = this.data[1];
    this.printDet = this.data[2];

    this.filenum = this.data[1].sale_id;
    var soNum = this.data[1].sale_id;
    var partnerName = this.data[1].partners.name;
    var partnerStreet = this.data[1].partners.street ? this.data[1].partners.street : '';
    var partnerStreet2 = this.data[1].partners.street2 ? this.data[1].partners.street2 : '';
    var partnerCity = this.data[1].partners.city ? this.data[1].partners.city : '';
    var partnerState = this.data[1].partners.state ? this.data[1].partners.state : '';
    var partnerCountry = this.data[1].partners.country ? this.data[1].partners.country : '';
    var partnerZip = this.data[1].partners.zip ? this.data[1].partners.zip : '';
    var compName = this.data[1].companys.comp_name;
    var compStreet = this.data[1].companys.street ? this.data[1].companys.street : '';
    var compStreet2 = this.data[1].companys.street2 ? this.data[1].companys.street2 : '';
    var compCity = this.data[1].companys.city ? this.data[1].companys.city : '';
    var compState = this.data[1].companys.state ? this.data[1].companys.state : '';
    var compCountry = this.data[1].companys.country ? this.data[1].companys.country : '';
    var compZip = this.data[1].companys.zip ? this.data[1].companys.zip : '';
    var date = this.data[1].date;
    var wh = this.data[1].warehouses.name;
    var products = '';
    var qtys = '';
    var uoms = '';
    var priceUnits = '';
    var discs = '';
    var taxs = '';
    var subtotals = '';
    for(let x=0; x<this.data[2].length; x++){
      products = products + this.data[2][x].products.name + '<br/>';
      qtys = qtys + this.data[2][x].qty + '<br/>';
      uoms = uoms + this.data[2][x].uoms.uom_name + '<br/>';
      priceUnits = priceUnits + this.thousandDecimal(this.data[2][x].price_unit) + '<br/>';
      discs = discs + (this.data[2][x].discount ? this.data[2][x].discount : '<br/>');
      taxs = taxs + (this.data[2][x].tax ? this.data[2][x].tax : '<br/>');
      subtotals = subtotals + this.thousandDecimal(this.data[2][x].subtotal) + '<br/>';
    }
    var totalTax = this.data[1].amount_tax ? this.thousandDecimal(this.data[1].amount_tax) : '';
    var totalUntaxed = this.data[1].amount_untaxed ? this.thousandDecimal(this.data[1].amount_untaxed) : '';
    var total = this.data[1].amount_total ? this.thousandDecimal(this.data[1].amount_total) : '';

    this.printService.getByDet(this.data[0], localStorage.getItem("comp"))
      .subscribe(prints => {
        const evaluated = eval(prints.template);
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(evaluated);
      })
  }

  renderInvoice() {
    this.printHead = this.data[1];
    this.printDet = this.data[2];

    this.filenum = this.data[1].invoice_id;
    var invNum = this.data[1].invoice_id;
    var partnerName = this.data[1].partners.name;
    var partnerStreet = this.data[1].partners.street ? this.data[1].partners.street : '';
    var partnerStreet2 = this.data[1].partners.street2 ? this.data[1].partners.street2 : '';
    var partnerCity = this.data[1].partners.city ? this.data[1].partners.city : '';
    var partnerState = this.data[1].partners.state ? this.data[1].partners.state : '';
    var partnerCountry = this.data[1].partners.country ? this.data[1].partners.country : '';
    var partnerZip = this.data[1].partners.zip ? this.data[1].partners.zip : '';
    var compName = this.data[1].companys.comp_name;
    var compStreet = this.data[1].companys.street ? this.data[1].companys.street : '';
    var compStreet2 = this.data[1].companys.street2 ? this.data[1].companys.street2 : '';
    var compCity = this.data[1].companys.city ? this.data[1].companys.city : '';
    var compState = this.data[1].companys.state ? this.data[1].companys.state : '';
    var compCountry = this.data[1].companys.country ? this.data[1].companys.country : '';
    var compZip = this.data[1].companys.zip ? this.data[1].companys.zip : '';
    var date = this.data[1].date;
    var duedate = this.data[1].duedate;
    var products = '';
    var qtys = '';
    var uoms = '';
    var priceUnits = '';
    var discs = '';
    var taxs = '';
    var subtotals = '';
    for(let x=0; x<this.data[2].length; x++){
      products = products + this.data[2][x].products.name + '<br/>';
      qtys = qtys + this.data[2][x].qty + '<br/>';
      uoms = uoms + this.data[2][x].uoms.uom_name + '<br/>';
      priceUnits = priceUnits + this.thousandDecimal(this.data[2][x].price_unit) + '<br/>';
      discs = discs + (this.data[2][x].discount ? this.data[2][x].discount : '<br/>');
      taxs = taxs + (this.data[2][x].tax ? this.data[2][x].tax : '<br/>');
      subtotals = subtotals + this.thousandDecimal(this.data[2][x].subtotal) + '<br/>';
    }
    var totalTax = this.data[1].totalTax ? this.thousandDecimal(this.data[1].totalTax) : '';
    var totalDisc = this.data[1].totalDisc ? this.thousandDecimal(this.data[1].totalDisc) : '';
    var totalUntaxed = this.data[1].totalUntaxed ? this.thousandDecimal(this.data[1].totalUntaxed) : '';
    var total = this.data[1].total ? this.thousandDecimal(this.data[1].total) : '';

    this.printService.getByDet(this.data[0], localStorage.getItem("comp"))
      .subscribe(prints => {
        const evaluated = eval(prints.template);
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(evaluated);
      })
  }

  renderBill() {
    this.printHead = this.data[1];
    this.printDet = this.data[2];

    this.filenum = this.data[1].bill_id;
    var billNum = this.data[1].bill_id;
    var partnerName = this.data[1].partners.name;
    var partnerStreet = this.data[1].partners.street ? this.data[1].partners.street : '';
    var partnerStreet2 = this.data[1].partners.street2 ? this.data[1].partners.street2 : '';
    var partnerCity = this.data[1].partners.city ? this.data[1].partners.city : '';
    var partnerState = this.data[1].partners.state ? this.data[1].partners.state : '';
    var partnerCountry = this.data[1].partners.country ? this.data[1].partners.country : '';
    var partnerZip = this.data[1].partners.zip ? this.data[1].partners.zip : '';
    var compName = this.data[1].companys.comp_name;
    var compStreet = this.data[1].companys.street ? this.data[1].companys.street : '';
    var compStreet2 = this.data[1].companys.street2 ? this.data[1].companys.street2 : '';
    var compCity = this.data[1].companys.city ? this.data[1].companys.city : '';
    var compState = this.data[1].companys.state ? this.data[1].companys.state : '';
    var compCountry = this.data[1].companys.country ? this.data[1].companys.country : '';
    var compZip = this.data[1].companys.zip ? this.data[1].companys.zip : '';
    var date = this.data[1].date;
    var duedate = this.data[1].duedate;
    var products = '';
    var qtys = '';
    var uoms = '';
    var priceUnits = '';
    var discs = '';
    var taxs = '';
    var subtotals = '';
    for(let x=0; x<this.data[2].length; x++){
      products = products + this.data[2][x].products.name + '<br/>';
      qtys = qtys + this.data[2][x].qty + '<br/>';
      uoms = uoms + this.data[2][x].uoms.uom_name + '<br/>';
      priceUnits = priceUnits + this.thousandDecimal(this.data[2][x].price_unit) + '<br/>';
      discs = discs + (this.data[2][x].discount ? this.data[2][x].discount : '<br/>');
      taxs = taxs + (this.data[2][x].tax ? this.data[2][x].tax : '<br/>');
      subtotals = subtotals + this.thousandDecimal(this.data[2][x].subtotal) + '<br/>';
    }
    var totalTax = this.data[1].totalTax ? this.thousandDecimal(this.data[1].totalTax) : '';
    var totalDisc = this.data[1].totalDisc ? this.thousandDecimal(this.data[1].totalDisc) : '';
    var totalUntaxed = this.data[1].totalUntaxed ? this.thousandDecimal(this.data[1].totalUntaxed) : '';
    var total = this.data[1].total ? this.thousandDecimal(this.data[1].total) : '';

    this.printService.getByDet(this.data[0], localStorage.getItem("comp"))
      .subscribe(prints => {
        const evaluated = eval(prints.template);
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(evaluated);
      })
  }

  thousandDecimal(number: number): string {
    return number.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  exportToPDF() {
    const element = document.getElementById('print');
    if (element) {
      /*const pdf = new jsPDF();
      pdf.html(element, {
        callback: function () {
          pdf.save('invoice.pdf');
        }
      });*/

      //This one Works
      const options = {
        filename: this.data[0] + "-" + this.filenum + '.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };
  
      html2pdf().from(element).set(options).save();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}