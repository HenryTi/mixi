//=== UqApp builder created on Wed Mar 01 2023 16:00:56 GMT-0500 (Eastern Standard Time) ===//
import * as BrMi from './BrMi';
import * as JsTicket from './JsTicket';

export interface UQs {
	BrMi: BrMi.UqExt;
	JsTicket: JsTicket.UqExt;
}

export const uqsSchema = {
	"bruce/yumi": BrMi.uqSchema,
	"jksoft/ticket": JsTicket.uqSchema,
}

export * as BrMi from './BrMi';
export * as JsTicket from './JsTicket';
