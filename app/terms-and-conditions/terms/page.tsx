import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
    title: "Terms of Service | Lanka Shop",
    description: "Lanka Shop's terms and conditions for using our website and purchasing our products.",
}

export default function TermsOfServicePage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="mb-6 flex items-center gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>

                <h1 className="text-3xl font-serif mb-6">Terms of Service</h1>
                <p className="text-gray-600 mb-8">Last updated: May 3, 2023</p>

                <div className="prose max-w-none">
                    <p className="mb-4">
                        Welcome to Lanka Shop. By accessing our website and purchasing our products, you agree to be bound by these
                        Terms of Service. Please read them carefully.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="mb-4">
                        By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws
                        and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing
                        this site.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">2. Products and Services</h2>
                    <p className="mb-4">
                        All products and services are subject to availability. We reserve the right to discontinue any product or
                        service at any time. Prices for our products are subject to change without notice. We reserve the right to
                        refuse service to anyone for any reason at any time.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">3. Accuracy of Information</h2>
                    <p className="mb-4">
                        We strive to ensure that all information on our website is accurate, but we do not warrant that product
                        descriptions or other content is accurate, complete, reliable, current, or error-free. If a product offered
                        by Lanka Shop is not as described, your sole remedy is to return it in unused condition.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">4. User Accounts</h2>
                    <p className="mb-4">
                        When you create an account with us, you must provide accurate and complete information. You are responsible
                        for maintaining the confidentiality of your account and password and for restricting access to your
                        computer. You agree to accept responsibility for all activities that occur under your account.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">5. Intellectual Property</h2>
                    <p className="mb-4">
                        All content included on this site, such as text, graphics, logos, images, as well as the compilation
                        thereof, and any software used on the site, is the property of Lanka Shop or its suppliers and protected by
                        copyright and intellectual property laws.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">6. Limitation of Liability</h2>
                    <p className="mb-4">
                        Lanka Shop shall not be liable for any direct, indirect, incidental, special, consequential or punitive
                        damages resulting from your use of or inability to use the service or for the cost of procurement of
                        substitute products and services or resulting from any products purchased or obtained or transactions
                        entered into through the service.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">7. Governing Law</h2>
                    <p className="mb-4">
                        These Terms shall be governed by and construed in accordance with the laws of the United Kingdom, without
                        regard to its conflict of law provisions.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">8. Changes to Terms</h2>
                    <p className="mb-4">
                        We reserve the right to modify these terms at any time. Your continued use of the website following the
                        posting of changes will mean that you accept and agree to the changes.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">9. Contact Us</h2>
                    <p className="mb-4">If you have any questions about these Terms, please contact us at:</p>
                    <p className="mb-4">
                        Email: legal@lankashop.co.uk
                        <br />
                        Address: 29 Firswood Avenue, Epsom, KT19 0PU, London
                    </p>
                </div>
            </div>
        </div>
    )
}
