import { Component, OnInit, ViewChild } from '@angular/core';
import { WebdatarocksComponent } from 'ng-webdatarocks';
import { BaseURL } from 'src/app/baseurl';

import { Pos } from 'src/app/models/pos.model';
import { PosService } from 'src/app/services/pos.service';
import { Posdetail } from 'src/app/models/posdetail.model';
import { PosdetailService } from 'src/app/services/posdetail.service';

@Component({
  selector: 'app-pos-report',
  templateUrl: './pos-report.component.html',
  styleUrls: ['./pos-report.component.sass']
})
export class PosReportComponent implements OnInit {
  @ViewChild('pivot1') child: WebdatarocksComponent;
  baseUrl = BaseURL.BASE_URL;
  posDetails?: Posdetail[];

  constructor(
    private posService: PosService,
    private posDetailService: PosdetailService,
  ) { }

  ngOnInit(): void {
    
  }

  onReportComplete(): void {
    this.posDetailService.report()
      .subscribe(pds => {
        //console.log(pds);
        this.posDetails = pds;
        this.child.webDataRocks.off('reportcomplete');
        this.child.webDataRocks.setReport({
          //dataSource: {
            //filename: ,
              //https://cdn.webdatarocks.com/reports/report.json
              //https://cdn.webdatarocks.com/data/data.json
          //},
          dataSource: {data:this.posDetails}
        });
      });
    
  }
}
