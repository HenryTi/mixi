//=== UqApp builder created on Thu Mar 09 2023 15:38:28 GMT-0500 (Eastern Standard Time) ===//
import * as BrMi from './BrMi';
import * as JsTicket from './JsTicket';

export interface UQs {
	BrMi: BrMi.UqExt;
	JsTicket: JsTicket.UqExt;
}

export const uqsSchema = {
	"bruce/yumi": BrMi.uqSchema,
	"jksoft/jksoft-mini-jxc-trial": JsTicket.uqSchema,
}

export * as BrMi from './BrMi';
export * as JsTicket from './JsTicket';
