import dayjs from 'dayjs/esm';
import { IPais } from 'app/entities/pais/pais.model';

export interface IDoenca {
  id: number;
  nome?: string | null;
  criado?: dayjs.Dayjs | null;
  dataPrimeiroCaso?: dayjs.Dayjs | null;
  localPrimeiroCaso?: dayjs.Dayjs | null;
  paisPrimeiroCaso?: IPais | null;
}

export type NewDoenca = Omit<IDoenca, 'id'> & { id: null };
