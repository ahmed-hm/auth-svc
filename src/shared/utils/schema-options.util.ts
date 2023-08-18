import { SchemaOptions } from 'mongoose';

export const commonSchemaOptions: SchemaOptions = {
  timestamps: true,
  toJSON: {
    transform: transformDoc,
    versionKey: false,
  },
};

export function transformDoc(doc: any, { __v, password, ...ret }: any) {
  return ret;
}
