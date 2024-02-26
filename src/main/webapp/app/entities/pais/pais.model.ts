export interface IPais {
  id: number;
  nome?: string | null;
  sigla?: string | null;
}

export type NewPais = Omit<IPais, 'id'> & { id: null };
