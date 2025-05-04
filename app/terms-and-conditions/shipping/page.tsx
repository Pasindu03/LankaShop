import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
    title: "Shipping Policy | Lanka Shop",
    description: "Lanka Shop's shipping policy, including delivery times, costs, and international shipping information.",
}

export default function ShippingPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="mb-6 flex items-center gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>

                <h1 className="text-3xl font-serif mb-6">Shipping Policy</h1>
                <p className="text-gray-600 mb-8">Last updated: May 3, 2023</p>

                <div className="prose max-w-none">
                    <p className="mb-4">
                        At Lanka Shop, we strive to deliver your authentic Sri Lankan products quickly and safely. This policy
                        outlines our shipping procedures, delivery times, and costs.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">UK Shipping</h2>
                    <p className="mb-4">
                        We currently ship to all addresses within the United Kingdom, including Northern Ireland, Scotland, and
                        Wales.
                    </p>

                    <h3 className="text-lg font-medium mt-6 mb-3">Shipping Options</h3>
                    <ul className="list-disc pl-6 mb-4">
                        <li>
                            <strong>Standard Delivery:</strong> 2-4 business days (£3.99 or free for orders over £50)
                        </li>
                        <li>
                            <strong>Express Delivery:</strong> Next business day if ordered before 2pm (£6.99)
                        </li>
                        <li>
                            <strong>Saturday Delivery:</strong> Available for orders placed before 2pm on Friday (£9.99)
                        </li>
                    </ul>

                    <h3 className="text-lg font-medium mt-6 mb-3">Order Processing</h3>
                    <p className="mb-4">
                        All orders are processed within 1-2 business days. Orders placed after 2pm will be processed the following
                        business day. Once your order has been processed, you will receive a shipping confirmation email with
                        tracking information.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">International Shipping</h2>
                    <p className="mb-4">
                        Currently, we only ship within the United Kingdom. We are working on expanding our shipping options to
                        Europe and other international destinations in the near future. Please check back for updates.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">Shipping Restrictions</h2>
                    <p className="mb-4">
                        Some products, particularly certain Ayurvedic items, may have shipping restrictions due to ingredients or
                        regulations. These restrictions will be clearly noted on the product page.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">Tracking Your Order</h2>
                    <p className="mb-4">
                        Once your order has been shipped, you will receive a confirmation email with tracking information. You can
                        also track your order by logging into your account on our website and viewing your order history.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">Delivery Issues</h2>
                    <p className="mb-4">
                        If you experience any issues with your delivery, such as damaged items or missing packages, please contact
                        our customer service team within 48 hours of delivery at support@lankashop.co.uk or call us at +44 7850
                        283839.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">Contact Us</h2>
                    <p className="mb-4">If you have any questions about our shipping policy, please contact us at:</p>
                    <p className="mb-4">
                        Email: shipping@lankashop.co.uk
                        <br />
                        Phone: +44 7850 283839
                        <br />
                        Address: 29 Firswood Avenue, Epsom, KT19 0PU, London
                    </p>
                </div>
            </div>
        </div>
    )
}
