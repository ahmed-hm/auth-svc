import { Schema } from 'mongoose';
import { Permission } from '../entities/permission.entity';
import { ResourceOperationSchema } from './resource-operation.schema';

export const PermissionSchema = new Schema<Permission>(
  {
    user: { type: ResourceOperationSchema, required: true },
    role: { type: ResourceOperationSchema, required: true },
  },
  { _id: false },
);
