"use client";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import React from "react";
import { Button } from "../ui/button";

const ModeToggle = () => {
	const { setTheme, theme } = useTheme();
	return (
		<Button
			variant='outline'
			size='icon'
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
		>
			<SunIcon className='h-[1.2rem] w-[1.2rem]rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
			<MoonIcon className='absolute h-[1.2rem] w-[1.2rem] scale-0 transition-alldark:rotate-0 dark:scale-100' />
		</Button>
	);
};

export default ModeToggle;
