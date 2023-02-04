export type AccountType = 'email' | 'mobile';

export interface Pass {
    account: string;
    password: string;
    verify: string;
    type: AccountType;
    login: () => void;
}
