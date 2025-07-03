import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Bell, User, Network } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Network className="h-8 w-8 text-primary mr-3" />
              <Link href="/">
                <h1 className="text-xl font-bold text-gray-900 hover:text-primary cursor-pointer">
                  SmartGreener
                </h1>
              </Link>
            </div>
            <nav className="hidden md:ml-8 md:flex space-x-8">
              <Link href="/">
                <a className="text-primary border-b-2 border-primary px-1 pt-1 pb-4 text-sm font-medium">
                  Dashboard
                </a>
              </Link>
              <a href="#parks" className="text-gray-500 hover:text-gray-900 px-1 pt-1 pb-4 text-sm font-medium">
                Parks
              </a>
              <a href="#events" className="text-gray-500 hover:text-gray-900 px-1 pt-1 pb-4 text-sm font-medium">
                Events
              </a>
              <a href="#analytics" className="text-gray-500 hover:text-gray-900 px-1 pt-1 pb-4 text-sm font-medium">
                Analytics
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
