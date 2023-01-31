//=== UqApp builder created on Sat Jan 21 2023 11:24:18 GMT-0500 (Eastern Standard Time) ===//
import * as BrMi from './BrMi';

export interface UQs {
	BrMi: BrMi.UqExt;
}

export const uqsSchema = {
	"bruce/yumi": BrMi.uqSchema,
}

export * as BrMi from './BrMi';
