import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsComponent } from './news.component';
import { NewsRoutingModule } from './news-routing.module';
import { MaterialModule } from '../../modules/material.module';
import { SpinnerModule } from '../../components/spinner/spinner.module';

@NgModule({
  declarations: [NewsComponent],
  imports: [
    CommonModule,
    NewsRoutingModule,
    MaterialModule,
    SpinnerModule
  ]
})
export class NewsModule { }
