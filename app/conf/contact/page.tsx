"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        setTimeout(() => {
            toast({
                title: "Message sent!",
                description: "We'll get back to you as soon as possible.",
            })
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            })
            setIsSubmitting(false)
        }, 1500)
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="mb-6 flex items-center gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>

                <h1 className="text-3xl font-serif mb-6">Contact Us</h1>
                <p className="text-gray-600 mb-8">
                    Have questions or feedback? We'd love to hear from you. Fill out the form below or use our contact
                    information.
                </p>

                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Your Name</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <span className="flex items-center">
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                      <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                      ></circle>
                      <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                                ) : (
                                    "Send Message"
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-medium mb-6">Contact Information</h2>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <MapPin className="h-5 w-5 text-amber-500 mr-3 mt-1" />
                                <div>
                                    <h3 className="font-medium">Address</h3>
                                    <p className="text-gray-600">29 Firswood Avenue, Epsom, KT19 0PU, London</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Phone className="h-5 w-5 text-amber-500 mr-3 mt-1" />
                                <div>
                                    <h3 className="font-medium">Phone</h3>
                                    <p className="text-gray-600">+44 7850 283839</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Mail className="h-5 w-5 text-amber-500 mr-3 mt-1" />
                                <div>
                                    <h3 className="font-medium">Email</h3>
                                    <p className="text-gray-600">info@lankashop.co.uk</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Business Hours</h3>
                                <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                                <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
                                <p className="text-gray-600">Sunday: Closed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
