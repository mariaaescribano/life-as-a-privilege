
export type User = {
  id: string;
  name: string;
  email: string;
  password: string; 
  img: string;
};

/** Cómo prefiere la persona que se le hable. null = no lo ha dicho → neutro. */
export type Trato = "el" | "ella";

export type CreateUser = {
  name: string;
  email: string;
  password: string;
  /** Opcional: quien no lo elija se registra igual. */
  trato?: Trato | null;
};

export type LoginUser = {
  name: string;
  password: string;
};

export type SessionStorageUser = {
  userId: string;
  name: string;
  img: string;
};