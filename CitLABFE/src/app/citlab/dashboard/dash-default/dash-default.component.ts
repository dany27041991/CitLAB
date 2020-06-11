import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {CatalogService} from '../../../services/catalog.service';
import {PaperInterface} from '../../../interfaces/PaperInterface';
import {PaperInterfacePagination} from '../../../interfaces/PaperInterfacePagination';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal, ModalDismissReasons, NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-dash-default',
  templateUrl: './dash-default.component.html',
  styleUrls: ['./dash-default.component.scss']
})
export class DashDefaultComponent implements OnInit {
  public docsList: Array<PaperInterface>;
  public flagTree = false;
  public flagSearch = false;
  public flagError = false;
  public currentPage = 1;
  public itemsPerPage = 10;
  public total = 0;
  public closeResult = '';
  public titleTree = '';
  public model1: NgbDateStruct;
  public model2: NgbDateStruct;
  public textsearch = '';
  public flagButtonAdvancedSearch = true;
  public errorMessage = '';


  data = {
    json: [],
    config: {
      nodeWidth: 350,
      nodeHeight: 200
    }
  };

  constructor(private auth: AuthService, private catalog: CatalogService, private SpinnerService: NgxSpinnerService,
              private modalService: NgbModal, private calendar: NgbCalendar) {}

  ngOnInit() {
  }

  changeText(event: any) {
    this.textsearch = event.target.value;
  }

  compareDate(start, end) {
    this.flagButtonAdvancedSearch = true;
    if (start && end) {
      const startDate = new Date(start.year, start.month, start.day);
      const endDate = new Date(end.year, end.month, end.day)
      if (startDate > endDate) {
        this.errorMessage = 'The start date cannot be greater than the end date.';
        this.flagButtonAdvancedSearch = false;
      }
    }
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
          this.errorMessage = 'A problem has occurred. Try again. If the problem persists, contact the administration.';
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

  openTree(content, id, title) {
    this.SpinnerService.show();
    this.titleTree = title;
    this.catalog.treeDiagram(id).subscribe((data) => {
      this.flagTree = false;
      this.SpinnerService.hide();
      this.data.json = data;
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }, err => {
      this.SpinnerService.hide();
      this.errorMessage = 'A problem has occurred. Try again. If the problem persists, contact the administration.';
      this.flagTree = true;
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    });
  }

  advancedSearch(form: NgForm) {

  }

  openAdvancedSearch(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
