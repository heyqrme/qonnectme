
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Trash2, Eye, Edit, PlusCircle } from "lucide-react";
import Image from "next/image";

const users = [
    {
        id: "usr_1",
        name: "Jane Doe",
        username: "janedoe",
        email: "jane.doe@example.com",
        avatarUrl: "https://placehold.co/40x40.png",
        joined: "2023-10-26",
        status: "Active",
    },
    {
        id: "usr_2",
        name: "Alex Ray",
        username: "alexray",
        email: "alex.ray@example.com",
        avatarUrl: "https://placehold.co/40x40.png",
        joined: "2023-10-25",
        status: "Active",
    },
    {
        id: "usr_3",
        name: "Jordan Lee",
        username: "jordanlee",
        email: "jordan.lee@example.com",
        avatarUrl: "https://placehold.co/40x40.png",
        joined: "2023-10-25",
        status: "Active",
    },
    {
        id: "usr_4",
        name: "Casey Kim",
        username: "caseykim",
        email: "casey.kim@example.com",
        avatarUrl: "https://placehold.co/40x40.png",
        joined: "2023-10-24",
        status: "Inactive",
    },
    {
        id: "usr_5",
        name: "Taylor Smith",
        username: "taylorsmith",
        email: "taylor.smith@example.com",
        avatarUrl: "https://placehold.co/40x40.png",
        joined: "2023-10-22",
        status: "Active",
    }
];

const products = [
    { id: 1, name: "QR Code T-Shirt", price: 29.99, image: "https://placehold.co/100x100.png", hint: "tshirt mockup" },
    { id: 2, name: "QR Code Hoodie", price: 49.99, image: "https://placehold.co/100x100.png", hint: "hoodie mockup" },
    { id: 3, name: "QR Code Mug", price: 15.99, image: "https://placehold.co/100x100.png", hint: "mug mockup" },
    { id: 4, name: "QR Code Phone Case", price: 24.99, image: "https://placehold.co/100x100.png", hint: "phone case" },
    { id: 5, name: "QR Code Sticker Pack", price: 9.99, image: "https://placehold.co/100x100.png", hint: "stickers" },
    { id: 6, name: "QR Code Cap", price: 22.99, image: "https://placehold.co/100x100.png", hint: "cap mockup" },
];

export default function AdminDashboardPage() {
    return (
        <AppLayout>
            <main className="flex-1 p-4 md:p-8">
                <div className="max-w-6xl mx-auto grid gap-8">
                    <div className="mb-2">
                        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage users and other application settings.</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                            <CardDescription>A list of all users in the system.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                                        <TableHead className="hidden md:table-cell">Joined</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <Avatar>
                                                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person avatar"/>
                                                        <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                                            <TableCell className="hidden md:table-cell">{user.joined}</TableCell>
                                            <TableCell>
                                                <Badge variant={user.status === 'Active' ? 'default' : 'secondary'} className={user.status === 'Active' ? 'bg-green-600/20 text-green-400 border-green-600/30' : ''}>
                                                    {user.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="flex items-center gap-2"><Eye className="h-4 w-4" />View Profile</DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive"><Trash2 className="h-4 w-4" />Delete User</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Store Merchandise</CardTitle>
                                <CardDescription>Manage your store's products.</CardDescription>
                            </div>
                            <Button size="sm" className="flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Add Product
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="hidden sm:table-cell">
                                                <Image
                                                    alt={product.name}
                                                    className="aspect-square rounded-md object-cover"
                                                    height="64"
                                                    src={product.image}
                                                    width="64"
                                                    data-ai-hint={product.hint}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>${product.price.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="flex items-center gap-2"><Edit className="h-4 w-4" />Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive"><Trash2 className="h-4 w-4" />Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </AppLayout>
    );
}
