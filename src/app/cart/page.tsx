
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import Image from "next/image";

export default function CartPage() {
    const cartItems = [
        { id: 1, name: "QR Code T-Shirt", price: 29.99, image: "https://placehold.co/100x100.png", hint: "tshirt mockup", quantity: 1 },
        { id: 2, name: "QR Code Hoodie", price: 49.99, image: "https://placehold.co/100x100.png", hint: "hoodie mockup", quantity: 1 },
    ];

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 5.00;
    const total = subtotal + shipping;
    
    return (
        <AppLayout>
            <main className="flex-1 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl font-headline">Your Cart</CardTitle>
                            <CardDescription>Review your items and proceed to checkout.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="w-24 h-24 bg-secondary rounded-md overflow-hidden">
                                         <Image src={item.image} alt={item.name} width={100} height={100} className="w-full h-full object-cover" data-ai-hint={item.hint} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p>Qty: {item.quantity}</p>
                                        <Button variant="outline" size="icon">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Subtotal</p>
                                    <p>${subtotal.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Shipping</p>
                                    <p>${shipping.toFixed(2)}</p>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <p>Total</p>
                                    <p>${total.toFixed(2)}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button size="lg" className="w-full">Proceed to Checkout</Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </AppLayout>
    );
}
