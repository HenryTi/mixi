//=== UqApp builder created on Sun Mar 05 2023 20:27:35 GMT-0500 (Eastern Standard Time) ===//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDXValue, Uq, UqQuery, UqAction, UqID, UqIX, UqIDX, UqMap } from "tonwa-uq";
// eslint-disable-next-line @typescript-eslint/no-unused-vars


//===============================;
//======= UQ bruce/yumi ========;
//===============================';

export interface ID {
    id?: number;
}

export interface IDX {
    id: number;
}

export interface IX {
    ix: number;
    xi: number;
}

export interface Param$role_My {
}
export interface Return$role_MyAdmins {
	id: number;
	unit: number;
	admin: number;
	entity: string;
	assigned: string;
}
export interface Return$role_MyRoles {
	unit: number;
	role: string;
}
export interface Return$role_MyUnitProps {
	unit: number;
	props: string;
}
export interface Result$role_My {
	admins: Return$role_MyAdmins[];
	roles: Return$role_MyRoles[];
	unitProps: Return$role_MyUnitProps[];
}

export interface Param$role_Unit_Users {
	unit: number;
}
export interface Return$role_Unit_UsersUsers {
	id: number;
	user: number;
	admin: number;
	assigned: string;
	name: string;
	nick: string;
	icon: string;
	addBy: number;
}
export interface Return$role_Unit_UsersRoles {
	user: number;
	role: string;
}
export interface Result$role_Unit_Users {
	users: Return$role_Unit_UsersUsers[];
	roles: Return$role_Unit_UsersRoles[];
}

export interface Param$role_Unit_Add_Admin {
	unit: number;
	user: number;
	admin: number;
	assigned: string;
}
export interface Result$role_Unit_Add_Admin {
}

export interface Param$role_Unit_Del_Admin {
	unit: number;
	user: number;
	admin: number;
}
export interface Result$role_Unit_Del_Admin {
}

export interface Param$role_Unit_Add_User {
	unit: number;
	user: number;
	assigned: string;
}
export interface Result$role_Unit_Add_User {
}

export interface Param$role_Unit_User_Role {
	unit: number;
	user: number;
	action: string;
	role: string;
}
export interface Result$role_Unit_User_Role {
}

export interface Param$role_Unit_Quit_Owner {
	unit: number;
}
export interface Result$role_Unit_Quit_Owner {
}

export interface Param$poked {
}
export interface Return$pokedRet {
	poke: number;
}
export interface Result$poked {
	ret: Return$pokedRet[];
}

export interface Param$setMyTimezone {
	_timezone: number;
}
export interface Result$setMyTimezone {
}

export interface Param$getUnitTime {
}
export interface Return$getUnitTimeRet {
	timezone: number;
	unitTimeZone: number;
	unitBizMonth: number;
	unitBizDate: number;
}
export interface Result$getUnitTime {
	ret: Return$getUnitTimeRet[];
}

export interface Account extends ID {
	no?: string;
	name: string;
	portion: number;
}

export interface AccountInActs extends ID {
	ID?: UqID<any>;
	no?: string;
	name: string;
	portion: number;
}

export interface UserAccount extends IX {
	seq: number;
}

export interface Holding extends ID {
	account: number;
	stock: number;
	everBought: number;
}

export interface HoldingInActs extends ID {
	ID?: UqID<any>;
	account: number | ID;
	stock: number | ID;
	everBought: number;
}

export interface AccountValue extends IDX {
	id: number;
	miValue?: number;
	market?: number;
	count?: number;
	cash?: number;
	$act?: number;
}export interface ActParamAccountValue {
	id: number|IDXValue;
	miValue?: number|IDXValue;
	market?: number|IDXValue;
	count?: number|IDXValue;
	cash?: number|IDXValue;
	$act?: number;
}

export interface AccountHolding extends IX {
}

export interface Portfolio extends IDX {
	id: number;
	quantity?: number;
	cost?: number;
	$act?: number;
}export interface ActParamPortfolio {
	id: number|IDXValue;
	quantity?: number|IDXValue;
	cost?: number|IDXValue;
	$act?: number;
}

export interface Transaction extends ID {
	holding: number;
	tick: any;
	price: number;
	quantity: number;
	amount: number;
}

export interface TransactionInActs extends ID {
	ID?: UqID<any>;
	holding: number | ID;
	tick: any;
	price: number;
	quantity: number;
	amount: number;
}

