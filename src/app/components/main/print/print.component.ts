import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
//import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import jsPDF from 'jspdf';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['../../../style/main.sass']
})
export class PrintComponent implements OnInit {
  testing!: string;
  title!: string;
  printHead!: any;
  printDet!: any;
  //safeHtmlContent!: SafeHtml;

  constructor(
    public dialogRef: MatDialogRef<PrintComponent>,
    //private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}
  
  ngOnInit() {
    this.title = this.data[0];
    this.printHead = this.data[1];
    this.printDet = this.data[2];
    console.log(this.printHead);

    const htmlContent = `
      <div class="w-100 text-11 text-black flex flex-col">
        <h4 class="text-13 text-primary">Purchase Order ${this.printHead.purchase_id} </h4>
        <div class="w-100 flex flex-row">
          <div class="flex-50 text-left">
            <strong>Supplier</strong><br/>
            ${this.printHead.partners.name}<br/>
            ${this.printHead.partners.street}<br/>
            ${this.printHead.partners.street2}<br/>
            ${this.printHead.partners.city}, ${this.printHead.partners.state}<br/>
            ${this.printHead.partners.country}, ${this.printHead.partners.zip}
          </div>
          <div class="flex-50 text-right">
            <strong>Send to</strong>
          </div>
        </div>
      </div>
    `;
    //this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }

  exportToPDF() {
    /*const element = document.getElementById('print'); // replace 'print' with the ID of your <div> element
    if (element) {
      const pdf = new jsPDF();
      pdf.html(element, {
        callback: function () {
          pdf.save('invoice.pdf'); // replace 'invoice.pdf' with the desired filename for the exported PDF
        }
      });
    }*/
  }
}