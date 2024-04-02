
import { Suspense } from "react";
import GithubLoginButton from "./github-login-button";
import GoogleLoginButton from "./google-login-button";

export default function LoginPage() {
	return (
		<div className="mx-5 border border-stone-200 py-10 dark:border-stone-700 sm:mx-auto sm:w-full sm:max-w-lg sm:rounded-lg sm:shadow-md">
			
			<h1 className="mt-6 text-center font-cal text-3xl dark:text-white">
				Savimo.app
			</h1>
			<p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">
				Manage your expenses with Savimo.app <br />
				
			</p>

			<div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
				<Suspense
					fallback={
						<div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
					}
				>
					<GithubLoginButton />
					<GoogleLoginButton />
				</Suspense>
			</div>
		</div>
	);
}
