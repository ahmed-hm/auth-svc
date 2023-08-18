import { MergeType } from 'mongoose';
import { Role } from 'src/modules/role/entities/role.entity';
import { User } from 'src/modules/user/entities/user.entity';

export type UserJWTToken = MergeType<
  Omit<User, '_id'> & { _id: string },
  { role: Pick<Role, 'type' | 'permission'> & { _id: string } }
>;

export type JWTToken = UserJWTToken & { sessionId: string };