export interface Blog extends ID {
	no?: string;
	caption: string;
	content: string;
}

export interface BlogInActs extends ID {
	ID?: UqID<any>;
	no?: string;
	caption: string;
	content: string;
}



export interface IDBlogTest extends ID {
	d: any;
}

export interface IDBlogTestInActs extends ID {
	ID?: UqID<any>;
	d: any;
}

export interface Group extends ID {
	no?: string;
	name: string;
}

export interface GroupInActs extends ID {
	ID?: UqID<any>;
	no?: string;
	name: string;
}

export interface UserGroup extends IX {
}

export interface UserAllStock extends IX {
}

export interface UserBlockStock extends IX {
}

export interface GroupStock extends IX {
	seq: number;
}

export interface ParamStockUsing {
	stock: number;
}
export interface ReturnStockUsingAccounts {
	account: number;
}
export interface ReturnStockUsingGroups {
	group: number;
}
export interface ResultStockUsing {
	accounts: ReturnStockUsingAccounts[];
	groups: ReturnStockUsingGroups[];
}

export interface Market extends ID {
	name: string;
	currency: string;
}

export interface MarketInActs extends ID {
	ID?: UqID<any>;
	name: string;
	currency: string;
}

export interface Industry extends ID {
	name: string;
}

export interface IndustryInActs extends ID {
	ID?: UqID<any>;
	name: string;
}

export interface Stock extends ID {
	market: number;
	no?: string;
	name: string;
	rawId: number;
	uno: string;
}

export interface StockInActs extends ID {
	ID?: UqID<any>;
	market: number | ID;
	no?: string;
	name: string;
	rawId: number | ID;
	uno: string;
}

export interface StockValue extends IDX {
	id: number;
	earning?: number;
	divident?: number;
	price?: number;
	pvolumn?: number;
	roe?: number;
	volumn?: number;
	date?: any;
	dvRate?: number;
	ttm?: number;
	miRate?: number;
	miValue?: number;
	incValue?: number;
	inc1?: number;
	inc2?: number;
	inc3?: number;
	inc4?: number;
	preInc?: number;
	smoothness?: number;
	gMiRate?: number;
	gMiValue?: number;
	gIncValue?: number;
	gInc1?: number;
	gInc2?: number;
	gInc3?: number;
	gInc4?: number;
	gPreInc?: number;
	gSmoothness?: number;
	rMiRate?: number;
	rMiValue?: number;
	rIncValue?: number;
	rInc1?: number;
	rInc2?: number;
	rInc3?: number;
	rInc4?: number;
	rPreInc?: number;
	rSmoothness?: number;
	$act?: number;
}export interface ActParamStockValue {
	id: number|IDXValue;
	earning?: number|IDXValue;
	divident?: number|IDXValue;
	price?: number|IDXValue;
	pvolumn?: number|IDXValue;
	roe?: number|IDXValue;
	volumn?: number|IDXValue;
	date?: any|IDXValue;
	dvRate?: number|IDXValue;
	ttm?: number|IDXValue;
	miRate?: number|IDXValue;
	miValue?: number|IDXValue;
	incValue?: number|IDXValue;
	inc1?: number|IDXValue;
	inc2?: number|IDXValue;
	inc3?: number|IDXValue;
	inc4?: number|IDXValue;
	preInc?: number|IDXValue;
	smoothness?: number|IDXValue;
	gMiRate?: number|IDXValue;
	gMiValue?: number|IDXValue;
	gIncValue?: number|IDXValue;
	gInc1?: number|IDXValue;
	gInc2?: number|IDXValue;
	gInc3?: number|IDXValue;
	gInc4?: number|IDXValue;
	gPreInc?: number|IDXValue;
	gSmoothness?: number|IDXValue;
	rMiRate?: number|IDXValue;
	rMiValue?: number|IDXValue;
	rIncValue?: number|IDXValue;
	rInc1?: number|IDXValue;
	rInc2?: number|IDXValue;
	rInc3?: number|IDXValue;
	rInc4?: number|IDXValue;
	rPreInc?: number|IDXValue;
	rSmoothness?: number|IDXValue;
	$act?: number;
}

export interface IXIndustry extends IX {
}

