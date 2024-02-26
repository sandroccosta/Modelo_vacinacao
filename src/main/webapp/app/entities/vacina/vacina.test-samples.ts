import dayjs from 'dayjs/esm';

import { IVacina, NewVacina } from './vacina.model';

export const sampleWithRequiredData: IVacina = {
  id: 29074,
};

export const sampleWithPartialData: IVacina = {
  id: 25404,
  criado: dayjs('2024-02-26T04:03'),
};

export const sampleWithFullData: IVacina = {
  id: 23222,
  nome: 'curtsy swiftly',
  criado: dayjs('2024-02-26T05:40'),
};

export const sampleWithNewData: NewVacina = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
