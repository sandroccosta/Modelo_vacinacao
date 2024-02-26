import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { DoencaComponent } from './list/doenca.component';
import { DoencaDetailComponent } from './detail/doenca-detail.component';
import { DoencaUpdateComponent } from './update/doenca-update.component';
import DoencaResolve from './route/doenca-routing-resolve.service';

const doencaRoute: Routes = [
  {
    path: '',
    component: DoencaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DoencaDetailComponent,
    resolve: {
      doenca: DoencaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DoencaUpdateComponent,
    resolve: {
      doenca: DoencaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DoencaUpdateComponent,
    resolve: {
      doenca: DoencaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default doencaRoute;
