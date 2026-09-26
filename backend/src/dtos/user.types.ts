
export type UserEntity = {
  id: string;
  name: string;
  email: string;
  password: string;
};

/** Cómo prefiere la persona que se le hable. null = no lo ha dicho → neutro. */
export type Trato = 'el' | 'ella';

export type CreateUser = {
  name: string;
  email: string;
  password: string;
  /** Opcional: quien no lo elija se registra igual (ver sql/user-trato.sql). */
  trato?: Trato | null;
  /** Opcionales (sql/user-telefono-cumple.sql). */
  telefono?: string | null;
  /** 'YYYY-MM-DD' */
  fecha_nacimiento?: string | null;
};

export type LoginUser = {
  name: string;
  password: string;
};

export type UpdateUser = {
  name?: string;
  email?: string;
  password?: string;
  trato?: Trato | null;
  telefono?: string | null;
  fecha_nacimiento?: string | null;
};

