import { IPais, NewPais } from './pais.model';

export const sampleWithRequiredData: IPais = {
  id: 31549,
};

export const sampleWithPartialData: IPais = {
  id: 13639,
  nome: 'vitiate',
};

export const sampleWithFullData: IPais = {
  id: 4904,
  nome: 'be duh strangle',
  sigla: 'stealthily',
};

export const sampleWithNewData: NewPais = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
