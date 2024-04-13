/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from "next/og";

export const runtime = "edge";

export default async function PostOG() {
    return new ImageResponse(
        (
            <div tw="flex flex-col items-center w-full h-full bg-white">
                <div tw="flex flex-col items-center justify-center mt-8">
                    <h1 tw="text-6xl font-bold text-gray-900 leading-none tracking-tight">
                        Savimo.app
                    </h1>
                    <p tw="mt-4 text-xl text-gray-600 max-w-xl text-center">
                        Your personal finance tracker. Built with NextJS,
                        TailwindCSS and MySQL. Track all your transactions in
                        one place.
                    </p>
                    {/* <div tw="flex items-center justify-center">
                        <img
                            tw="w-12 h-12 rounded-full mr-4"
                            src={data.authorImage}
                            alt={data.authorName}
                        />
                        <p tw="text-xl font-medium text-gray-900">
                            by {data.authorName}
                        </p>
                    </div> */}
                    <img
                        tw="mt-4 w-5/6 rounded-2xl border border-gray-200 shadow-md"
                        src={"http://localhost:3000/app-preview.png"}
                        alt={"App Preview Image"}
                    />
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 600,
            emoji: "blobmoji",
        },
    );
}
