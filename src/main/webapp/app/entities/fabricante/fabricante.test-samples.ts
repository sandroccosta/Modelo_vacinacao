import dayjs from 'dayjs/esm';

import { IFabricante, NewFabricante } from './fabricante.model';

export const sampleWithRequiredData: IFabricante = {
  id: 28499,
};

export const sampleWithPartialData: IFabricante = {
  id: 11292,
  nome: 'slide fearful mountainous',
};

export const sampleWithFullData: IFabricante = {
  id: 14536,
  nome: 'unethically from',
  criado: dayjs('2024-02-26T17:16'),
};

export const sampleWithNewData: NewFabricante = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
