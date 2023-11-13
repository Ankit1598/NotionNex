import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Price } from "./supabase/supabase.types";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatPrice = (price: Price) =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: price.currency || undefined,
		minimumFractionDigits: 0
	}).format((price?.unitAmount || 0) / 100);

export const getURL = () => {
	let url = process?.env?.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000/";

	url = url.startsWith("http") ? url : `https://${url}`;
	url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

	return url;
};

export const postData = async ({
	url,
	data
}: {
	url: string;
	data?: { price: Price };
}) => {
	const res: Response = await fetch(url, {
		method: "POST",
		headers: new Headers({ "Content-Type": "application/json" }),
		credentials: "same-origin",
		body: data ? JSON.stringify(data) : null
	});
	console.log({
		url,
		method: "POST",
		headers: new Headers({ "Content-Type": "application/json" }),
		credentials: "same-origin",
		body: data ? JSON.stringify(data) : null
	});

	if (!res.ok) {
		console.log("Error in postData", { url, data, res });
		throw Error(res.statusText);
	}

	return res.json();
};

export const toDateTime = (secs: number) =>
	new Date(new Date("1970-01-01T00:30:00Z").setSeconds(secs));
