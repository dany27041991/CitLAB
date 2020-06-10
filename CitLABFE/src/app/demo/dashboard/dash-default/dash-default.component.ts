import { Component, OnInit } from '@angular/core';
import { SupportChartData1} from './chart/support-chart-data-1';
import { SupportChartData2} from './chart/support-chart-data-2';
import { SeoChart1 } from './chart/seo-chart-1';
import { SeoChart2 } from './chart/seo-chart-2';
import { SeoChart3 } from './chart/seo-chart-3';
import { PowerCardChart1 } from './chart/power-card-chart-1';
import { PowerCardChart2 } from './chart/power-card-chart-2';
import {Observable} from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {CatalogService} from '../../../services/catalog.service';
import {PaperInterface} from '../../../interfaces/PaperInterface';
import {PaperInterfacePagination} from '../../../interfaces/PaperInterfacePagination';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-dash-default',
  templateUrl: './dash-default.component.html',
  styleUrls: ['./dash-default.component.scss']
})
export class DashDefaultComponent implements OnInit {
  public supportChartData1: any;
  public supportChartData2: any;
  public seoChartData1: any;
  public seoChartData2: any;
  public seoChartData3: any;
  public powerCardChartData1: any;
  public powerCardChartData2: any;

  public docsList: Array<PaperInterface>;
  public flagSearch = false;
  public flagError = false;
  public currentPage = 1;
  public itemsPerPage = 10;
  public total = 0;


