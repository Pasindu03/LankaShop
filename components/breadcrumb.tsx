import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

type BreadcrumbItem = {
  label: string
  href: string
  isCurrent?: boolean
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {item.isCurrent ? (
              <span className="ml-1 md:ml-2 text-sm font-medium text-gray-500" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="ml-1 md:ml-2 text-sm text-gray-500 hover:text-gray-700">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

