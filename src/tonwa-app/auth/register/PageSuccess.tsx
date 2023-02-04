import { Pass } from "./Pass";

export function RegisterSuccess({ pass }: { pass: Pass }) {
	let { account, login } = pass;
	return <div className="container w-max-30c">
		<div className="my-5">
			<div className="py-5 text-center">
				账号 <strong className="text-primary">{account} </strong> 注册成功！
			</div>
			<button className="btn btn-success btn-block" type="button" onClick={() => login()}>
				直接登录
			</button>
		</div>
	</div>;
}

export function ForgetSuccess({ pass }: { pass: Pass }) {
	let { login } = pass;
	return <div className="container w-max-30c">
		<div className="my-5">
			<div className="py-5 text-center text-success">成功修改密码</div>
			<button className="btn btn-primary btn-block" onClick={() => login()}>
				登录账号
			</button>
		</div>
	</div>
}
