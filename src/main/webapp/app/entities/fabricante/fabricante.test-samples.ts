import dayjs from 'dayjs/esm';

import { IFabricante, NewFabricante } from './fabricante.model';

export const sampleWithRequiredData: IFabricante = {
  id: 27888,
};

export const sampleWithPartialData: IFabricante = {
  id: 4142,
};

export const sampleWithFullData: IFabricante = {
  id: 30878,
  nome: 'fooey like',
  criado: dayjs('2024-02-26T06:59'),
};

export const sampleWithNewData: NewFabricante = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
