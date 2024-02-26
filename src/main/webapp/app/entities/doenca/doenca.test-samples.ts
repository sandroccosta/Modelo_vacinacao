import dayjs from 'dayjs/esm';

import { IDoenca, NewDoenca } from './doenca.model';

export const sampleWithRequiredData: IDoenca = {
  id: 12110,
};

export const sampleWithPartialData: IDoenca = {
  id: 22617,
  nome: 'gee astride',
};

export const sampleWithFullData: IDoenca = {
  id: 4685,
  nome: 'over yowza',
  criado: dayjs('2024-02-26T16:57'),
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
