"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

export default function AppPage() {
	const { data } = useSession();

	if (data)
		return (
			<div>
				AppPage
				<Button onClick={() => signOut()}>Sign out</Button>
				<h1>Welcome {data?.user?.name}</h1>
				<p>Your email is {data?.user?.email}</p>
				<Image
					src={data?.user?.image ?? "/profile.png"}
					alt="Profile picture"
					width={100}
					height={100}
					unoptimized
				/>
			</div>
		);
}
