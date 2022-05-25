import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './shared/layout/main/main.component';
import { LayoutModule } from './shared/layout/layout.module';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'settings/company/general', pathMatch: 'full'
      },
      {
        path: 'settings/work-centers',
        loadChildren: () => import('./features/settings/work-centers/work-centers.module').then(m => m.WorkCentersModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'settings/plant',
        loadChildren: () => import('./features/settings/plant/plant.module').then(m => m.PlantModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'settings/man-power',
        loadChildren: () => import('./features/settings/man-power/man-power.module').then(m => m.ManPowerModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'settings/category',
        loadChildren: () => import('./features/settings/man-power-category/man-power-category.module').then(m => m.ManPowerCategoryModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'settings/cost-price',
        loadChildren: () => import('./features/settings/cost-price/cost-price.module').then(m => m.CostPriceModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'settings/machine-workcenter',
        // tslint:disable-next-line: max-line-length
        loadChildren: () => import('./features/mapping/machine-work-center-mapping/machine-work-center-mapping.module').then(m => m.MachineWorkCenterMappingModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'mapping/manpower-workcenter-mapping',
        // tslint:disable-next-line: max-line-length
        loadChildren: () => import('./features/mapping/manpower-workcenter-mapping/manpower-workcenter-mapping.module').then(m => m.ManpowerWorkcenterMappingModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'mapping/cost-absorption-workcenter-mapping',
        // tslint:disable-next-line: max-line-length
        loadChildren: () => import('./features/mapping/work-center-cost-overhead-mapping/work-center-cost-overhead-mapping.module').then(m => m.WorkCenterCostOverheadMappingModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'routing/generic',
        // tslint:disable-next-line: max-line-length
        loadChildren: () => import('./features/routing/genericroutingmaster/genericroutingmaster.module').then(m => m.GenericroutingmasterModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'routing/production',
        loadChildren: () => import('./features/routing/productionrouting/productionrouting.module').then(m => m.ProductionroutingModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },

      {
        path: 'productionOrder/production-order-list',
        loadChildren: () => import('./features/productionorder/productionorder.module').then(m => m.ProductionorderModule),
        //   // canActivateChild: [AuthGuard],
        //   // data: { name: 'settings-work-centers'}
        // },
      },
      {
        path: 'bom/maintain-bom-list',
        loadChildren: () => import('./features/bom/bom.module').then(m => m.BomModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'eoc/eoc-list',
        loadChildren: () => import('./features/eoc/eoc.module').then(m => m.EocModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'settings/production-shift',
        loadChildren: () => import('./features/settings/production-shift/production-shift.module').then(m => m.ProductionShiftModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'settings/batch-control',
        loadChildren: () => import('./features/settings/batch-control/batch-control.module').then(m => m.BatchControlModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'settings/quality-control',
        loadChildren: () => import('./features/settings/qualitycontrol/qualitycontrol.module').then(m => m.QualitycontrolModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'settings/production-line',
        loadChildren: () => import('./features/settings/production-line/production-line.module').then(m => m.ProductionLineModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'mapping/manpower-shift-mapping',
        loadChildren: () => import('./features/mapping/manpower-shift-mapping/manpower-shift-mapping.module').then(m => m.ManpowerShiftMappingModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'materialissue/material-issue-container',
        loadChildren: () => import('./features/materialissue/materialissue.module').then(m => m.MaterialissueModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      },
      {
        path: 'release-to-production/release-production-list',
        loadChildren: () => import('./features/release-to-production/release-to-production.module').then(m => m.ReleaseToProductionModule),
        // canActivateChild: [AuthGuard],
        // data: { name: 'settings-work-centers'}
      }
    ]
  },
];

@NgModule({
  imports: [
    LayoutModule,
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
