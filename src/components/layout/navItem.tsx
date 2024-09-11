import React from "react"
import { cva } from "class-variance-authority"
import { Link, useMatch } from 'react-router-dom';


export type NavItemProps = {
    title: string
    href: string
    Icon: () => React.ReactNode
} & NavProps

type NavProps = {
    current?: NavItemProps
}

const menuItemVariants = cva(
    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
    {
        variants: {
            variant: {
                default: "text-primary hover:text-secondary-foreground hover:bg-stone-300",
                active: "text-secondary bg-secondary-foreground cursor-default",
            }
        },
        defaultVariants: {
            variant: "default",
        }
    }
)


export function NavItem({ title, href, Icon }: NavItemProps) {

    const isActive = useMatch(href);

    return (
        <Link
            to={href}
            className={menuItemVariants({ variant: isActive ? 'active' : 'default' })}
        >
            {React.createElement(Icon, { name: Icon, className: "h-4 w-4" })}
            {title}
        </Link>
    )
}