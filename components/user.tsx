"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package, ShoppingBag, MapPin, Phone, Mail, Clock, Upload, X, Check, Edit, ChevronLeft } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db, storage, auth } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { signOut } from "firebase/auth"
import { motion } from "framer-motion"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function UserAccount() {
    const { currentUser } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

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

    // Sri Lankan pattern background (subtle)
    const pattern =
        "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23815c3d' fillOpacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    }

    const slideUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }

    // Fetch user data from Firestore
    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) {
                setIsLoading(false)
                return
            }

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

                    // Use setDoc instead of updateDoc for a new document
                    await setDoc(userRef, newUser)

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

    // Modify the fetchOrders function to match your Firestore structure
    const fetchOrders = async () => {
        if (!currentUser) return

        try {
            // Query all orders for the current user
            const ordersQuery = query(
                collection(db, "orders"),
                where("userId", "==", currentUser.uid),
                orderBy("createdAt", "desc"),
            )

            const ordersSnapshot = await getDocs(ordersQuery)
            const ordersData = ordersSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                // Parse date from ISO string to display format
                formattedDate: new Date(doc.data().createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            }))
            const current = ordersData.filter((order) => order.paymentStatus !== "completed")
            const history = ordersData.filter((order) => order.paymentStatus === "completed")

            setCurrentOrders(current)
            setOrderHistory(history)

            // Calculate total spent from all orders
            const total = ordersData.reduce((sum, order) => {
                // Convert string amount to number
                const amount = Number.parseFloat(order.totalAmount || "0")
                return sum + amount
            }, 0)

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

    // Handle logout
    const handleLogout = async () => {
        try {
            setIsLoading(true)
            await signOut(auth)
            router.push("/")
        } catch (error) {
            console.error("Error logging out:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div
                className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh] bg-[#1A1209] text-[#F5EFE0]"
                style={{ backgroundImage: pattern }}
            >
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9A566] mx-auto mb-4"></div>
                    <p className="text-[#F5EFE0]/70">Loading your account information...</p>
                </div>
            </div>
        )
    }

    return (
        <div
            className="container mx-auto py-8 px-4 bg-[#1A1209] text-[#F5EFE0] min-h-screen"
            style={{ backgroundImage: pattern }}
        >
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <Link href="/">
                    <Button
                        variant="ghost"
                        className="mb-6 flex items-center gap-2 text-[#D9A566] hover:text-[#F5EFE0] hover:bg-[#2A1A0A]"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </motion.div>

            <motion.h1
                className="text-3xl font-bold mb-6 text-[#D9A566]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                My Account
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div className="md:col-span-1 space-y-6" initial="hidden" animate="visible" variants={fadeIn}>
                    {/* Customer Profile Section */}
                    <Card className="md:col-span-1 bg-[#2A1A0A]/80 border-[#D9A566]/30 text-[#F5EFE0]">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-[#D9A566]">Customer Profile</CardTitle>
                            <CardDescription className="text-[#F5EFE0]/70">Your personal information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                // Edit Mode
                                <div className="space-y-4">
                                    <div className="flex flex-col items-center mb-6">
                                        <div className="relative mb-4">
                                            <Avatar className="h-20 w-20 border-2 border-[#D9A566]/30">
                                                <AvatarImage src={avatarPreview || "/placeholder.svg"} alt={formValues.name} />
                                                <AvatarFallback className="bg-[#8D3F2D] text-[#F5EFE0]">
                                                    {formValues.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute bottom-0 right-0">
                                                <Label htmlFor="avatar-upload" className="cursor-pointer">
                                                    <div className="h-8 w-8 rounded-full bg-[#D9A566] flex items-center justify-center text-[#1A1209]">
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
                                            <Label htmlFor="name" className="text-[#F5EFE0]">
                                                Full Name
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formValues.name}
                                                onChange={handleInputChange}
                                                className="bg-[#1A1209] border-[#D9A566]/30 text-[#F5EFE0] focus:border-[#D9A566] focus:ring-[#D9A566]/20"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="email" className="text-[#F5EFE0]">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formValues.email}
                                                onChange={handleInputChange}
                                                disabled={currentUser?.providerData[0]?.providerId === "password"}
                                                className="bg-[#1A1209] border-[#D9A566]/30 text-[#F5EFE0] focus:border-[#D9A566] focus:ring-[#D9A566]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                            />
                                            {currentUser?.providerData[0]?.providerId === "password" && (
                                                <p className="text-xs text-[#F5EFE0]/60 mt-1">
                                                    Email cannot be changed for email/password accounts
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="phone" className="text-[#F5EFE0]">
                                                Phone
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={formValues.phone}
                                                onChange={handleInputChange}
                                                className="bg-[#1A1209] border-[#D9A566]/30 text-[#F5EFE0] focus:border-[#D9A566] focus:ring-[#D9A566]/20"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="address" className="text-[#F5EFE0]">
                                                Shipping Address
                                            </Label>
                                            <Textarea
                                                id="address"
                                                name="address"
                                                value={formValues.address}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="bg-[#1A1209] border-[#D9A566]/30 text-[#F5EFE0] focus:border-[#D9A566] focus:ring-[#D9A566]/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            onClick={handleSubmit}
                                            className="flex-1 bg-[#8D3F2D] hover:bg-[#C14D33] text-[#F5EFE0] border-0"
                                            disabled={isLoading}
                                        >
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
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                            className="flex-1 border-[#D9A566]/30 text-[#F5EFE0] hover:bg-[#1A1209] hover:text-[#D9A566]"
                                            disabled={isLoading}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <>
                                    <div className="flex flex-col items-center mb-6">
                                        <Avatar className="h-20 w-20 mb-4 border-2 border-[#D9A566]/30">
                                            <AvatarImage src={customer.avatarUrl || "/placeholder.svg"} alt={customer.name} />
                                            <AvatarFallback className="bg-[#8D3F2D] text-[#F5EFE0]">
                                                {customer.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <h3 className="text-xl font-semibold text-[#F5EFE0]">{customer.name}</h3>
                                        <p className="text-sm text-[#F5EFE0]/70">Customer ID: {customer.id}</p>
                                        <p className="text-sm text-[#F5EFE0]/70">Member since {customer.memberSince}</p>
                                    </div>

                                    <Separator className="my-4 bg-[#D9A566]/20" />

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <Mail className="h-5 w-5 text-[#D9A566] mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-[#F5EFE0]">Email</p>
                                                <p className="text-sm text-[#F5EFE0]/70">{customer.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <Phone className="h-5 w-5 text-[#D9A566] mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-[#F5EFE0]">Phone</p>
                                                <p className="text-sm text-[#F5EFE0]/70">{customer.phone || "Not provided"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-5 w-5 text-[#D9A566] mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-[#F5EFE0]">Shipping Address</p>
                                                <p className="text-sm text-[#F5EFE0]/70">{customer.address || "Not provided"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full mt-6 border-[#D9A566]/30 text-[#F5EFE0] hover:bg-[#1A1209] hover:text-[#D9A566]"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="w-full mt-2 bg-[#8D3F2D] hover:bg-[#C14D33] text-[#F5EFE0] border-0"
                                        onClick={handleLogout}
                                    >
                                        Log Out
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Orders Section */}
                <motion.div className="md:col-span-2 h-full" initial="hidden" animate="visible" variants={slideUp}>
                    <Tabs defaultValue="current" className="text-[#F5EFE0]">
                        <div className="flex items-center justify-between mb-4">
                            <TabsList className="bg-[#2A1A0A] border border-[#D9A566]/30">
                                <TabsTrigger
                                    value="current"
                                    className="data-[state=active]:bg-[#8D3F2D] data-[state=active]:text-[#F5EFE0] text-[#F5EFE0]/70"
                                >
                                    Current Orders
                                </TabsTrigger>
                                <TabsTrigger
                                    value="history"
                                    className="data-[state=active]:bg-[#8D3F2D] data-[state=active]:text-[#F5EFE0] text-[#F5EFE0]/70"
                                >
                                    Order History
                                </TabsTrigger>
                            </TabsList>
                            <div className="text-sm text-[#F5EFE0]/70">
                                Total Spent: <span className="font-semibold text-[#D9A566]">${totalSpent.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Current Orders Tab */}
                        <TabsContent value="current">
                            {currentOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {currentOrders.map((order) => (
                                        <Card key={order.id} className="bg-[#2A1A0A]/80 border-[#D9A566]/30 text-[#F5EFE0]">
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-lg text-[#D9A566]">Order #{order.orderId || order.id}</CardTitle>
                                                        <CardDescription className="text-[#F5EFE0]/70">
                                                            Placed on {order.formattedDate}
                                                        </CardDescription>
                                                    </div>
                                                    <Badge
                                                        variant={order.paymentStatus === "paid" ? "default" : "outline"}
                                                        className="bg-[#2D5E3D] text-[#F5EFE0] hover:bg-[#2D5E3D]/80"
                                                    >
                                                        {order.paymentStatus === "paid" ? "Paid" : order.paymentStatus}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="text-sm font-medium mb-2 text-[#F5EFE0]">Items</h4>
                                                        <ul className="space-y-2">
                                                            {order.products &&
                                                                order.products.map((product, index) => (
                                                                    <li key={index} className="flex justify-between text-sm text-[#F5EFE0]/80">
                                    <span>
                                      {product.quantity}x {product.name}
                                    </span>
                                                                        <span className="text-[#D9A566]">
                                      ${Number.parseFloat(product.price).toFixed(2)}
                                    </span>
                                                                    </li>
                                                                ))}
                                                        </ul>
                                                    </div>

                                                    <Separator className="bg-[#D9A566]/20" />

                                                    <div className="flex justify-between font-medium">
                                                        <span className="text-[#F5EFE0]">Total</span>
                                                        <span className="text-[#D9A566]">
                              ${Number.parseFloat(order.totalAmount || "0").toFixed(2)}
                            </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-[#F5EFE0]/70">
                                                        <Clock className="h-4 w-4 text-[#D9A566]" />
                                                        <span>Payment via {order.paymentProvider || "unknown"}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="bg-[#2A1A0A]/80 border-[#D9A566]/30 text-[#F5EFE0]">
                                    <CardContent className="flex flex-col items-center justify-center py-10">
                                        <ShoppingBag className="h-12 w-12 text-[#D9A566] mb-4" />
                                        <h3 className="text-lg font-medium mb-1 text-[#F5EFE0]">No Current Orders</h3>
                                        <p className="text-sm text-[#F5EFE0]/70 mb-4">You don't have any active orders at the moment.</p>
                                        <Button className="bg-[#8D3F2D] hover:bg-[#C14D33] text-[#F5EFE0] border-0">Start Shopping</Button>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Order History Tab */}
                        <TabsContent value="history">
                            {orderHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {orderHistory.map((order) => (
                                        <Card key={order.id} className="bg-[#2A1A0A]/80 border-[#D9A566]/30 text-[#F5EFE0]">
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-lg text-[#D9A566]">Order #{order.orderId || order.id}</CardTitle>
                                                        <CardDescription className="text-[#F5EFE0]/70">
                                                            Placed on {order.formattedDate}
                                                        </CardDescription>
                                                    </div>
                                                    <Badge variant="secondary" className="bg-[#1A1209] text-[#D9A566] border border-[#D9A566]/30">
                                                        Completed
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="text-sm font-medium mb-2 text-[#F5EFE0]">
                                                            Items ({order.products ? order.products.length : 0})
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {order.products &&
                                                                order.products.map((product, index) => (
                                                                    <li key={index} className="flex justify-between text-sm text-[#F5EFE0]/80">
                                    <span>
                                      {product.quantity}x {product.name}
                                    </span>
                                                                        <span className="text-[#D9A566]">
                                      ${Number.parseFloat(product.price).toFixed(2)}
                                    </span>
                                                                    </li>
                                                                ))}
                                                        </ul>
                                                    </div>

                                                    <Separator className="bg-[#D9A566]/20" />

                                                    <div className="flex justify-between font-medium">
                                                        <span className="text-[#F5EFE0]">Total</span>
                                                        <span className="text-[#D9A566]">
                              ${Number.parseFloat(order.totalAmount || "0").toFixed(2)}
                            </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="bg-[#2A1A0A]/80 border-[#D9A566]/30 text-[#F5EFE0]">
                                    <CardContent className="flex flex-col items-center justify-center py-10">
                                        <Package className="h-12 w-12 text-[#D9A566] mb-4" />
                                        <h3 className="text-lg font-medium mb-1 text-[#F5EFE0]">No Order History</h3>
                                        <p className="text-sm text-[#F5EFE0]/70 mb-4">You haven't placed any orders yet.</p>
                                        <Button className="bg-[#8D3F2D] hover:bg-[#C14D33] text-[#F5EFE0] border-0">Browse Products</Button>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    )
}
