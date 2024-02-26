import dayjs from 'dayjs/esm';

export interface IPessoa {
  id: number;
  nome?: string | null;
  dataNascimento?: dayjs.Dayjs | null;
}

export type NewPessoa = Omit<IPessoa, 'id'> & { id: null };
