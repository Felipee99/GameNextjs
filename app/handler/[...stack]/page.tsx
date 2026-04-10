import { StackHandler } from "@stackframe/stack";
import BackHomeButton from "@/components/BackHome";

export default function Handler() {
  return (
    <div className="bg-purple min-h-dvh flex flex-col gap-2 p-4 items-center justify-center">
      <div className="hero min-h-screen bg-[url(/imgs/bg_home.png)]">
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content flex-col text-center">
          <div className="max-w-md bg-black/70 px-20 py-8 rounded backdrop-blur-md">
            <StackHandler fullPage={false}></StackHandler>
            <BackHomeButton></BackHomeButton>
          </div>
        </div>
      </div>
    </div>
  );
}
