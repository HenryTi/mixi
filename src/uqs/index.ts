//=== UqApp builder created on Sun Feb 05 2023 19:29:53 GMT-0500 (Eastern Standard Time) ===//
import * as BrMi from './BrMi';

export interface UQs {
	BrMi: BrMi.UqExt;
}

export const uqsSchema = {
	"bruce/yumi": BrMi.uqSchema,
}

export * as BrMi from './BrMi';
