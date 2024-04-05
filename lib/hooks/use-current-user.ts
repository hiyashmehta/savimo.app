import { useSession } from "next-auth/react";
import { USER_PROPS } from "../types";

export const useCurrentUser = () => {
	const session = useSession();
	if (session.status === "authenticated" && session.data?.user) {
		return session.data?.user as USER_PROPS;
	}
	return null;
};
