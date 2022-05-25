import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitByUpperCasePipe } from './split-by-upper-case.pipe';


@NgModule({
  declarations: [SplitByUpperCasePipe],
  imports: [
    CommonModule,
  ],
  exports: [
    SplitByUpperCasePipe
  ]
})
export class PipesModule { }
