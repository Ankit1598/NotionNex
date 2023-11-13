"use client";

import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthUser } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import {
	getUserAvatarUrl,
	getUserSubscriptionStatus
} from "../supabase/queries";
import { Subscription } from "../supabase/supabase.types";

type SupabaseUserContextType = {
	user: (AuthUser & { avatarUrl: string | undefined }) | null;
	subscription: Subscription | null;
};

const SupabaseUserContext = createContext<SupabaseUserContextType>({
	user: null,
	subscription: null
});

export const useSupabaseUser = () => {
	return useContext(SupabaseUserContext);
};

interface SupabaseUserProviderProps {
	children: React.ReactNode;
}

export const SupabaseUserProvider: React.FC<SupabaseUserProviderProps> = ({
	children
}) => {
	const [user, setUser] = useState<
		(AuthUser & { avatarUrl: string | undefined }) | null
	>(null);
	const [subscription, setSubscription] = useState<Subscription | null>(null);
	const { toast } = useToast();

	const supabase = createClientComponentClient();

	//Fetch the user details
	//subscription
	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user }
			} = await supabase.auth.getUser();

			if (user) {
				const { data: avatarUrl } = await getUserAvatarUrl(user.id);

				let avatarPath;
				if (!avatarUrl) avatarPath = "";
				else {
					avatarPath = supabase.storage
						.from("avatars")
						.getPublicUrl(avatarUrl)?.data.publicUrl;
				}

				const profile = {
					...user,
					avatarUrl: avatarPath
				};
				setUser(profile);

				const { data, error } = await getUserSubscriptionStatus(
					user.id
				);
				if (data) setSubscription(data);
				if (error) {
					toast({
						title: "Unexpected Error",
						description:
							"Oppse! An unexpected error happened. Try again later."
					});
				}
			}
		};

		getUser();
	}, [supabase, toast]);

	return (
		<SupabaseUserContext.Provider value={{ user, subscription }}>
			{children}
		</SupabaseUserContext.Provider>
	);
};
