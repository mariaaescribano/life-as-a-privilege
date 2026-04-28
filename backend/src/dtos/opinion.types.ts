export type Opinion = {
  id?: string;
  nombre: string;
  texto: string;
  email?: string;
  aprobada?: boolean;
  created_at?: string;
};

export type OpinionInput = {
  nombre: string;
  texto: string;
  email?: string;
};
