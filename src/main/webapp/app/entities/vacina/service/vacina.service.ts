import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVacina, NewVacina } from '../vacina.model';

export type PartialUpdateVacina = Partial<IVacina> & Pick<IVacina, 'id'>;

type RestOf<T extends IVacina | NewVacina> = Omit<T, 'criado'> & {
  criado?: string | null;
};

export type RestVacina = RestOf<IVacina>;

export type NewRestVacina = RestOf<NewVacina>;

export type PartialUpdateRestVacina = RestOf<PartialUpdateVacina>;

export type EntityResponseType = HttpResponse<IVacina>;
export type EntityArrayResponseType = HttpResponse<IVacina[]>;

@Injectable({ providedIn: 'root' })
export class VacinaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vacinas');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(vacina: NewVacina): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacina);
    return this.http
      .post<RestVacina>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(vacina: IVacina): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacina);
    return this.http
      .put<RestVacina>(`${this.resourceUrl}/${this.getVacinaIdentifier(vacina)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(vacina: PartialUpdateVacina): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacina);
    return this.http
      .patch<RestVacina>(`${this.resourceUrl}/${this.getVacinaIdentifier(vacina)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVacina>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVacina[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVacinaIdentifier(vacina: Pick<IVacina, 'id'>): number {
    return vacina.id;
  }

  compareVacina(o1: Pick<IVacina, 'id'> | null, o2: Pick<IVacina, 'id'> | null): boolean {
    return o1 && o2 ? this.getVacinaIdentifier(o1) === this.getVacinaIdentifier(o2) : o1 === o2;
  }

  addVacinaToCollectionIfMissing<Type extends Pick<IVacina, 'id'>>(
    vacinaCollection: Type[],
    ...vacinasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vacinas: Type[] = vacinasToCheck.filter(isPresent);
    if (vacinas.length > 0) {
      const vacinaCollectionIdentifiers = vacinaCollection.map(vacinaItem => this.getVacinaIdentifier(vacinaItem)!);
      const vacinasToAdd = vacinas.filter(vacinaItem => {
        const vacinaIdentifier = this.getVacinaIdentifier(vacinaItem);
        if (vacinaCollectionIdentifiers.includes(vacinaIdentifier)) {
          return false;
        }
        vacinaCollectionIdentifiers.push(vacinaIdentifier);
        return true;
      });
      return [...vacinasToAdd, ...vacinaCollection];
    }
    return vacinaCollection;
  }

  protected convertDateFromClient<T extends IVacina | NewVacina | PartialUpdateVacina>(vacina: T): RestOf<T> {
    return {
      ...vacina,
      criado: vacina.criado?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restVacina: RestVacina): IVacina {
    return {
      ...restVacina,
      criado: restVacina.criado ? dayjs(restVacina.criado) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVacina>): HttpResponse<IVacina> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVacina[]>): HttpResponse<IVacina[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
