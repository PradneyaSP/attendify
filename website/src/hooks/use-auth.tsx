"use client"

import { onAuthStateChanged } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
	email: string | null;
	uid: string;
	displayName: string | null;
	photoURL: string | null;
}

export function useUserSession(initialUser : User | null) {
	// The initialUser comes from the server via a server component
	const [user, setUser] = useState(initialUser);
	const router = useRouter();

	useEffect(() => {
			const unsubscribe = onAuthStateChanged((authUser) => {
					setUser(authUser)
			})

			return () => unsubscribe()
			// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
			onAuthStateChanged((authUser) => {
					if (user === undefined) return

					// refresh when user changed to ease testing
					if (user?.email !== authUser?.email) {
							router.refresh()
					}
			})
			// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	return user;
}