export interface Info {
  avatar: string;
  age: number | string;
  name: string;
  surename: string;
  email: string;
  phone: string;
  bio: string;
}

export interface Comment {
  id: number;
  client_id: number;
  comment: string;
  likes: Array<{ client_id: number }>;
  date: Date;
}

export interface Post {
  id: number;
  client_id: number;
  image: string;
  description?: string;
  comments?: Array<Comment>;
  likes: Array<{ client_id: number }>;
  saves: Array<{ client_id: number }>;
  date: Date;
}

export interface Client {
  id?: number;
  login: string;
  password: string;
  selfInfo?: Info;
  content?: Array<Post>;
}
