import { Schema } from 'mongoose';
import { SubRole } from '../entities/sub-role.entity';
import { ROLE_MODEL_NAME } from './role.schema';

const SubRoleSchema = new Schema<SubRole>({
  _id: { type: Schema.Types.ObjectId, required: true, ref: ROLE_MODEL_NAME },
  type: {
    type: String,
    required: true,
  },
});

export function subRoleSchemaFactory() {
  return SubRoleSchema;
}
