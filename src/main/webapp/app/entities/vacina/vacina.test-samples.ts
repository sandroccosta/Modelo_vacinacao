import dayjs from 'dayjs/esm';

import { IVacina, NewVacina } from './vacina.model';

export const sampleWithRequiredData: IVacina = {
  id: 19653,
};

export const sampleWithPartialData: IVacina = {
  id: 27985,
  nome: 'bumper royal',
  criado: dayjs('2024-02-26T04:17'),
};

export const sampleWithFullData: IVacina = {
  id: 19342,
  nome: 'brr',
  criado: dayjs('2024-02-26T09:37'),
};

export const sampleWithNewData: NewVacina = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
