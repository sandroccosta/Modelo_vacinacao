import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { FabricanteComponent } from './list/fabricante.component';
import { FabricanteDetailComponent } from './detail/fabricante-detail.component';
import { FabricanteUpdateComponent } from './update/fabricante-update.component';
import FabricanteResolve from './route/fabricante-routing-resolve.service';

const fabricanteRoute: Routes = [
  {
    path: '',
    component: FabricanteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FabricanteDetailComponent,
    resolve: {
      fabricante: FabricanteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FabricanteUpdateComponent,
    resolve: {
      fabricante: FabricanteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FabricanteUpdateComponent,
    resolve: {
      fabricante: FabricanteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default fabricanteRoute;
