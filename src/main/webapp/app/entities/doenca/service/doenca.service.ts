import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDoenca, NewDoenca } from '../doenca.model';

export type PartialUpdateDoenca = Partial<IDoenca> & Pick<IDoenca, 'id'>;

type RestOf<T extends IDoenca | NewDoenca> = Omit<T, 'criado' | 'dataPrimeiroCaso' | 'localPrimeiroCaso'> & {
  criado?: string | null;
  dataPrimeiroCaso?: string | null;
  localPrimeiroCaso?: string | null;
};

export type RestDoenca = RestOf<IDoenca>;

export type NewRestDoenca = RestOf<NewDoenca>;

export type PartialUpdateRestDoenca = RestOf<PartialUpdateDoenca>;

export type EntityResponseType = HttpResponse<IDoenca>;
export type EntityArrayResponseType = HttpResponse<IDoenca[]>;

@Injectable({ providedIn: 'root' })
export class DoencaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/doencas');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(doenca: NewDoenca): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(doenca);
    return this.http
      .post<RestDoenca>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(doenca: IDoenca): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(doenca);
    return this.http
      .put<RestDoenca>(`${this.resourceUrl}/${this.getDoencaIdentifier(doenca)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(doenca: PartialUpdateDoenca): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(doenca);
    return this.http
      .patch<RestDoenca>(`${this.resourceUrl}/${this.getDoencaIdentifier(doenca)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestDoenca>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDoenca[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDoencaIdentifier(doenca: Pick<IDoenca, 'id'>): number {
    return doenca.id;
  }

  compareDoenca(o1: Pick<IDoenca, 'id'> | null, o2: Pick<IDoenca, 'id'> | null): boolean {
    return o1 && o2 ? this.getDoencaIdentifier(o1) === this.getDoencaIdentifier(o2) : o1 === o2;
  }

  addDoencaToCollectionIfMissing<Type extends Pick<IDoenca, 'id'>>(
    doencaCollection: Type[],
    ...doencasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const doencas: Type[] = doencasToCheck.filter(isPresent);
    if (doencas.length > 0) {
      const doencaCollectionIdentifiers = doencaCollection.map(doencaItem => this.getDoencaIdentifier(doencaItem)!);
      const doencasToAdd = doencas.filter(doencaItem => {
        const doencaIdentifier = this.getDoencaIdentifier(doencaItem);
        if (doencaCollectionIdentifiers.includes(doencaIdentifier)) {
          return false;
        }
        doencaCollectionIdentifiers.push(doencaIdentifier);
        return true;
      });
      return [...doencasToAdd, ...doencaCollection];
    }
    return doencaCollection;
  }

  protected convertDateFromClient<T extends IDoenca | NewDoenca | PartialUpdateDoenca>(doenca: T): RestOf<T> {
    return {
      ...doenca,
      criado: doenca.criado?.toJSON() ?? null,
      dataPrimeiroCaso: doenca.dataPrimeiroCaso?.format(DATE_FORMAT) ?? null,
      localPrimeiroCaso: doenca.localPrimeiroCaso?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restDoenca: RestDoenca): IDoenca {
    return {
      ...restDoenca,
      criado: restDoenca.criado ? dayjs(restDoenca.criado) : undefined,
      dataPrimeiroCaso: restDoenca.dataPrimeiroCaso ? dayjs(restDoenca.dataPrimeiroCaso) : undefined,
      localPrimeiroCaso: restDoenca.localPrimeiroCaso ? dayjs(restDoenca.localPrimeiroCaso) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDoenca>): HttpResponse<IDoenca> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDoenca[]>): HttpResponse<IDoenca[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
