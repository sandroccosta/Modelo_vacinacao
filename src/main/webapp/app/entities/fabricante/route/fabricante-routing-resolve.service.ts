import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFabricante } from '../fabricante.model';
import { FabricanteService } from '../service/fabricante.service';

export const fabricanteResolve = (route: ActivatedRouteSnapshot): Observable<null | IFabricante> => {
  const id = route.params['id'];
  if (id) {
    return inject(FabricanteService)
      .find(id)
      .pipe(
        mergeMap((fabricante: HttpResponse<IFabricante>) => {
          if (fabricante.body) {
            return of(fabricante.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default fabricanteResolve;
