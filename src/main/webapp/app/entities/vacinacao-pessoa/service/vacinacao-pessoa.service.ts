import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVacinacaoPessoa, NewVacinacaoPessoa } from '../vacinacao-pessoa.model';

export type PartialUpdateVacinacaoPessoa = Partial<IVacinacaoPessoa> & Pick<IVacinacaoPessoa, 'id'>;

type RestOf<T extends IVacinacaoPessoa | NewVacinacaoPessoa> = Omit<T, 'quando'> & {
  quando?: string | null;
};

export type RestVacinacaoPessoa = RestOf<IVacinacaoPessoa>;

export type NewRestVacinacaoPessoa = RestOf<NewVacinacaoPessoa>;

export type PartialUpdateRestVacinacaoPessoa = RestOf<PartialUpdateVacinacaoPessoa>;

export type EntityResponseType = HttpResponse<IVacinacaoPessoa>;
export type EntityArrayResponseType = HttpResponse<IVacinacaoPessoa[]>;

@Injectable({ providedIn: 'root' })
export class VacinacaoPessoaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vacinacao-pessoas');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(vacinacaoPessoa: NewVacinacaoPessoa): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacinacaoPessoa);
    return this.http
      .post<RestVacinacaoPessoa>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(vacinacaoPessoa: IVacinacaoPessoa): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacinacaoPessoa);
    return this.http
      .put<RestVacinacaoPessoa>(`${this.resourceUrl}/${this.getVacinacaoPessoaIdentifier(vacinacaoPessoa)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(vacinacaoPessoa: PartialUpdateVacinacaoPessoa): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacinacaoPessoa);
    return this.http
      .patch<RestVacinacaoPessoa>(`${this.resourceUrl}/${this.getVacinacaoPessoaIdentifier(vacinacaoPessoa)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVacinacaoPessoa>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVacinacaoPessoa[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVacinacaoPessoaIdentifier(vacinacaoPessoa: Pick<IVacinacaoPessoa, 'id'>): number {
    return vacinacaoPessoa.id;
  }

  compareVacinacaoPessoa(o1: Pick<IVacinacaoPessoa, 'id'> | null, o2: Pick<IVacinacaoPessoa, 'id'> | null): boolean {
    return o1 && o2 ? this.getVacinacaoPessoaIdentifier(o1) === this.getVacinacaoPessoaIdentifier(o2) : o1 === o2;
  }

  addVacinacaoPessoaToCollectionIfMissing<Type extends Pick<IVacinacaoPessoa, 'id'>>(
    vacinacaoPessoaCollection: Type[],
    ...vacinacaoPessoasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vacinacaoPessoas: Type[] = vacinacaoPessoasToCheck.filter(isPresent);
    if (vacinacaoPessoas.length > 0) {
      const vacinacaoPessoaCollectionIdentifiers = vacinacaoPessoaCollection.map(
        vacinacaoPessoaItem => this.getVacinacaoPessoaIdentifier(vacinacaoPessoaItem)!,
      );
      const vacinacaoPessoasToAdd = vacinacaoPessoas.filter(vacinacaoPessoaItem => {
        const vacinacaoPessoaIdentifier = this.getVacinacaoPessoaIdentifier(vacinacaoPessoaItem);
        if (vacinacaoPessoaCollectionIdentifiers.includes(vacinacaoPessoaIdentifier)) {
          return false;
        }
        vacinacaoPessoaCollectionIdentifiers.push(vacinacaoPessoaIdentifier);
        return true;
      });
      return [...vacinacaoPessoasToAdd, ...vacinacaoPessoaCollection];
    }
    return vacinacaoPessoaCollection;
  }

  protected convertDateFromClient<T extends IVacinacaoPessoa | NewVacinacaoPessoa | PartialUpdateVacinacaoPessoa>(
    vacinacaoPessoa: T,
  ): RestOf<T> {
    return {
      ...vacinacaoPessoa,
      quando: vacinacaoPessoa.quando?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restVacinacaoPessoa: RestVacinacaoPessoa): IVacinacaoPessoa {
    return {
      ...restVacinacaoPessoa,
      quando: restVacinacaoPessoa.quando ? dayjs(restVacinacaoPessoa.quando) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVacinacaoPessoa>): HttpResponse<IVacinacaoPessoa> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVacinacaoPessoa[]>): HttpResponse<IVacinacaoPessoa[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
