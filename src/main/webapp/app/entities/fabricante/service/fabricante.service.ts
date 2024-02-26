import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFabricante, NewFabricante } from '../fabricante.model';

export type PartialUpdateFabricante = Partial<IFabricante> & Pick<IFabricante, 'id'>;

type RestOf<T extends IFabricante | NewFabricante> = Omit<T, 'criado'> & {
  criado?: string | null;
};

export type RestFabricante = RestOf<IFabricante>;

export type NewRestFabricante = RestOf<NewFabricante>;

export type PartialUpdateRestFabricante = RestOf<PartialUpdateFabricante>;

export type EntityResponseType = HttpResponse<IFabricante>;
export type EntityArrayResponseType = HttpResponse<IFabricante[]>;

@Injectable({ providedIn: 'root' })
export class FabricanteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fabricantes');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(fabricante: NewFabricante): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fabricante);
    return this.http
      .post<RestFabricante>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(fabricante: IFabricante): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fabricante);
    return this.http
      .put<RestFabricante>(`${this.resourceUrl}/${this.getFabricanteIdentifier(fabricante)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(fabricante: PartialUpdateFabricante): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fabricante);
    return this.http
      .patch<RestFabricante>(`${this.resourceUrl}/${this.getFabricanteIdentifier(fabricante)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestFabricante>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFabricante[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFabricanteIdentifier(fabricante: Pick<IFabricante, 'id'>): number {
    return fabricante.id;
  }

  compareFabricante(o1: Pick<IFabricante, 'id'> | null, o2: Pick<IFabricante, 'id'> | null): boolean {
    return o1 && o2 ? this.getFabricanteIdentifier(o1) === this.getFabricanteIdentifier(o2) : o1 === o2;
  }

  addFabricanteToCollectionIfMissing<Type extends Pick<IFabricante, 'id'>>(
    fabricanteCollection: Type[],
    ...fabricantesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const fabricantes: Type[] = fabricantesToCheck.filter(isPresent);
    if (fabricantes.length > 0) {
      const fabricanteCollectionIdentifiers = fabricanteCollection.map(fabricanteItem => this.getFabricanteIdentifier(fabricanteItem)!);
      const fabricantesToAdd = fabricantes.filter(fabricanteItem => {
        const fabricanteIdentifier = this.getFabricanteIdentifier(fabricanteItem);
        if (fabricanteCollectionIdentifiers.includes(fabricanteIdentifier)) {
          return false;
        }
        fabricanteCollectionIdentifiers.push(fabricanteIdentifier);
        return true;
      });
      return [...fabricantesToAdd, ...fabricanteCollection];
    }
    return fabricanteCollection;
  }

  protected convertDateFromClient<T extends IFabricante | NewFabricante | PartialUpdateFabricante>(fabricante: T): RestOf<T> {
    return {
      ...fabricante,
      criado: fabricante.criado?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restFabricante: RestFabricante): IFabricante {
    return {
      ...restFabricante,
      criado: restFabricante.criado ? dayjs(restFabricante.criado) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFabricante>): HttpResponse<IFabricante> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFabricante[]>): HttpResponse<IFabricante[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
