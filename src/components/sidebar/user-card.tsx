"use client";

import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { Subscription } from "@/lib/supabase/supabase.types";
import { LogOut } from "lucide-react";
import React from "react";
import LogoutButton from "../global/logout-button";
import ModeToggle from "../global/mode-toggle";
import ProfileIcon from "../icons/ProfileIcon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserCardProps {
	subscription: Subscription | null;
}

const UserCard: React.FC<UserCardProps> = ({ subscription }) => {
	const { user } = useSupabaseUser();

	if (!user) return;

	return (
		<article className='hidden sm:flex justify-between items-center px-4 py-2 dark:bg-neutrals-12 rounded-3xl'>
			<aside className='flex justify-center items-center gap-2'>
				<Avatar>
					<AvatarImage src={user.avatarUrl} />
					<AvatarFallback>
						<ProfileIcon />
					</AvatarFallback>
				</Avatar>
				<div className='flex flex-col'>
					<span className='text-muted-foreground'>
						{subscription?.status === "active"
							? "Pro Plan"
							: "Free Plan"}
					</span>
					<small className='w-[100px] overflow-hidden overflow-ellipsis'>
						{user.email}
					</small>
				</div>
			</aside>
			<div className='flex items-center justify-center'>
				<LogoutButton>
					<LogOut />
				</LogoutButton>
				<ModeToggle />
			</div>
		</article>
	);
};

export default UserCard;
