//=== UqApp builder created on Sun Mar 05 2023 20:27:35 GMT-0500 (Eastern Standard Time) ===//
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
