import * as mongooseType from 'mongoose';

declare global {
  let mongoose: {
    conn: typeof mongooseType | null;
    promise: Promise<typeof mongooseType> | null;
  } | undefined;
}

export {};
