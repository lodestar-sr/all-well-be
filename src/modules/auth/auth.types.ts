export interface IValidatedUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  createdAt: Date;
}

export interface IVerifiedUser {
  id: number;
  email: string;
}

export interface IPayload {
  id: number;
  email: string;
  sub: string;
}

export interface IRequest extends Request {
  user: IPayload;
}

export interface IAuthGuardRequest extends Request {
  user: IVerifiedUser;
}
