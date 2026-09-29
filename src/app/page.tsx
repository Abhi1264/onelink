import Link from "next/link";
import { ArrowRight, ArrowUpRight, BarChart3, Eye, GripVertical, Globe, Github } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
const REPO = "https://github.com/Abhi1264/onelink";

const features = [
  { icon: Globe, title: "Your own address", body: `A clean URL at ${ROOT_DOMAIN}/yourname, ready for every bio.` },
  { icon: GripVertical, title: "Drag to reorder", body: "Put what matters first. Changes go live the moment you drop." },
  { icon: Eye, title: "Hide without deleting", body: "Toggle seasonal links off and bring them back when you need them." },
  { icon: BarChart3, title: "Click counts", body: "See which links people actually open, per link, no setup." },
];

const sampleLinks = [
  { title: "Portfolio", host: "maya.design", clicks: 1284 },
  { title: "Latest case study", host: "medium.com", clicks: 842 },
  { title: "Book a call", host: "cal.com", clicks: 316 },
  { title: "Newsletter", host: "substack.com", clicks: 97 },
];

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-1">
            <a href={REPO} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className={buttonVariants({ variant: "ghost", size: "icon", className: "text-muted-foreground" })}>
              <Github />
            </a>
            <ThemeToggle />
            <Link href="/login" className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex" })}>
              Sign in
            </Link>
            <Link href="/signup" className={buttonVariants()}>
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:pt-28 lg:pb-32">
          <div>
            <h1 className="text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
              One link for everything you share.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Put your work, socials, and latest projects behind a single URL. Reorder with a drag, hide what&apos;s stale, and see what people click.
            </p>

            <form action="/signup" className="mt-9 flex max-w-md flex-col gap-2 sm:flex-row">
              <label className="flex h-11 flex-1 items-center rounded-lg border border-input bg-card px-3 font-mono text-sm shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
                <span className="sr-only">Choose a username</span>
                <span className="text-muted-foreground">{ROOT_DOMAIN}/</span>
                <input
                  name="username"
                  placeholder="yourname"
                  autoCapitalize="none"
                  spellCheck={false}
                  pattern="[a-zA-Z0-9_\-]{3,30}"
                  title="3-30 letters, numbers, - or _"
                  className="w-0 min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                />
              </label>
              <Button type="submit" size="lg" className="h-11 px-5">
                Claim it
                <ArrowRight />
              </Button>
            </form>
            <p className="mt-3 text-sm text-muted-foreground">Free and open source. Set up in under a minute.</p>
          </div>

          <ProfilePreview />
        </section>

        <section className="border-t">
          <div className="mx-auto grid max-w-6xl gap-x-10 gap-y-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:py-20">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <Icon className="size-5 text-muted-foreground" strokeWidth={1.75} />
                <h2 className="mt-4 font-semibold">{title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground sm:px-6">
          <span>© {new Date().getFullYear()} Onelink</span>
          <a href={REPO} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
            Source on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

function ProfilePreview() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-sm select-none">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-muted/60" />
      <div className="rounded-4xl border bg-background p-6 shadow-xl shadow-black/5">
        <div className="flex flex-col items-center">
          <span className="grid size-16 place-items-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">M</span>
          <p className="mt-3 font-semibold">@maya</p>
          <p className="font-mono text-xs text-muted-foreground">{ROOT_DOMAIN}/maya</p>
        </div>
        <ul className="mt-6 space-y-2.5">
          {sampleLinks.map((link) => (
            <li key={link.title} className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{link.title}</span>
                <span className="block truncate text-xs text-muted-foreground">{link.host}</span>
              </span>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">{link.clicks.toLocaleString()}</span>
              <ArrowUpRight className="size-3.5 text-muted-foreground" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
