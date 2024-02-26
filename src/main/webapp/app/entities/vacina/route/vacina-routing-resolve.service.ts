import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVacina } from '../vacina.model';
import { VacinaService } from '../service/vacina.service';

export const vacinaResolve = (route: ActivatedRouteSnapshot): Observable<null | IVacina> => {
  const id = route.params['id'];
  if (id) {
    return inject(VacinaService)
      .find(id)
      .pipe(
        mergeMap((vacina: HttpResponse<IVacina>) => {
          if (vacina.body) {
            return of(vacina.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default vacinaResolve;