export interface ParamSearchStock {
	$orderSwitch: string;
	key: string;
	market: string;
	smooth: number;
}
export interface ReturnSearchStock$page {
	$order: number;
	id: number;
	market: number;
	no: string;
	name: string;
	rawId: number;
	earning: number;
	divident: number;
	price: number;
	roe: number;
	volumn: number;
	dvRate: number;
	ttm: number;
	miRate: number;
	miValue: number;
	incValue: number;
	inc1: number;
	inc2: number;
	inc3: number;
	inc4: number;
	preInc: number;
	smoothness: number;
	gMiRate: number;
	gMiValue: number;
	gIncValue: number;
	gInc1: number;
	gInc2: number;
	gInc3: number;
	gInc4: number;
	gPreInc: number;
	gSmoothness: number;
	rMiRate: number;
	rMiValue: number;
	rIncValue: number;
	rInc1: number;
	rInc2: number;
	rInc3: number;
	rInc4: number;
	rPreInc: number;
	rSmoothness: number;
}
export interface ResultSearchStock {
	$page: ReturnSearchStock$page[];
}

export interface ParamWriteStock {
}
export interface ResultWriteStock {
}

export interface ParamWriteGrossAndRevenue {
}
export interface ResultWriteGrossAndRevenue {
}

export interface ParamWritePrice {
}
export interface ResultWritePrice {
}

export interface ParamWriteIndustryStock {
	industry: string;
}
export interface ResultWriteIndustryStock {
}

export interface ParamWriteStockIndustry {
	rawId: number;
}
export interface ResultWriteStockIndustry {
}

export interface ParamActs {
	account?: AccountInActs[];
	userAccount?: UserAccount[];
	holding?: HoldingInActs[];
	accountValue?: ActParamAccountValue[];
	accountHolding?: AccountHolding[];
	portfolio?: ActParamPortfolio[];
	transaction?: TransactionInActs[];
	blog?: BlogInActs[];
	iDBlogTest?: IDBlogTestInActs[];
	group?: GroupInActs[];
	userGroup?: UserGroup[];
	userAllStock?: UserAllStock[];
	userBlockStock?: UserBlockStock[];
	groupStock?: GroupStock[];
	market?: MarketInActs[];
	industry?: IndustryInActs[];
	stock?: StockInActs[];
	stockValue?: ActParamStockValue[];
	iXIndustry?: IXIndustry[];
}


export interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;
	SQL: Uq;
    Role: { [key: string]: string[] };

	$role_My: UqQuery<Param$role_My, Result$role_My>;
	$role_Unit_Users: UqQuery<Param$role_Unit_Users, Result$role_Unit_Users>;
	$role_Unit_Add_Admin: UqAction<Param$role_Unit_Add_Admin, Result$role_Unit_Add_Admin>;
	$role_Unit_Del_Admin: UqAction<Param$role_Unit_Del_Admin, Result$role_Unit_Del_Admin>;
	$role_Unit_Add_User: UqAction<Param$role_Unit_Add_User, Result$role_Unit_Add_User>;
	$role_Unit_User_Role: UqAction<Param$role_Unit_User_Role, Result$role_Unit_User_Role>;
	$role_Unit_Quit_Owner: UqAction<Param$role_Unit_Quit_Owner, Result$role_Unit_Quit_Owner>;
	$poked: UqQuery<Param$poked, Result$poked>;
	$setMyTimezone: UqAction<Param$setMyTimezone, Result$setMyTimezone>;
	$getUnitTime: UqQuery<Param$getUnitTime, Result$getUnitTime>;
	Account: UqID<any>;
	UserAccount: UqIX<any>;
	Holding: UqID<any>;
	AccountValue: UqIDX<any>;
	AccountHolding: UqIX<any>;
	Portfolio: UqIDX<any>;
	Transaction: UqID<any>;
	Blog: UqID<any>;
	CustomerCredits: UqMap;
	IDBlogTest: UqID<any>;
	Group: UqID<any>;
	UserGroup: UqIX<any>;
	UserAllStock: UqIX<any>;
	UserBlockStock: UqIX<any>;
	GroupStock: UqIX<any>;
	StockUsing: UqQuery<ParamStockUsing, ResultStockUsing>;
	Market: UqID<any>;
	Industry: UqID<any>;
	Stock: UqID<any>;
	StockValue: UqIDX<any>;
	IXIndustry: UqIX<any>;
	SearchStock: UqQuery<ParamSearchStock, ResultSearchStock>;
	WriteStock: UqAction<ParamWriteStock, ResultWriteStock>;
	WriteGrossAndRevenue: UqAction<ParamWriteGrossAndRevenue, ResultWriteGrossAndRevenue>;
	WritePrice: UqAction<ParamWritePrice, ResultWritePrice>;
	WriteIndustryStock: UqAction<ParamWriteIndustryStock, ResultWriteIndustryStock>;
	WriteStockIndustry: UqAction<ParamWriteStockIndustry, ResultWriteStockIndustry>;
}


