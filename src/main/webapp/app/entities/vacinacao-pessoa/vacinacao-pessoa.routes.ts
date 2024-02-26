import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { VacinacaoPessoaComponent } from './list/vacinacao-pessoa.component';
import { VacinacaoPessoaDetailComponent } from './detail/vacinacao-pessoa-detail.component';
import { VacinacaoPessoaUpdateComponent } from './update/vacinacao-pessoa-update.component';
import VacinacaoPessoaResolve from './route/vacinacao-pessoa-routing-resolve.service';

const vacinacaoPessoaRoute: Routes = [
  {
    path: '',
    component: VacinacaoPessoaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VacinacaoPessoaDetailComponent,
    resolve: {
      vacinacaoPessoa: VacinacaoPessoaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VacinacaoPessoaUpdateComponent,
    resolve: {
      vacinacaoPessoa: VacinacaoPessoaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VacinacaoPessoaUpdateComponent,
    resolve: {
      vacinacaoPessoa: VacinacaoPessoaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default vacinacaoPessoaRoute;
