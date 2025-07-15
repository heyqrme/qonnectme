
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Image as ImageIcon, MessageCircle, UserCheck, UserPlus, UserX, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ActivityItem = {
  id: string;
  type: 'new_friend' | 'new_photo' | 'new_post' | 'new_video' | 'friend_request';
  user: {
    name: string;
    username: string;
    avatarUrl: string;
  };
  timestamp: string;
  content?: string;
  imageUrl?: string;
  imageHint?: string;
};

const activityFeed: ActivityItem[] = [
  {
    id: '1',
    type: 'new_photo',
    user: { name: 'Alex Ray', username: 'alexray', avatarUrl: 'https://placehold.co/40x40.png' },
    timestamp: '2 hours ago',
    imageUrl: 'https://placehold.co/300x200.png',
    imageHint: 'concert lights',
    content: 'Last night was epic! 🎸',
  },
  {
    id: '5',
    type: 'friend_request',
    user: { name: 'Morgan Riley', username: 'morganriley', avatarUrl: 'https://placehold.co/40x40.png' },
    timestamp: '3 hours ago',
  },
  {
    id: '2',
    type: 'new_friend',
    user: { name: 'Jordan Lee', username: 'jordanlee', avatarUrl: 'https://placehold.co/40x40.png' },
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    type: 'new_post',
    user: { name: 'Casey Kim', username: 'caseykim', avatarUrl: 'https://placehold.co/40x40.png' },
    timestamp: '1 day ago',
    content: 'Just discovered a new chillwave artist, totally recommend checking out their stuff. Perfect for late-night coding sessions. 🎧',
  },
  {
    id: '4',
    type: 'new_video',
    user: { name: 'Taylor Smith', username: 'taylorsmith', avatarUrl: 'https://placehold.co/40x40.png' },
    timestamp: '2 days ago',
    imageUrl: 'https://placehold.co/300x200.png',
    imageHint: 'skateboarding video',
    content: 'Working on some new tricks!',
  },
];

const ActivityCard = ({ activity }: { activity: ActivityItem }) => {
  const renderContent = () => {
    switch (activity.type) {
      case 'new_friend':
        return (
          <div className="flex items-center gap-4">
            <UserPlus className="h-6 w-6 text-accent" />
            <p>You and <Link href="#" className="font-semibold hover:underline">{activity.user.name}</Link> are now friends.</p>
          </div>
        );
      case 'friend_request':
        return (
            <p><Link href="#" className="font-semibold hover:underline">{activity.user.name}</Link> sent you a friend request.</p>
        );
      case 'new_post':
        return (
            <p className="text-muted-foreground whitespace-pre-wrap">{activity.content}</p>
        );
      case 'new_photo':
      case 'new_video':
        return (
          <div className="space-y-4">
            {activity.content && <p className="text-muted-foreground">{activity.content}</p>}
            <div className="rounded-lg overflow-hidden border relative">
              <Image src={activity.imageUrl!} alt="User media" width={300} height={200} className="w-full h-auto object-cover" data-ai-hint={activity.imageHint} />
              {activity.type === 'new_video' && (
                 <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Video className="h-12 w-12 text-white/80" />
                 </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderActions = () => {
    if (activity.type === 'friend_request') {
      return (
        <div className="flex gap-2 mt-4">
            <Button size="sm"><UserCheck className="mr-2 h-4 w-4" /> Accept</Button>
            <Button size="sm" variant="outline"><UserX className="mr-2 h-4 w-4" /> Decline</Button>
        </div>
      );
    }
    if (activity.type !== 'new_friend') {
        return (
            <div className="flex gap-4 mt-4 text-muted-foreground">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" /> 12
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> 3
                </Button>
            </div>
        );
    }
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
            <Avatar>
                <AvatarImage src={activity.user.avatarUrl} alt={activity.user.name} data-ai-hint="person avatar"/>
                <AvatarFallback>{activity.user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                    <Link href="#" className="font-semibold hover:underline">{activity.user.name}</Link>
                    <span className="text-muted-foreground">@{activity.user.username}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{activity.timestamp}</span>
                </div>
                <div className="mt-2">{renderContent()}</div>
                {renderActions()}
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ActivityPage() {
  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-headline">Activity Feed</h1>
                <p className="text-muted-foreground">See what's new in your network.</p>
            </div>
            <div className="space-y-6">
                {activityFeed.map((activity) => <ActivityCard key={activity.id} activity={activity} />)}
            </div>
        </div>
      </main>
    </AppLayout>
  );
}
