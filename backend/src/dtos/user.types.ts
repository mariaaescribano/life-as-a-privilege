
export type UserEntity = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type CreateUser = {
  name: string;
  email: string;
  password: string;
};

export type LoginUser = {
  name: string;
  password: string;
};

export type UpdateUser = {
  name?: string;
  email?: string;
  password?: string;
};

