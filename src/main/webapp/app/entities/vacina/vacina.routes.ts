import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { VacinaComponent } from './list/vacina.component';
import { VacinaDetailComponent } from './detail/vacina-detail.component';
import { VacinaUpdateComponent } from './update/vacina-update.component';
import VacinaResolve from './route/vacina-routing-resolve.service';

const vacinaRoute: Routes = [
  {
    path: '',
    component: VacinaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VacinaDetailComponent,
    resolve: {
      vacina: VacinaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VacinaUpdateComponent,
    resolve: {
      vacina: VacinaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VacinaUpdateComponent,
    resolve: {
      vacina: VacinaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default vacinaRoute;
