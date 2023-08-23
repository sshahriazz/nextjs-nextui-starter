import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();
  console.log("session form page", session);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"></section>
  );
}
