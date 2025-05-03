import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
    title: "Privacy Policy | Lanka Shop",
    description: "Lanka Shop's privacy policy detailing how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="mb-6 flex items-center gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>

                <h1 className="text-3xl font-serif mb-6">Privacy Policy</h1>
                <p className="text-gray-600 mb-8">Last updated: May 3, 2023</p>

                <div className="prose max-w-none">
                    <p className="mb-4">
                        At Lanka Shop, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
                        and safeguard your information when you visit our website or make a purchase.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">Information We Collect</h2>
                    <p className="mb-4">We collect information that you provide directly to us, including:</p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Personal information (name, email address, postal address, phone number)</li>
                        <li>Order information (products purchased, payment details, shipping information)</li>
                        <li>Account information if you create an account</li>
                        <li>Communications you send to us</li>
                    </ul>

                    <p className="mb-4">
                        We also automatically collect certain information when you visit our website, including:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Log information (IP address, browser type, pages viewed)</li>
                        <li>Device information</li>
                        <li>Location information</li>
                        <li>Cookie data</li>
                    </ul>

                    <h2 className="text-xl font-medium mt-8 mb-4">How We Use Your Information</h2>
                    <p className="mb-4">We use the information we collect to:</p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Process and fulfill your orders</li>
                        <li>Communicate with you about orders, products, and services</li>
                        <li>Improve our website and customer service</li>
                        <li>Personalize your shopping experience</li>
                        <li>Send marketing communications (if you've opted in)</li>
                        <li>Comply with legal obligations</li>
                    </ul>

                    <h2 className="text-xl font-medium mt-8 mb-4">Sharing Your Information</h2>
                    <p className="mb-4">We may share your information with:</p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Service providers who perform services on our behalf</li>
                        <li>Payment processors to process transactions</li>
                        <li>Shipping companies to deliver your orders</li>
                        <li>Legal authorities when required by law</li>
                    </ul>

                    <h2 className="text-xl font-medium mt-8 mb-4">Your Rights</h2>
                    <p className="mb-4">You have the right to:</p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Access the personal information we hold about you</li>
                        <li>Request correction of inaccurate information</li>
                        <li>Request deletion of your information</li>
                        <li>Object to our processing of your information</li>
                        <li>Withdraw consent for marketing communications</li>
                    </ul>

                    <h2 className="text-xl font-medium mt-8 mb-4">Contact Us</h2>
                    <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
                    <p className="mb-4">
                        Email: privacy@lankashop.co.uk
                        <br />
                        Address: 29 Firswood Avenue, Epsom, KT19 0PU, London
                    </p>
                </div>
            </div>
        </div>
    )
}
