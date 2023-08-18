import { Schema } from 'mongoose';
import { ResourceOperation } from '../entities/resource-operation.entity';

export const ResourceOperationSchema = new Schema<ResourceOperation>(
  {
    create: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    update: {
      type: Boolean,
      default: false,
    },
    delete: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);
