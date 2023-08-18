import { NotFoundException } from '@nestjs/common';
import { CustomResponsePayload } from '../response';

export function assertReturn<T extends CustomResponsePayload>({ data }: T, errorMessage: string) {
  if (!data) {
    throw new NotFoundException({
      message: errorMessage,
    });
  }
}
