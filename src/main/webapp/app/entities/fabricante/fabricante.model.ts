import dayjs from 'dayjs/esm';
import { IPais } from 'app/entities/pais/pais.model';
import { IVacina } from 'app/entities/vacina/vacina.model';

export interface IFabricante {
  id: number;
  nome?: string | null;
  criado?: dayjs.Dayjs | null;
  pais?: IPais | null;
  vacinas?: IVacina[] | null;
}

export type NewFabricante = Omit<IFabricante, 'id'> & { id: null };
