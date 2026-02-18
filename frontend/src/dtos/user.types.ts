
export type User = {
  id: string;
  name: string;
  email: string;
  password: string; 
  img: string;
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

export type SessionStorageUser = {
  userId: string;
  name: string;
  img: string;
};