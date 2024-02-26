import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDoenca } from '../doenca.model';
import { DoencaService } from '../service/doenca.service';

export const doencaResolve = (route: ActivatedRouteSnapshot): Observable<null | IDoenca> => {
  const id = route.params['id'];
  if (id) {
    return inject(DoencaService)
      .find(id)
      .pipe(
        mergeMap((doenca: HttpResponse<IDoenca>) => {
          if (doenca.body) {
            return of(doenca.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default doencaResolve;
