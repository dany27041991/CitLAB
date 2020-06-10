import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashDefaultRoutingModule } from './dash-default-routing.module';
import { DashDefaultComponent } from './dash-default.component';
import {SharedModule} from '../../../theme/shared/shared.module';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {CatalogService} from '../../../services/catalog.service';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxSpinnerModule} from 'ngx-spinner';
import {TreeDiagramModule} from 'angular2-tree-diagram';

@NgModule({
  declarations: [DashDefaultComponent],
  imports: [
    CommonModule,
    DashDefaultRoutingModule,
    SharedModule,
    NgbDropdownModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    TreeDiagramModule
  ],
  providers: [CatalogService],
})
export class DashDefaultModule { }
