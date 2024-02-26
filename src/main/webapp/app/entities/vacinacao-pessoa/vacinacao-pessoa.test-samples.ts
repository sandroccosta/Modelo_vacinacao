import dayjs from 'dayjs/esm';

import { IVacinacaoPessoa, NewVacinacaoPessoa } from './vacinacao-pessoa.model';

export const sampleWithRequiredData: IVacinacaoPessoa = {
  id: 21221,
};

export const sampleWithPartialData: IVacinacaoPessoa = {
  id: 25353,
  quando: dayjs('2024-02-26'),
  codigoProfissinal: 'indeed',
};

export const sampleWithFullData: IVacinacaoPessoa = {
  id: 4370,
  quando: dayjs('2024-02-26'),
  cns: 'concerning',
  codigoProfissinal: 'unless absent solemnly',
};

export const sampleWithNewData: NewVacinacaoPessoa = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
