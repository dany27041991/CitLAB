import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {CatalogService} from '../../../services/catalog.service';
import {PaperInterface} from '../../../interfaces/PaperInterface';
import {PaperInterfacePagination} from '../../../interfaces/PaperInterfacePagination';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal, ModalDismissReasons, NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import * as sw from 'stopword';

@Component({
  selector: 'app-dash-default',
  templateUrl: './dash-default.component.html',
  encapsulation: ViewEncapsulation.None,
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
  public date: {year: number, month: number};
  public textsearch = '';
  public flagButtonAdvancedSearch = true;
  public errorMessage = '';
  public lastTypeSearch = null;
  public lastTextSearch = null;
  public lastAdvancedSearch = {
    alw: '',
    ap: '',
    aw: '',
    dp1: null,
    dp2: null,
    rap: '',
    raw: '',
    waf: '',
    wtw: '',
  };


  data = {
    json: [],
    config: {
      nodeWidth: 350,
      nodeHeight: 200
    }
  };

  isConnected = false;
  status: string;

  constructor(private auth: AuthService, private catalog: CatalogService, private SpinnerService: NgxSpinnerService,
              private modalService: NgbModal, private calendar: NgbCalendar, private cd: ChangeDetectorRef) {
    this.isConnected = false;
  }

  ngOnInit() {
    /*this.catalog.isAvailable().then(() => {
      this.status = 'OK';
      this.isConnected = true;
    }, error => {
      this.status = 'ERROR';
      this.isConnected = false;
      console.error('Server is down', error);
    }).then(() => {
      this.cd.detectChanges();
    });*/
  }

  changeText(event: any) {
    this.textsearch = event.target.value;
    this.currentPage = null;
  }

  compareDate(start, end) {
    this.flagButtonAdvancedSearch = true;
    if (start && end) {
      const startDate = new Date(start.year, start.month, start.day);
      const endDate = new Date(end.year, end.month, end.day);
      if (startDate > endDate) {
        this.errorMessage = 'The start date cannot be greater than the end date.';
        this.flagButtonAdvancedSearch = false;
      }
    }
  }

  selectToday() {
    return {year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDay()};
  }

  searchFullText(text, page) {
    if (text) {
      if (!page) {
        page = 1;
      }
      this.lastTextSearch = text;
      this.lastTypeSearch = 'ft';
      this.SpinnerService.show();
      this.flagSearch = true;
      this.catalog.searchFullText(text, this.itemsPerPage, page).then(response => {
        this.SpinnerService.hide();
        this.flagError = false;
        this.docsList = response.hits.hits;
        this.total = response.hits.total.value;
      }, error => {
        console.error(error);
        this.SpinnerService.hide();
      }).then(() => {
        console.log('Show Docs Completed!');
      });
    }
  }

  searchForKeywords(text, page) {
    if (text) {
      if (!page) {
        page = 1;
      }
      this.lastTextSearch = text;
      this.lastTypeSearch = 'ok';
      this.SpinnerService.show();
      this.flagSearch = true;
      this.catalog.searchForKeywords(this.rmStopWord(text), this.itemsPerPage, page).then(response => {
        this.SpinnerService.hide();
        this.flagError = false;
        this.docsList = response.hits.hits;
        this.total = response.hits.total.value;
      }, error => {
        console.error(error);
        this.SpinnerService.hide();
      }).then(() => {
        console.log('Show Docs Completed!');
      });
    }
  }

  advancedSearch(form: NgForm) {
    const queryobj = {
      alw: this.rmStopWord(form.value.alw),
      ap: this.checkIfExist(form.value.ap),
      aw: this.rmStopWord(form.value.aw),
      dp1: this.checkIfExistDate(form.value.dp1),
      dp2: this.checkIfExistDate(form.value.dp2),
      rap: this.checkIfExist(form.value.rap),
      raw: this.checkIfExist(form.value.raw),
      waf: this.checkIfExist(form.value.waf),
      wtw: this.rmStopWord(form.value.wtw),
    };
    if (queryobj.alw || queryobj.ap || queryobj.aw || queryobj.dp1 || queryobj.dp2 || queryobj.rap || queryobj.raw || queryobj.wtw) {
      this.SpinnerService.show();
      this.currentPage = 1;
      this.lastTypeSearch = 'as';
      this.flagSearch = true;
      this.catalog.searchAdvanced(queryobj, this.itemsPerPage, this.currentPage).then(response => {
        this.SpinnerService.hide();
        this.lastAdvancedSearch = queryobj;
        this.flagError = false;
        this.docsList = response.hits.hits;
        this.total = response.hits.total.value;
      }, error => {
        console.error(error);
        this.SpinnerService.hide();
      }).then(() => {
        console.log('Show Docs Completed!');
      });
    }
    this.modalService.dismissAll();
  }

  paginationSearch(page) {
    if (this.lastTypeSearch === 'ft') {
      this.SpinnerService.show();
      this.flagSearch = true;
      this.catalog.searchFullText(this.lastTextSearch, this.itemsPerPage, (page * this.itemsPerPage) - this.itemsPerPage + 1)
        .then(response => {
          this.SpinnerService.hide();
          this.flagError = false;
          this.docsList = response.hits.hits;
          this.total = response.hits.total.value;
        }, error => {
          console.error(error);
          this.SpinnerService.hide();
        }).then(() => {
        console.log('Show Docs Completed!');
      });
    }
    if (this.lastTypeSearch === 'ok') {
      this.SpinnerService.show();
      this.flagSearch = true;
      this.catalog.searchForKeywords(this.rmStopWord(this.lastTextSearch), this.itemsPerPage, (page * this.itemsPerPage) - this.itemsPerPage)
        .then(response => {
          this.SpinnerService.hide();
          this.flagError = false;
          this.docsList = response.hits.hits;
          this.total = response.hits.total.value;
        }, error => {
          console.error(error);
          this.SpinnerService.hide();
        }).then(() => {
        console.log('Show Docs Completed!');
      });
    }
    if (this.lastTypeSearch === 'as') {
      this.SpinnerService.show();
      const queryobj = {
        alw: this.lastAdvancedSearch.alw,
        ap: this.lastAdvancedSearch.ap,
        aw: this.lastAdvancedSearch.aw,
        dp1: this.lastAdvancedSearch.dp1,
        dp2: this.lastAdvancedSearch.dp2,
        rap: this.lastAdvancedSearch.rap,
        raw: this.lastAdvancedSearch.raw,
        waf: this.lastAdvancedSearch.waf,
        wtw: this.lastAdvancedSearch.wtw,
      };
      this.flagSearch = true;
      this.catalog.searchAdvanced(queryobj, this.itemsPerPage, (this.currentPage * this.itemsPerPage) - this.itemsPerPage + 1).then(response => {
        this.SpinnerService.hide();
        this.flagError = false;
        this.docsList = response.hits.hits;
        this.total = response.hits.total.value;
      }, error => {
        console.error(error);
        this.SpinnerService.hide();
      }).then(() => {
        console.log('Show Docs Completed!');
      });
    }
  }

  /*searchPub(text, page, type) {
      this.catalog.searchPub(obj, page).subscribe(
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
  }*/

  rmStopWord(text) {
    if (text) {
      let keywords = sw.removeStopwords(this.splitMulti(text, [' ', ',', ';', '|']));
      keywords = sw.removeStopwords(keywords, sw.it);
      return keywords.join(' ');
    }
    return '';
  }

  checkIfExist(value) {
    if (value) {
      return value;
    }
    return '';
  }

  checkIfExistDate(date) {
    if (date) {
      return date.year;
    }
    return null;
  }

  checkValue(value) {
    if (!value) {
      return 'Not Present.';
    }
    return value;
  }

  clearFilter() {
    this.lastAdvancedSearch = {
      alw: '',
      ap: '',
      aw: '',
      dp1: null,
      dp2: null,
      rap: '',
      raw: '',
      waf: '',
      wtw: '',
    };
    this.model1 = null;
    this.model2 = null;
  }

  openTree(content, id, title) {
    this.SpinnerService.show();
    this.titleTree = title;
    this.catalog.treeDiagram(id).subscribe((data) => {
      this.flagTree = false;
      this.SpinnerService.hide();
      this.data.json = data;
      this.modalService.open(content, {windowClass: 'modal-tree-class'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }, err => {
      this.SpinnerService.hide();
      this.errorMessage = 'A problem has occurred. Try again. If the problem persists, contact the administration.';
      this.flagTree = true;
      this.modalService.open(content, {windowClass: 'modal-tree-class'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    });
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

  splitMulti(str, tokens) {
    if (str) {
      const tempChar = tokens[0]; // We can use the first token as a temporary join character
      for (let i = 1; i < tokens.length; i++) {
        str = str.split(tokens[i]).join(tempChar);
      }
      str = str.split(tempChar);
      return str.filter(item => item);
    }
    return str;
  }
}
