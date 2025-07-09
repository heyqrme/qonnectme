
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, QrCode, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const user = {
    name: "Jane Doe",
    username: "janedoe",
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://qonnect.me/janedoe&bgcolor=1f1f1f&color=A080DD&qzone=1`,
    bio: "Music lover, photographer, adventurer. Living life one day at a time.",
    music: ["Lo-fi beats", "Indie Pop", "Chillwave"],
    photos: [
      { id: 1, url: "https://placehold.co/600x400.png", hint: "concert crowd" },
      { id: 2, url: "https://placehold.co/600x400.png", hint: "mountain landscape" },
      { id: 3, url: "https://placehold.co/600x400.png", hint: "city skyline" },
    ],
  };

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My QR Code</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4">
              <div className="p-4 bg-white rounded-lg">
                <Image src={user.qrCodeUrl} alt="Your QR Code" width={200} height={200} />
              </div>
              <p className="text-xs text-muted-foreground">Scan to view my profile</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Share2 className="mr-2 h-4 w-4" /> Share My Code
              </Button>
            </CardFooter>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p>{user.bio}</p>
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2"><Music className="h-4 w-4 text-accent" /> My Jams</h3>
                <div className="flex flex-wrap gap-2">
                  {user.music.map((genre) => (
                    <div key={genre} className="rounded-full border border-accent/50 bg-accent/10 px-3 py-1 text-sm text-accent">{genre}</div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
                <Button asChild variant="outline">
                    <Link href="/profile">View Full Profile</Link>
                </Button>
            </CardFooter>
          </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>My Media</CardTitle>
                <CardDescription>A glimpse into my world.</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.photos.map((photo) => (
                <div key={photo.id} className="overflow-hidden rounded-lg group">
                    <Image
                    src={photo.url}
                    alt="User photo"
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    data-ai-hint={photo.hint}
                    />
                </div>
                ))}
            </div>
            </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
