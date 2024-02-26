import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVacinacaoPessoa } from '../vacinacao-pessoa.model';
import { VacinacaoPessoaService } from '../service/vacinacao-pessoa.service';

export const vacinacaoPessoaResolve = (route: ActivatedRouteSnapshot): Observable<null | IVacinacaoPessoa> => {
  const id = route.params['id'];
  if (id) {
    return inject(VacinacaoPessoaService)
      .find(id)
      .pipe(
        mergeMap((vacinacaoPessoa: HttpResponse<IVacinacaoPessoa>) => {
          if (vacinacaoPessoa.body) {
            return of(vacinacaoPessoa.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default vacinacaoPessoaResolve;
