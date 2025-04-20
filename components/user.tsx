"use client"

import { useState } from "react"
import { Package, ShoppingBag, MapPin, Phone, Mail, Clock, Upload, X, Check, Edit, MoveLeft } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link";

export default function User() {
    const [customer, setCustomer] = useState({
        id: "CUST-12345",
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main Street, Apt 4B, New York, NY 10001",
        avatarUrl: "/placeholder.svg?height=80&width=80",
        memberSince: "April 2025",
    })

    // State for editing mode
    const [isEditing, setIsEditing] = useState(false)
    // Temporary state for form values
    const [formValues, setFormValues] = useState({ ...customer })
    // State for avatar upload
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(customer.avatarUrl)

    // Mock current orders
    const currentOrders = [
        {
            id: "ORD-9876",
            date: "June 15, 2023",
            status: "Processing",
            items: [
                { name: "Wireless Headphones", quantity: 1, price: 129.99 },
                { name: "Phone Case", quantity: 1, price: 24.99 },
            ],
            total: 154.98,
            estimatedDelivery: "June 20, 2023",
        },
    ]

    // Mock order history
    const orderHistory = [
        {
            id: "ORD-8765",
            date: "May 28, 2023",
            status: "Delivered",
            items: [{ name: "Smart Watch", quantity: 1, price: 249.99 }],
            total: 249.99,
        },
        {
            id: "ORD-7654",
            date: "April 15, 2023",
            status: "Delivered",
            items: [
                { name: "Bluetooth Speaker", quantity: 1, price: 79.99 },
                { name: "USB-C Cable", quantity: 2, price: 19.98 },
            ],
            total: 99.97,
        },
        {
            id: "ORD-6543",
            date: "March 2, 2023",
            status: "Delivered",
            items: [
                { name: "Laptop Sleeve", quantity: 1, price: 39.99 },
                { name: "Wireless Mouse", quantity: 1, price: 49.99 },
                { name: "HDMI Adapter", quantity: 1, price: 29.99 },
            ],
            total: 119.97,
        },
    ]

    // Calculate total spent
    const totalSpent = [...currentOrders, ...orderHistory].reduce((sum, order) => sum + order.total, 0)

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormValues({
            ...formValues,
            [name]: value,
        })
    }

    // Handle avatar change
    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAvatarFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    // Handle form submission
    const handleSubmit = () => {
        setCustomer({
            ...customer,
            ...formValues,
            avatarUrl: avatarPreview,
        })
        setIsEditing(false)
    }

    // Cancel editing
    const handleCancel = () => {
        setFormValues({ ...customer })
        setAvatarPreview(customer.avatarUrl)
        setAvatarFile(null)
        setIsEditing(false)
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between">
                <Link href={"/"}>
                    <MoveLeft />
                </Link>
                <h1 className="text-3xl font-bold mb-6">My Account</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Customer Profile Section */}
                <Card className="md:col-span-1">
                    <CardHeader className="pb-3">
                        <CardTitle>Customer Profile</CardTitle>
                        <CardDescription>Your personal information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isEditing ? (
                            // Edit Mode
                            <div className="space-y-4">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="relative mb-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src={avatarPreview || "/placeholder.svg"} alt={formValues.name} />
                                            <AvatarFallback>
                                                {formValues.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute bottom-0 right-0">
                                            <Label htmlFor="avatar-upload" className="cursor-pointer">
                                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                                    <Upload className="h-4 w-4" />
                                                </div>
                                            </Label>
                                            <Input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" name="name" value={formValues.name} onChange={handleInputChange} />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="email">Email</Label>
                                        <Input disabled={true} id="email" name="email" type="email" value={formValues.email} onChange={handleInputChange} />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" name="phone" value={formValues.phone} onChange={handleInputChange} />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="address">Shipping Address</Label>
                                        <Textarea
                                            id="address"
                                            name="address"
                                            value={formValues.address}
                                            onChange={handleInputChange}
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <Button onClick={handleSubmit} className="flex-1">
                                        <Check className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </Button>
                                    <Button variant="outline" onClick={handleCancel} className="flex-1">
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <>
                                <div className="flex flex-col items-center mb-6">
                                    <Avatar className="h-20 w-20 mb-4">
                                        <AvatarImage src={customer.avatarUrl || "/placeholder.svg"} alt={customer.name} />
                                        <AvatarFallback>
                                            {customer.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-xl font-semibold">{customer.name}</h3>
                                    <p className="text-sm text-muted-foreground">Customer ID: {customer.id}</p>
                                    <p className="text-sm text-muted-foreground">Member since {customer.memberSince}</p>
                                </div>

                                <Separator className="my-4" />

                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Email</p>
                                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Phone</p>
                                            <p className="text-sm text-muted-foreground">{customer.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Shipping Address</p>
                                            <p className="text-sm text-muted-foreground">{customer.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <Button variant="outline" className="w-full mt-6" onClick={() => setIsEditing(true)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Orders Section */}
                <div className="md:col-span-2">
                    <Tabs defaultValue="current">
                        <div className="flex items-center justify-between mb-4">
                            <TabsList>
                                <TabsTrigger value="current">Current Orders</TabsTrigger>
                                <TabsTrigger value="history">Order History</TabsTrigger>
                            </TabsList>
                            <div className="text-sm">
                                Total Spent: <span className="font-semibold">${totalSpent.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Current Orders Tab */}
                        <TabsContent value="current">
                            {currentOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {currentOrders.map((order) => (
                                        <Card key={order.id}>
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                                                        <CardDescription>Placed on {order.date}</CardDescription>
                                                    </div>
                                                    <Badge variant={order.status === "Processing" ? "outline" : "default"}>{order.status}</Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="text-sm font-medium mb-2">Items</h4>
                                                        <ul className="space-y-2">
                                                            {order.items.map((item, index) => (
                                                                <li key={index} className="flex justify-between text-sm">
                                  <span>
                                    {item.quantity}x {item.name}
                                  </span>
                                                                    <span>${item.price.toFixed(2)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <Separator />

                                                    <div className="flex justify-between font-medium">
                                                        <span>Total</span>
                                                        <span>${order.total.toFixed(2)}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span>Estimated delivery: {order.estimatedDelivery}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-10">
                                        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-medium mb-1">No Current Orders</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            You don't have any active orders at the moment.
                                        </p>
                                        <Button>Start Shopping</Button>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Order History Tab */}
                        <TabsContent value="history">
                            {orderHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {orderHistory.map((order) => (
                                        <Card key={order.id}>
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                                                        <CardDescription>Placed on {order.date}</CardDescription>
                                                    </div>
                                                    <Badge variant="secondary">{order.status}</Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="text-sm font-medium mb-2">Items ({order.items.length})</h4>
                                                        <ul className="space-y-2">
                                                            {order.items.map((item, index) => (
                                                                <li key={index} className="flex justify-between text-sm">
                                  <span>
                                    {item.quantity}x {item.name}
                                  </span>
                                                                    <span>${item.price.toFixed(2)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <Separator />

                                                    <div className="flex justify-between font-medium">
                                                        <span>Total</span>
                                                        <span>${order.total.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-10">
                                        <Package className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-medium mb-1">No Order History</h3>
                                        <p className="text-sm text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                                        <Button>Browse Products</Button>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
