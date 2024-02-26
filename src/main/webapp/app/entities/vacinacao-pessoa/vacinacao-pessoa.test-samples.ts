import dayjs from 'dayjs/esm';

import { IVacinacaoPessoa, NewVacinacaoPessoa } from './vacinacao-pessoa.model';

export const sampleWithRequiredData: IVacinacaoPessoa = {
  id: 9277,
};

export const sampleWithPartialData: IVacinacaoPessoa = {
  id: 7892,
  quando: dayjs('2024-02-26'),
  cns: 'woot disgusting via',
};

export const sampleWithFullData: IVacinacaoPessoa = {
  id: 20848,
  quando: dayjs('2024-02-26'),
  cns: 'fascinate',
  codigoProfissinal: 'from',
};

export const sampleWithNewData: NewVacinacaoPessoa = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
