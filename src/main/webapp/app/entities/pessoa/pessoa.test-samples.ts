import dayjs from 'dayjs/esm';

import { IPessoa, NewPessoa } from './pessoa.model';

export const sampleWithRequiredData: IPessoa = {
  id: 26537,
};

export const sampleWithPartialData: IPessoa = {
  id: 3877,
};

export const sampleWithFullData: IPessoa = {
  id: 3997,
  nome: 'silently wherever',
  dataNascimento: dayjs('2024-02-26'),
};

export const sampleWithNewData: NewPessoa = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
