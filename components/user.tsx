"use client"

import { useState, useEffect } from "react"
import { Package, ShoppingBag, MapPin, Phone, Mail, Clock, Upload, X, Check, Edit } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db, storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function UserAccount() {
    const { currentUser } = useAuth()
    const [isLoading, setIsLoading] = useState(true)

    // Customer data with state
    const [customer, setCustomer] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        avatarUrl: "/placeholder.svg?height=80&width=80",
        memberSince: "",
    })

    const [isEditing, setIsEditing] = useState(false)
    const [formValues, setFormValues] = useState({ ...customer })
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(customer.avatarUrl)

    // Orders state
    const [currentOrders, setCurrentOrders] = useState([])
    const [orderHistory, setOrderHistory] = useState([])
    const [totalSpent, setTotalSpent] = useState(0)

    // Fetch user data from Firestore
    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) return

            try {
                setIsLoading(true)

                console.log("Current user object:", currentUser)
                console.log("Display name:", currentUser.displayName)
                console.log("Email:", currentUser.email)
                console.log("Photo URL:", currentUser.photoURL)
                // Get user profile from Firestore
                const userRef = doc(db, "users", currentUser.uid)
                const userSnap = await getDoc(userRef)

                if (userSnap.exists()) {
                    const userData = userSnap.data()

                    // Format the timestamp to a readable date
                    const memberSince = userData.createdAt
                        ? new Date(userData.createdAt.toDate()).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                        : new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })

                    const customerData = {
                        id: `CUST-${currentUser.uid.substring(0, 5)}`,
                        name: userData.name || currentUser.displayName || "User",
                        email: userData.email || currentUser.email || "",
                        phone: userData.phone || "",
                        address: userData.address || "",
                        avatarUrl: userData.avatarUrl || currentUser.photoURL || "/placeholder.svg?height=80&width=80",
                        memberSince,
                    }

                    setCustomer(customerData)
                    setFormValues(customerData)
                    setAvatarPreview(customerData.avatarUrl)
                } else {
                    // Create a new user document if it doesn't exist
                    const newUser = {
                        name: currentUser.displayName || "User",
                        email: currentUser.email || "",
                        phone: "",
                        address: "",
                        avatarUrl: currentUser.photoURL || "/placeholder.svg?height=80&width=80",
                        createdAt: new Date(),
                    }

                    await updateDoc(userRef, newUser)

                    const customerData = {
                        id: `CUST-${currentUser.uid.substring(0, 5)}`,
                        ...newUser,
                        memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
                    }

                    setCustomer(customerData)
                    setFormValues(customerData)
                    setAvatarPreview(customerData.avatarUrl)
                }

                // Fetch orders
                await fetchOrders()
            } catch (error) {
                console.error("Error fetching user data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserData()
    }, [currentUser])

    // Fetch orders from Firestore
    const fetchOrders = async () => {
        if (!currentUser) return

        try {
            // Get current orders (status is not "Delivered")
            const currentOrdersQuery = query(
                collection(db, "orders"),
                where("userId", "==", currentUser.uid),
                where("status", "!=", "Delivered"),
                orderBy("status"),
                orderBy("date", "desc"),
            )

            const currentOrdersSnapshot = await getDocs(currentOrdersQuery)
            const currentOrdersData = currentOrdersSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))

            setCurrentOrders(currentOrdersData)

            // Get order history (status is "Delivered")
            const historyOrdersQuery = query(
                collection(db, "orders"),
                where("userId", "==", currentUser.uid),
                where("status", "==", "Delivered"),
                orderBy("date", "desc"),
            )

            const historyOrdersSnapshot = await getDocs(historyOrdersQuery)
            const historyOrdersData = historyOrdersSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))

            setOrderHistory(historyOrdersData)

            // Calculate total spent
            const allOrders = [...currentOrdersData, ...historyOrdersData]
            const total = allOrders.reduce((sum, order) => sum + (order.total || 0), 0)
            setTotalSpent(total)
        } catch (error) {
            console.error("Error fetching orders:", error)
        }
    }

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
    const handleSubmit = async () => {
        if (!currentUser) return

        try {
            setIsLoading(true)

            // Upload avatar if changed
            let avatarUrl = customer.avatarUrl
            if (avatarFile) {
                const storageRef = ref(storage, `avatars/${currentUser.uid}`)
                await uploadBytes(storageRef, avatarFile)
                avatarUrl = await getDownloadURL(storageRef)
            }

            // Update user document in Firestore
            const userRef = doc(db, "users", currentUser.uid)
            await updateDoc(userRef, {
                name: formValues.name,
                email: formValues.email,
                phone: formValues.phone,
                address: formValues.address,
                avatarUrl,
            })

            // Update local state
            setCustomer({
                ...customer,
                ...formValues,
                avatarUrl,
            })

            setIsEditing(false)
        } catch (error) {
            console.error("Error updating profile:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Cancel editing
    const handleCancel = () => {
        setFormValues({ ...customer })
        setAvatarPreview(customer.avatarUrl)
        setAvatarFile(null)
        setIsEditing(false)
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading your account information...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">My Account</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
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
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formValues.email}
                                                onChange={handleInputChange}
                                                disabled={currentUser?.providerData[0]?.providerId === "password"}
                                            />
                                            {currentUser?.providerData[0]?.providerId === "password" && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Email cannot be changed for email/password accounts
                                                </p>
                                            )}
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
                                        <Button onClick={handleSubmit} className="flex-1" disabled={isLoading}>
                                            {isLoading ? (
                                                <span className="flex items-center">
                                                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></span>
                                                  Saving...
                                                </span>
                                            ) : (
                                                <>
                                                    <Check className="h-4 w-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                        <Button variant="outline" onClick={handleCancel} className="flex-1" disabled={isLoading}>
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
                                                <p className="text-sm text-muted-foreground">{customer.phone || "Not provided"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium">Shipping Address</p>
                                                <p className="text-sm text-muted-foreground">{customer.address || "Not provided"}</p>
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
                </div>

                {/* Orders Section */}
                <div className="md:col-span-2 h-full">
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