export const uqSchema={
    "$role_my": {
        "name": "$role_my",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "returns": [
            {
                "name": "admins",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "unit",
                        "type": "id"
                    },
                    {
                        "name": "admin",
                        "type": "tinyint"
                    },
                    {
                        "name": "entity",
                        "type": "char",
                        "size": 100
                    },
                    {
                        "name": "assigned",
                        "type": "char",
                        "size": 100
                    }
                ]
            },
            {
                "name": "roles",
                "fields": [
                    {
                        "name": "unit",
                        "type": "id"
                    },
                    {
                        "name": "role",
                        "type": "char",
                        "size": 100
                    }
                ]
            },
            {
                "name": "unitProps",
                "fields": [
                    {
                        "name": "unit",
                        "type": "id"
                    },
                    {
                        "name": "props",
                        "type": "text"
                    }
                ]
            }
        ]
    },
    "$role_unit_users": {
        "name": "$role_unit_users",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "unit",
                "type": "bigint"
            }
        ],
        "returns": [
            {
                "name": "users",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "user",
                        "type": "id"
                    },
                    {
                        "name": "admin",
                        "type": "tinyint"
                    },
                    {
                        "name": "assigned",
                        "type": "char",
                        "size": 100
                    },
                    {
                        "name": "name",
                        "type": "char",
                        "size": 100
                    },
                    {
                        "name": "nick",
                        "type": "char",
                        "size": 100
                    },
                    {
                        "name": "icon",
                        "type": "char",
                        "size": 200
                    },
                    {
                        "name": "addBy",
                        "type": "id"
                    }
                ]
            },
            {
                "name": "roles",
                "fields": [
                    {
                        "name": "user",
                        "type": "id"
                    },
                    {
                        "name": "role",
                        "type": "char",
                        "size": 100
                    }
                ]
            }
        ]
    },
    "$role_unit_add_admin": {
        "name": "$role_unit_add_admin",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "unit",
                "type": "bigint"
            },
            {
                "name": "user",
                "type": "bigint"
            },
            {
                "name": "admin",
                "type": "tinyint"
            },
            {
                "name": "assigned",
                "type": "char",
                "size": 100
            }
        ],
        "returns": [] as any
    },
    "$role_unit_del_admin": {
        "name": "$role_unit_del_admin",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "unit",
                "type": "bigint"
            },
            {
                "name": "user",
                "type": "bigint"
            },
            {
                "name": "admin",
                "type": "tinyint"
            }
        ],
        "returns": [] as any
    },
    "$role_unit_add_user": {
        "name": "$role_unit_add_user",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "unit",
                "type": "bigint"
            },
            {
                "name": "user",
                "type": "bigint"
            },
            {
                "name": "assigned",
                "type": "char",
                "size": 100
            }
        ],
        "returns": [] as any
    },
    "$role_unit_user_role": {
        "name": "$role_unit_user_role",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "unit",
                "type": "bigint"
            },
            {
                "name": "user",
                "type": "bigint"
            },
            {
                "name": "action",
                "type": "char",
                "size": 100
            },
            {
                "name": "role",
                "type": "char",
                "size": 100
            }
        ],
        "returns": [] as any
    },
    "$role_unit_quit_owner": {
        "name": "$role_unit_quit_owner",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "unit",
                "type": "bigint"
            }
        ],
        "returns": [] as any
    },
    "$poked": {
        "name": "$poked",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "poke",
                        "type": "tinyint"
                    }
                ]
            }
        ]
    },
    "$setmytimezone": {
        "name": "$setMyTimezone",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "_timezone",
                "type": "tinyint"
            }
        ],
        "returns": [] as any
    },
    "$getunittime": {
        "name": "$getUnitTime",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "timezone",
                        "type": "tinyint"
                    },
                    {
                        "name": "unitTimeZone",
                        "type": "tinyint"
                    },
                    {
                        "name": "unitBizMonth",
                        "type": "tinyint"
                    },
                    {
                        "name": "unitBizDate",
                        "type": "tinyint"
                    }
                ]
            }
        ]
    },
    "account": {
        "name": "Account",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "no",
                "type": "char",
                "size": 20
            },
            {
                "name": "name",
                "type": "char",
                "size": 50
            },
            {
                "name": "portion",
                "type": "smallint"
            }
        ],
        "keys": [
            {
                "name": "no",
                "type": "char",
                "size": 20
            }
        ],
        "global": false,
        "idType": 12,
        "isMinute": false
    },
    "useraccount": {
        "name": "UserAccount",
        "type": "ix",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "ix",
                "type": "id",
                "ID": "$user",
                "tuid": "$user"
            },
            {
                "name": "xi",
                "type": "id",
                "ID": "$local",
                "tuid": "$local"
            },
            {
                "name": "seq",
                "type": "int",
                "null": false
            }
        ],
        "ixx": false,
        "hasSort": true,
        "xiType": 12
    },
    "holding": {
        "name": "Holding",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "account",
                "type": "id",
                "ID": "account",
                "tuid": "account"
            },
            {
                "name": "stock",
                "type": "id",
                "ID": "stock",
                "tuid": "stock"
            },
            {
                "name": "everBought",
                "type": "tinyint"
            }
        ],
        "keys": [
            {
                "name": "account",
                "type": "id",
                "ID": "account",
                "tuid": "account"
            },
            {
                "name": "stock",
                "type": "id",
                "ID": "stock",
                "tuid": "stock"
            }
        ],
        "global": false,
        "idType": 12,
        "isMinute": false
    },
    "accountvalue": {
        "name": "AccountValue",
        "type": "idx",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "miValue",
                "type": "float"
            },
            {
                "name": "market",
                "type": "float"
            },
            {
                "name": "count",
                "type": "smallint"
            },
            {
                "name": "cash",
                "type": "dec",
                "scale": 4,
                "precision": 16
            }
        ],
        "update": true
    },
    "accountholding": {
        "name": "AccountHolding",
        "type": "ix",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "ix",
                "type": "id"
            },
            {
                "name": "xi",
                "type": "id"
            }
        ],
        "ixx": false,
        "hasSort": false,
        "xiType": 0
    },
    "portfolio": {
        "name": "Portfolio",
        "type": "idx",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "quantity",
                "type": "bigint"
            },
            {
                "name": "cost",
                "type": "float"
            }
        ],
        "update": true
    },
    "transaction": {
        "name": "Transaction",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "holding",
                "type": "id"
            },
            {
                "name": "tick",
                "type": "timestamp"
            },
            {
                "name": "price",
                "type": "int"
            },
            {
                "name": "quantity",
                "type": "int"
            },
            {
                "name": "amount",
                "type": "int"
            }
        ],
        "keys": [
            {
                "name": "holding",
                "type": "id"
            },
            {
                "name": "tick",
                "type": "timestamp"
            }
        ],
        "global": false,
        "idType": 12,
        "isMinute": false
    },
    "blog": {
        "name": "Blog",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "no",
                "type": "char",
                "size": 20
            },
            {
                "name": "caption",
                "type": "char",
                "size": 100
            },
            {
                "name": "content",
                "type": "text"
            }
        ],
        "keys": [
            {
                "name": "no",
                "type": "char",
                "size": 20
            }
        ],
        "create": true,
        "update": true,
        "global": false,
        "idType": 12,
        "isMinute": false
    },
    "customercredits": {
        "name": "CustomerCredits",
        "type": "map",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "creditsCode",
                "type": "int",
                "null": false
            },
            {
                "name": "createDate",
                "type": "datetime"
            },
            {
                "name": "expiredDate",
                "type": "date"
            }
        ],
        "keys": [
            {
                "name": "customer",
                "type": "id",
                "null": false
            },
            {
                "name": "credits",
                "type": "int",
                "null": false
            }
        ],
        "actions": {
            "add": "$add$",
            "del": "$del$"
        },
        "queries": {
            "all": "$all$",
            "page": "$page$",
            "query": "$query$"
        }
    },
    "idblogtest": {
        "name": "IDBlogTest",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "d",
                "type": "date"
            }
        ],
        "keys": [] as any,
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "group": {
        "name": "Group",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "no",
                "type": "char",
                "size": 20
            },
            {
                "name": "name",
                "type": "char",
                "size": 50
            }
        ],
        "keys": [
            {
                "name": "no",
                "type": "char",
                "size": 20
            }
        ],
        "global": false,
        "idType": 12,
        "isMinute": false
    },
    "usergroup": {
        "name": "UserGroup",
        "type": "ix",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "ix",
                "type": "id",
                "ID": "$user",
                "tuid": "$user"
            },
            {
                "name": "xi",
                "type": "id",
                "ID": "$local",
                "tuid": "$local"
            }
        ],
        "ixx": false,
        "hasSort": false,
        "xiType": 12
    },
    "userallstock": {
        "name": "UserAllStock",
        "type": "ix",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "ix",
                "type": "id",
                "ID": "$user",
                "tuid": "$user"
            },
            {
                "name": "xi",
                "type": "id",
                "ID": "$local",
                "tuid": "$local"
            }
        ],
        "ixx": false,
        "hasSort": false,
        "xiType": 12
    },
    "userblockstock": {
        "name": "UserBlockStock",
        "type": "ix",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "ix",
                "type": "id",
                "ID": "$user",
                "tuid": "$user"
            },
            {
                "name": "xi",
                "type": "id",
                "ID": "$local",
                "tuid": "$local"
            }
        ],
        "ixx": false,
        "hasSort": false,
        "xiType": 12
    },
    "groupstock": {
        "name": "GroupStock",
        "type": "ix",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "ix",
                "type": "id"
            },
            {
                "name": "xi",
                "type": "id"
            },
            {
                "name": "seq",
                "type": "int",
                "null": false
            }
        ],
        "ixx": false,
        "hasSort": true,
        "xiType": 0
    },
    "stockusing": {
        "name": "StockUsing",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "stock",
                "type": "id"
            }
        ],
        "returns": [
            {
                "name": "accounts",
                "fields": [
                    {
                        "name": "account",
                        "type": "id"
                    }
                ]
            },
            {
                "name": "groups",
                "fields": [
                    {
                        "name": "group",
                        "type": "id"
                    }
                ]
            }
        ]
    },
    "market": {
        "name": "Market",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "name",
                "type": "char",
                "size": 100
            },
            {
                "name": "currency",
                "type": "char",
                "size": 20
            }
        ],
        "keys": [
            {
                "name": "name",
                "type": "char",
                "size": 100
            }
        ],
        "global": false,
        "idType": 12,
        "isMinute": false
    },
    "industry": {
        "name": "Industry",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "name",
                "type": "char",
                "size": 50
            }
        ],
        "keys": [
            {
                "name": "name",
                "type": "char",
                "size": 50
            }
        ],
        "global": false,
        "idType": 12,
        "isMinute": false
    },
    "stock": {
        "name": "Stock",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "market",
                "type": "id",
                "ID": "market",
                "tuid": "market"
            },
            {
                "name": "no",
                "type": "char",
                "size": 20
            },
            {
                "name": "name",
                "type": "char",
                "size": 50
            },
            {
                "name": "rawId",
                "type": "id"
            },
            {
                "name": "uno",
                "type": "char",
                "size": 12
            }
        ],
        "keys": [
            {
                "name": "market",
                "type": "id",
                "ID": "market",
                "tuid": "market"
            },
            {
                "name": "no",
                "type": "char",
                "size": 20
            }
        ],
        "global": false,
        "idType": 12,
        "isMinute": false
    },
    "stockvalue": {
        "name": "StockValue",
        "type": "idx",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "earning",
                "type": "float"
            },
            {
                "name": "divident",
                "type": "float"
            },
            {
                "name": "price",
                "type": "float"
            },
            {
                "name": "pvolumn",
                "type": "float"
            },
            {
                "name": "roe",
                "type": "float"
            },
            {
                "name": "volumn",
                "type": "float"
            },
            {
                "name": "date",
                "type": "date"
            },
            {
                "name": "dvRate",
                "type": "float"
            },
            {
                "name": "ttm",
                "type": "float"
            },
            {
                "name": "miRate",
                "type": "float"
            },
            {
                "name": "miValue",
                "type": "float"
            },
            {
                "name": "incValue",
                "type": "float"
            },
            {
                "name": "inc1",
                "type": "float"
            },
            {
                "name": "inc2",
                "type": "float"
            },
            {
                "name": "inc3",
                "type": "float"
            },
            {
                "name": "inc4",
                "type": "float"
            },
            {
                "name": "preInc",
                "type": "float"
            },
            {
                "name": "smoothness",
                "type": "tinyint"
            },
            {
                "name": "gMiRate",
                "type": "float"
            },
            {
                "name": "gMiValue",
                "type": "float"
            },
            {
                "name": "gIncValue",
                "type": "float"
            },
            {
                "name": "gInc1",
                "type": "float"
            },
            {
                "name": "gInc2",
                "type": "float"
            },
            {
                "name": "gInc3",
                "type": "float"
            },
            {
                "name": "gInc4",
                "type": "float"
            },
            {
                "name": "gPreInc",
                "type": "float"
            },
            {
                "name": "gSmoothness",
                "type": "tinyint"
            },
            {
                "name": "rMiRate",
                "type": "float"
            },
            {
                "name": "rMiValue",
                "type": "float"
            },
            {
                "name": "rIncValue",
                "type": "float"
            },
            {
                "name": "rInc1",
                "type": "float"
            },
            {
                "name": "rInc2",
                "type": "float"
            },
            {
                "name": "rInc3",
                "type": "float"
            },
            {
                "name": "rInc4",
                "type": "float"
            },
            {
                "name": "rPreInc",
                "type": "float"
            },
            {
                "name": "rSmoothness",
                "type": "tinyint"
            }
        ],
        "update": true
    },
    "ixindustry": {
        "name": "IXIndustry",
        "type": "ix",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "ix",
                "type": "id"
            },
            {
                "name": "xi",
                "type": "id"
            }
        ],
        "ixx": false,
        "hasSort": false,
        "xiType": 0
    },
    "searchstock": {
        "name": "SearchStock",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "$orderSwitch",
                "type": "char",
                "size": 50
            },
            {
                "name": "key",
                "type": "char",
                "size": 20
            },
            {
                "name": "market",
                "type": "char",
                "size": 100
            },
            {
                "name": "smooth",
                "type": "int"
            }
        ],
        "orderSwitch": [
            "miratedesc",
            "dvratedesc",
            "roedesc",
            "mirateasc",
            "dvrateasc",
            "roeasc"
        ],
        "returns": [
            {
                "name": "$page",
                "fields": [
                    {
                        "name": "$order",
                        "type": "int"
                    },
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "market",
                        "type": "id"
                    },
                    {
                        "name": "no",
                        "type": "char",
                        "size": 20
                    },
                    {
                        "name": "name",
                        "type": "char",
                        "size": 50
                    },
                    {
                        "name": "rawId",
                        "type": "id"
                    },
                    {
                        "name": "earning",
                        "type": "float"
                    },
                    {
                        "name": "divident",
                        "type": "float"
                    },
                    {
                        "name": "price",
                        "type": "float"
                    },
                    {
                        "name": "roe",
                        "type": "float"
                    },
                    {
                        "name": "volumn",
                        "type": "float"
                    },
                    {
                        "name": "dvRate",
                        "type": "float"
                    },
                    {
                        "name": "ttm",
                        "type": "float"
                    },
                    {
                        "name": "miRate",
                        "type": "float"
                    },
                    {
                        "name": "miValue",
                        "type": "float"
                    },
                    {
                        "name": "incValue",
                        "type": "float"
                    },
                    {
                        "name": "inc1",
                        "type": "float"
                    },
                    {
                        "name": "inc2",
                        "type": "float"
                    },
                    {
                        "name": "inc3",
                        "type": "float"
                    },
                    {
                        "name": "inc4",
                        "type": "float"
                    },
                    {
                        "name": "preInc",
                        "type": "float"
                    },
                    {
                        "name": "smoothness",
                        "type": "tinyint"
                    },
                    {
                        "name": "gMiRate",
                        "type": "float"
                    },
                    {
                        "name": "gMiValue",
                        "type": "float"
                    },
                    {
                        "name": "gIncValue",
                        "type": "float"
                    },
                    {
                        "name": "gInc1",
                        "type": "float"
                    },
                    {
                        "name": "gInc2",
                        "type": "float"
                    },
                    {
                        "name": "gInc3",
                        "type": "float"
                    },
                    {
                        "name": "gInc4",
                        "type": "float"
                    },
                    {
                        "name": "gPreInc",
                        "type": "float"
                    },
                    {
                        "name": "gSmoothness",
                        "type": "tinyint"
                    },
                    {
                        "name": "rMiRate",
                        "type": "float"
                    },
                    {
                        "name": "rMiValue",
                        "type": "float"
                    },
                    {
                        "name": "rIncValue",
                        "type": "float"
                    },
                    {
                        "name": "rInc1",
                        "type": "float"
                    },
                    {
                        "name": "rInc2",
                        "type": "float"
                    },
                    {
                        "name": "rInc3",
                        "type": "float"
                    },
                    {
                        "name": "rInc4",
                        "type": "float"
                    },
                    {
                        "name": "rPreInc",
                        "type": "float"
                    },
                    {
                        "name": "rSmoothness",
                        "type": "tinyint"
                    }
                ]
            }
        ]
    },
    "writestock": {
        "name": "WriteStock",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "isOpen": true,
        "arrs": [
            {
                "name": "stocks",
                "fields": [
                    {
                        "name": "market",
                        "type": "char",
                        "size": 100
                    },
                    {
                        "name": "no",
                        "type": "char",
                        "size": 20
                    },
                    {
                        "name": "name",
                        "type": "char",
                        "size": 50
                    },
                    {
                        "name": "rawId",
                        "type": "bigint"
                    },
                    {
                        "name": "incValue",
                        "type": "float"
                    },
                    {
                        "name": "earning",
                        "type": "float"
                    },
                    {
                        "name": "divident",
                        "type": "float"
                    },
                    {
                        "name": "roe",
                        "type": "float"
                    },
                    {
                        "name": "inc1",
                        "type": "float"
                    },
                    {
                        "name": "inc2",
                        "type": "float"
                    },
                    {
                        "name": "inc3",
                        "type": "float"
                    },
                    {
                        "name": "inc4",
                        "type": "float"
                    },
                    {
                        "name": "preInc",
                        "type": "float"
                    },
                    {
                        "name": "volumn",
                        "type": "float"
                    },
                    {
                        "name": "smoothness",
                        "type": "tinyint"
                    }
                ]
            }
        ],
        "returns": [] as any
    },
    "writegrossandrevenue": {
        "name": "WriteGrossAndRevenue",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "isOpen": true,
        "arrs": [
            {
                "name": "stocks",
                "fields": [
                    {
                        "name": "rawId",
                        "type": "bigint"
                    },
                    {
                        "name": "gIncValue",
                        "type": "float"
                    },
                    {
                        "name": "gInc1",
                        "type": "float"
                    },
                    {
                        "name": "gInc2",
                        "type": "float"
                    },
                    {
                        "name": "gInc3",
                        "type": "float"
                    },
                    {
                        "name": "gInc4",
                        "type": "float"
                    },
                    {
                        "name": "gPreInc",
                        "type": "float"
                    },
                    {
                        "name": "gSmoothness",
                        "type": "tinyint"
                    },
                    {
                        "name": "rIncValue",
                        "type": "float"
                    },
                    {
                        "name": "rInc1",
                        "type": "float"
                    },
                    {
                        "name": "rInc2",
                        "type": "float"
                    },
                    {
                        "name": "rInc3",
                        "type": "float"
                    },
                    {
                        "name": "rInc4",
                        "type": "float"
                    },
                    {
                        "name": "rPreInc",
                        "type": "float"
                    },
                    {
                        "name": "rSmoothness",
                        "type": "tinyint"
                    }
                ]
            }
        ],
        "returns": [] as any
    },
    "writeprice": {
        "name": "WritePrice",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "isOpen": true,
        "arrs": [
            {
                "name": "prices",
                "fields": [
                    {
                        "name": "market",
                        "type": "char",
                        "size": 100
                    },
                    {
                        "name": "no",
                        "type": "char",
                        "size": 20
                    },
                    {
                        "name": "name",
                        "type": "char",
                        "size": 50
                    },
                    {
                        "name": "rawId",
                        "type": "bigint"
                    },
                    {
                        "name": "price",
                        "type": "float"
                    },
                    {
                        "name": "pvolumn",
                        "type": "float"
                    },
                    {
                        "name": "date",
                        "type": "int"
                    }
                ]
            }
        ],
        "returns": [] as any
    },
    "writeindustrystock": {
        "name": "WriteIndustryStock",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "industry",
                "type": "char",
                "size": 20
            }
        ],
        "isOpen": true,
        "arrs": [
            {
                "name": "stocks",
                "fields": [
                    {
                        "name": "rawId",
                        "type": "bigint"
                    }
                ]
            }
        ],
        "returns": [] as any
    },
    "writestockindustry": {
        "name": "WriteStockIndustry",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "rawId",
                "type": "bigint"
            }
        ],
        "isOpen": true,
        "arrs": [
            {
                "name": "industries",
                "fields": [
                    {
                        "name": "industry",
                        "type": "char",
                        "size": 20
                    }
                ]
            }
        ],
        "returns": [] as any
    }
}