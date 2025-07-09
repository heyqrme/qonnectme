
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function StorePage() {
    const products = [
        { id: 1, name: "QR Code T-Shirt", price: 29.99, image: "https://placehold.co/400x400.png", hint: "tshirt mockup" },
        { id: 2, name: "QR Code Hoodie", price: 49.99, image: "https://placehold.co/400x400.png", hint: "hoodie mockup" },
        { id: 3, name: "QR Code Mug", price: 15.99, image: "https://placehold.co/400x400.png", hint: "mug mockup" },
        { id: 4, name: "QR Code Phone Case", price: 24.99, image: "https://placehold.co/400x400.png", hint: "phone case" },
        { id: 5, name: "QR Code Sticker Pack", price: 9.99, image: "https://placehold.co/400x400.png", hint: "stickers" },
        { id: 6, name: "QR Code Cap", price: 22.99, image: "https://placehold.co/400x400.png", hint: "cap mockup" },
    ];
    
    return (
        <AppLayout>
            <main className="flex-1 p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold font-headline">Qonnectme Store</h1>
                        <p className="text-muted-foreground mt-2">Get your personal QR code on our exclusive merch!</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <Card key={product.id} className="overflow-hidden group">
                                <CardHeader className="p-0">
                                    <div className="aspect-square bg-secondary">
                                        <Image src={product.image} alt={product.name} width={400} height={400} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={product.hint} />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <CardTitle className="text-lg">{product.name}</CardTitle>
                                    <p className="text-2xl font-semibold text-primary mt-1">${product.price}</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Button className="w-full">
                                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}
