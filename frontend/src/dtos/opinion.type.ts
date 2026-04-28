export type Opinion = {
  id: string;
  nombre: string;
  texto: string;
  created_at?: string;
};

export type OpinionInput = {
  nombre: string;
  texto: string;
  email?: string;
};
