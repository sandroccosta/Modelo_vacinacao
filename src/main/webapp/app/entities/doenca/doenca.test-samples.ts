import dayjs from 'dayjs/esm';

import { IDoenca, NewDoenca } from './doenca.model';

export const sampleWithRequiredData: IDoenca = {
  id: 9469,
};

export const sampleWithPartialData: IDoenca = {
  id: 12025,
  nome: 'even unto',
  localPrimeiroCaso: dayjs('2024-02-26'),
};

export const sampleWithFullData: IDoenca = {
  id: 19462,
  nome: 'hopelessly',
  criado: dayjs('2024-02-26T11:42'),
  dataPrimeiroCaso: dayjs('2024-02-26'),
  localPrimeiroCaso: dayjs('2024-02-26'),
};

export const sampleWithNewData: NewDoenca = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
