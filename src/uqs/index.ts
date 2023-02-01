//=== UqApp builder created on Wed Feb 01 2023 16:42:25 GMT-0500 (Eastern Standard Time) ===//
import * as BrMi from './BrMi';

export interface UQs {
	BrMi: BrMi.UqExt;
}

export const uqsSchema = {
	"bruce/yumi": BrMi.uqSchema,
}

export * as BrMi from './BrMi';
