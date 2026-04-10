"use client";
import Link from "next/link";
import Image from "next/image";
import { FingerprintIcon, UserPlusIcon } from "@phosphor-icons/react"; 

export default function HomeInfo() { 
  return (
    <div className="bg-purple-500 min-h-dvh flex flex-col gap-2 p-1 items-center justify-center">
      <div className="hero min-h-screen bg-[url(/imgs/bg_home.png)]">
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-1 text-5xl font-bold">
              <Image
                src="/imgs/logi.png"
                width={550}
                height={96}
                alt="logo"
              />
            </h1>
            <p className="my-2 text-justify">
              <strong>GameNext.js</strong> is a modern platform to manage and
              organize videogames. Built with Next.js, it uses Prisma, Neon
              database, and Stack Auth to provide secure authentication, fast
              performance, and scalable data management.
            </p>
            <Link href="handler/sign-in" className="btn  btn-outline me-4 px-10 mt-8 btn-outline">
              <FingerprintIcon size={32} />
              sign in
            </Link>
            <Link href="handler/sign-up" className="btn btn-outline px-10 mt-8 btn-outline">
              <UserPlusIcon size={32} />
              sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}