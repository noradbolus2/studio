"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar"
import {
    Home,
    Bot,
    ClipboardList,
    Wallet,
    CalendarCheck,
    Store,
    Star,
    Settings,
    Bell,
    User,
    ChevronDown,
    Search,
    CirclePlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'

const sidebarItems = [
    { href: "/creator-dashboard", icon: Home, label: "Dashboard" },
    { href: "#", icon: Bot, label: "AI Assistant" },
    { href: "/creator-dashboard/my-projects", icon: ClipboardList, label: "My Content" },
    { href: "/creator-dashboard/orders/ORD78901", icon: Wallet, label: "Orders & Earnings" },
    { href: "#", icon: CalendarCheck, label: "Mentorship Bookings" },
    { href: "#", icon: Store, label: "My Storefront" },
    { href: "#", icon: Star, label: "Reviews + Ratings" },
    { href: "#", icon: Settings, label: "Settings" },
]

export default function CreatorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 p-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary text-2xl font-bold text-primary-foreground">
                        OSO
                    </div>
                    <span className="text-xl font-bold">OSO Creator</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {sidebarItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <Link href={item.href} passHref legacyBehavior>
                                <SidebarMenuButton>
                                    <item.icon/>
                                    {item.label}
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <div className="flex flex-col h-full">
                {/* Top Navigation */}
                <header className="flex items-center justify-between p-3 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                    <SidebarTrigger />
                    <div className="flex items-center gap-4 flex-grow justify-end">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search tasks..." className="pl-8 h-9 w-48 lg:w-64" />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-9">
                                    Work Mode: Doubt Solver
                                    <ChevronDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Doubt Solver</DropdownMenuItem>
                                <DropdownMenuItem>Flashcard Maker</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Bell className="h-5 w-5"/>
                        </Button>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src="https://placehold.co/40x40.png" alt="Abhishek V." data-ai-hint="male professional"/>
                                    <AvatarFallback>AV</AvatarFallback>
                                </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                 {/* CTA Button */}
                <div className="p-3 border-b">
                    <Button className="w-full">
                        <CirclePlus className="mr-2 h-4 w-4"/>
                        Start New Task
                    </Button>
                </div>
                {/* Main Content */}
                <main className="flex-1 p-4 overflow-y-auto">
                    {children}
                </main>
            </div>
        </SidebarInset>
    </SidebarProvider>
  )
}
