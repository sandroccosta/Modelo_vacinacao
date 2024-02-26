import dayjs from 'dayjs/esm';
import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { IVacina } from 'app/entities/vacina/vacina.model';
import { IFabricante } from 'app/entities/fabricante/fabricante.model';

export interface IVacinacaoPessoa {
  id: number;
  quando?: dayjs.Dayjs | null;
  cns?: string | null;
  codigoProfissinal?: string | null;
  pessoa?: IPessoa | null;
  vacina?: IVacina | null;
  fabricante?: IFabricante | null;
}

export type NewVacinacaoPessoa = Omit<IVacinacaoPessoa, 'id'> & { id: null };
