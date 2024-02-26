import { IPais, NewPais } from './pais.model';

export const sampleWithRequiredData: IPais = {
  id: 10215,
};

export const sampleWithPartialData: IPais = {
  id: 1070,
  nome: 'as',
  sigla: 'triumphantly',
};

export const sampleWithFullData: IPais = {
  id: 24018,
  nome: 'plague smooth',
  sigla: 'times evade',
};

export const sampleWithNewData: NewPais = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
