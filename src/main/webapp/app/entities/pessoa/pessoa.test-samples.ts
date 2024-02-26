import dayjs from 'dayjs/esm';

import { IPessoa, NewPessoa } from './pessoa.model';

export const sampleWithRequiredData: IPessoa = {
  id: 9720,
};

export const sampleWithPartialData: IPessoa = {
  id: 14471,
};

export const sampleWithFullData: IPessoa = {
  id: 32582,
  nome: 'furthermore yawningly',
  dataNascimento: dayjs('2024-02-26'),
};

export const sampleWithNewData: NewPessoa = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
