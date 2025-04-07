import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Credits - Move Poetry Magazine",
  description:
    "Credits and acknowledgments for the Move poetry magazine digital archive.",
};

export default function CreditsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Move Magazine</h1>
          <p>(Volume 1 - Issue 2 / October 1989)</p>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">About &amp; Credits</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <section>
              <div className="grid gap-4 md:grid-cols-2">
                <p className="text-muted-foreground mb-3">
                  This digital archive of Move magazine is made possible with
                  thanks to Asneem for providing the original print copy in
                  fantastic condition for digitisation. Thanks, man!
                </p>
                <p className="text-muted-foreground">
                  However, the cover was missing from that copy. A scan of the
                  cover was provided by Mohamed Faisal - the then editor of this
                  issue of Move Magazine - who also wrote the Foreword for this
                  issue. Many thanks to him for that!
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Digitisation, Web Development and UI/UX design by Simon (who
                    also wrote some of the cringe poetry in this issue 😅).{" "}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    This project is Open Source and available on{" "}
                    <Link
                      className="text-blue-500"
                      href="https://github.com/nxtrs2/movemag"
                    >
                      GitHub here
                    </Link>
                    .
                  </p>
                  <p className="text-muted-foreground">
                    The project is built using Next.js, Tailwind CSS, and Radix
                    UI and is hosted freely on Netlify.
                  </p>
                </div>
              </div>
            </section>
            <Separator />
          </CardContent>

          <CardFooter>
            <Button asChild>
              <Link href="/">Return to Archive</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
