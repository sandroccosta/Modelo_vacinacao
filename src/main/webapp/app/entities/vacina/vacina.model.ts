import dayjs from 'dayjs/esm';
import { IDoenca } from 'app/entities/doenca/doenca.model';
import { IFabricante } from 'app/entities/fabricante/fabricante.model';

export interface IVacina {
  id: number;
  nome?: string | null;
  criado?: dayjs.Dayjs | null;
  doenca?: IDoenca | null;
  fabricantes?: IFabricante[] | null;
}

export type NewVacina = Omit<IVacina, 'id'> & { id: null };
