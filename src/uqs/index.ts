//=== UqApp builder created on Tue Mar 14 2023 16:01:21 GMT-0400 (Eastern Daylight Time) ===//
import * as BrMi from './BrMi';

export interface UQs {
    BrMi: BrMi.UqExt;
}

export const uqsSchema = {
    "bruce/yumi": BrMi.uqSchema,
}

export * as BrMi from './BrMi';