  data = {
    json: [
      {
        "guid": "bc4c7a02-5379-4046-92be-12c67af4295a",
        "displayName": "Elentrix",
        "children": [
          "85d412c2-ebc1-4d56-96c9-7da433ac9bb2",
          "28aac445-83b1-464d-9695-a4157dab6eac"
        ]
      },
      {
        "guid": "097b8d7c-e0d3-483d-9770-cb5306f7801c",
        "displayName": "Insuron",
        "children": [
          "a2d8ec53-de45-4182-af74-58c27dc8c06c",
          "6ceb08e1-3da5-4532-a5d8-437fe714b685"
        ]
      },
      {
        "guid": "a2d8ec53-de45-4182-af74-58c27dc8c06c",
        "displayName": "Plasmox",
        "parentId": "097b8d7c-e0d3-483d-9770-cb5306f7801c",
        "children": [
          "c46390bf-31be-4cb6-b91c-15cd55031d32",
          "96ce37a7-3e3d-40b2-96e9-e887ff75a89b",
          "cd4498c4-0ea0-488b-8f58-135bd29e10fc"
        ]
      },
      {
        "guid": "6ceb08e1-3da5-4532-a5d8-437fe714b685",
        "displayName": "Earthwax",
        "parentId": "097b8d7c-e0d3-483d-9770-cb5306f7801c",
        "children": [
          "e36b619a-bfa0-4db8-aac2-e28f660324ad",
          "7ebeb305-d581-4500-85b6-e28a46610727",
          "d1a75547-d6eb-474c-ab71-b71f797b7010"
        ]
      },
      {
        "guid": "c46390bf-31be-4cb6-b91c-15cd55031d32",
        "displayName": "Savvy",
        "parentId": "a2d8ec53-de45-4182-af74-58c27dc8c06c",
        "children": [
          "95bc2be9-2f20-411e-a13f-0f03d0ff1aa4",
          "b6938a3a-8405-4b55-bd8a-d7f088c0b5a3"
        ]
      },
      {
        "guid": "96ce37a7-3e3d-40b2-96e9-e887ff75a89b",
        "displayName": "Zizzle",
        "parentId": "a2d8ec53-de45-4182-af74-58c27dc8c06c",
        "children": [
          "8b82a0b6-56bb-47fe-90e5-e1a107e90208",
          "0ec66087-442f-4663-84f6-f6f99cde0595",
          "7d3abeb6-f864-4b57-bc1a-ef1c4114a571"
        ]
      },
      {
        "guid": "cd4498c4-0ea0-488b-8f58-135bd29e10fc",
        "displayName": "Cubicide",
        "parentId": "a2d8ec53-de45-4182-af74-58c27dc8c06c",
        "children": [
          "bbf7794c-b6ad-4f2c-9a3a-28c3287bf049"
        ]
      },
      {
        "guid": "28aac445-83b1-464d-9695-a4157dab6eac",
        "displayName": "Cytrek",
        "parentId": "bc4c7a02-5379-4046-92be-12c67af4295a",
        "children": []
      },
      {
        "guid": "e36b619a-bfa0-4db8-aac2-e28f660324ad",
        "displayName": "Inventure",
        "parentId": "6ceb08e1-3da5-4532-a5d8-437fe714b685",
        "children": [
          "67e4fd2b-bdaf-47aa-bb2e-ed89a7a87db2"
        ]
      },
      {
        "guid": "7ebeb305-d581-4500-85b6-e28a46610727",
        "displayName": "Pyramia",
        "parentId": "6ceb08e1-3da5-4532-a5d8-437fe714b685",
        "children": [
          "e848a18c-b9ba-4cd1-a749-af89b2442666"
        ]
      },
      {
        "guid": "d1a75547-d6eb-474c-ab71-b71f797b7010",
        "displayName": "Apexia",
        "parentId": "6ceb08e1-3da5-4532-a5d8-437fe714b685",
        "children": []
      },
      {
        "guid": "95bc2be9-2f20-411e-a13f-0f03d0ff1aa4",
        "displayName": "Futurity",
        "parentId": "c46390bf-31be-4cb6-b91c-15cd55031d32",
        "children": []
      },
      {
        "guid": "b6938a3a-8405-4b55-bd8a-d7f088c0b5a3",
        "displayName": "Cytrak",
        "parentId": "c46390bf-31be-4cb6-b91c-15cd55031d32",
        "children": []
      },
      {
        "guid": "8b82a0b6-56bb-47fe-90e5-e1a107e90208",
        "displayName": "Zentury",
        "parentId": "96ce37a7-3e3d-40b2-96e9-e887ff75a89b",
        "children": []
      },
      {
        "guid": "0ec66087-442f-4663-84f6-f6f99cde0595",
        "displayName": "Unia",
        "parentId": "96ce37a7-3e3d-40b2-96e9-e887ff75a89b",
        "children": []
      },
      {
        "guid": "7d3abeb6-f864-4b57-bc1a-ef1c4114a571",
        "displayName": "Brainquil",
        "parentId": "96ce37a7-3e3d-40b2-96e9-e887ff75a89b",
        "children": []
      },
      {
        "guid": "bbf7794c-b6ad-4f2c-9a3a-28c3287bf049",
        "displayName": "Valpreal",
        "parentId": "cd4498c4-0ea0-488b-8f58-135bd29e10fc",
        "children": []
      },
      {
        "guid": "67e4fd2b-bdaf-47aa-bb2e-ed89a7a87db2",
        "displayName": "Tubesys",
        "parentId": "e36b619a-bfa0-4db8-aac2-e28f660324ad",
        "children": []
      },
      {
        "guid": "e848a18c-b9ba-4cd1-a749-af89b2442666",
        "displayName": "Kage",
        "parentId": "7ebeb305-d581-4500-85b6-e28a46610727",
        "children": []
      },
      {
        "guid": "85d412c2-ebc1-4d56-96c9-7da433ac9bb2",
        "displayName": "Asimiline",
        "parentId": "bc4c7a02-5379-4046-92be-12c67af4295a",
        "children": []
      }
    ],
    config: {
      nodeWidth: 200,
      nodeHeight: 100
    }
  }


  constructor(private auth: AuthService, private catalog: CatalogService, private SpinnerService: NgxSpinnerService) {
    this.supportChartData1 = SupportChartData1.supportChartData;
    this.supportChartData2 = SupportChartData2.supportChartData;
    this.seoChartData1 = SeoChart1.seoChartData;
    this.seoChartData2 = SeoChart2.seoChartData;
    this.seoChartData3 = SeoChart3.seoChartData;
    this.powerCardChartData1 = PowerCardChart1.powerCardChartData;
    this.powerCardChartData2 = PowerCardChart2.powerCardChartData;
  }

  ngOnInit() {
  }

  searchPub(text, page) {
    this.SpinnerService.show();
    text = 'ds'
    if (text) {
      if (!page) {
        page = 1;
      }
      this.flagSearch = true;
      this.catalog.searchPub('s', page).subscribe(
        (data) => {
          this.SpinnerService.hide();
          this.flagError = false;
          this.docsList = data.papers;
          this.currentPage = data.paginator.current_page;
          this.itemsPerPage = data.paginator.items_per_page;
          this.total = data.paginator.total;
        }, err => {
          this.SpinnerService.hide();
          this.flagError = true;
        }
      );
    }
  }

  checkValue(value) {
    if (!value) {
      return 'Not Present.';
    }
    return value;
  }
}
