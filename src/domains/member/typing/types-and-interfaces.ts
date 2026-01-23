export interface I_Member {
	id: string;
	nickName: string;
	email: string;
	firstName: string;
	lastName: string;
	role?: "admin" | "user" | "guest";
}
