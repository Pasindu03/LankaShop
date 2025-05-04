import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata = {
    title: "FAQs | Lanka Shop",
    description: "Frequently asked questions about Lanka Shop products, shipping, and policies.",
}

export default function FAQPage() {
    const faqs = [
        {
            question: "How long does shipping take?",
            answer:
                "We ship all orders from our UK warehouse. Standard delivery within the UK takes 2-4 business days. Express delivery is available for next-day delivery if ordered before 2pm.",
        },
        {
            question: "Are your products authentic Sri Lankan items?",
            answer:
                "Yes, all our products are sourced directly from Sri Lanka. We have official authorizations from Sri Lankan companies and work directly with artisans and producers to ensure authenticity.",
        },
        {
            question: "Do you ship internationally?",
            answer:
                "Currently, we only ship within the United Kingdom. We're working on expanding our shipping options to Europe in the near future.",
        },
        {
            question: "What is your return policy?",
            answer:
                "We accept returns within 30 days of delivery for unused items in their original packaging. Food items and Ayurvedic products cannot be returned once opened for hygiene reasons.",
        },
        {
            question: "Are your Ayurvedic products certified?",
            answer:
                "Yes, all our Ayurvedic products are certified by the Sri Lankan Department of Ayurveda and comply with UK regulations for herbal products.",
        },
        {
            question: "How do I track my order?",
            answer:
                "Once your order is dispatched, you'll receive a confirmation email with tracking information. You can also track your order by logging into your account on our website.",
        },
        {
            question: "Do you offer wholesale options?",
            answer:
                "Yes, we offer wholesale options for retailers interested in our products. Please contact our team at wholesale@lankashop.co.uk for more information.",
        },
    ]

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="mb-6 flex items-center gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>

                <h1 className="text-3xl font-serif mb-6">Frequently Asked Questions</h1>
                <p className="text-gray-600 mb-8">
                    Find answers to common questions about our products, shipping, and policies.
                </p>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent>
                                <p className="text-gray-600">{faq.answer}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                <div className="mt-12 p-6 bg-amber-50 rounded-lg">
                    <h2 className="text-xl font-medium mb-4">Still have questions?</h2>
                    <p className="mb-4">If you couldn't find the answer to your question, please don't hesitate to contact us.</p>
                    <Link href="/conf/contact">
                        <Button className="bg-amber-500 hover:bg-amber-600">Contact Us</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
