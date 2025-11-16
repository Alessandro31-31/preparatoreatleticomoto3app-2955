import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  LogOut,
  Bell,
  Globe,
  Moon,
  Sun,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState("it");
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data?.user) {
        setUser(session.data.user);
      }
      setLoading(false);
    });

    // Load theme preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate("/signin");
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-4 md:py-8">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile & Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account preferences</p>
          </div>
        </div>

        {/* User Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-xl">{user.name || "Moto3 Pilot"}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
              <Badge variant={user.emailVerified ? "default" : "secondary"}>
                {user.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Role: {user.role || "Athlete"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Training Information</CardTitle>
            <CardDescription>Your training cycle details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Training Start Date</Label>
              <Input
                type="date"
                defaultValue="2025-11-06"
                className="mt-2"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">
                18-week program (Nov 6, 2025 → Apr 13, 2026)
              </p>
            </div>
            <div>
              <Label>Category</Label>
              <Select defaultValue="moto3">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moto3">Moto3</SelectItem>
                  <SelectItem value="moto2">Moto2</SelectItem>
                  <SelectItem value="motogp">MotoGP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-3 block">Theme</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleThemeChange("light")}
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleThemeChange("dark")}
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Preferences</CardTitle>
            <CardDescription>App settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Training reminders and alerts
                  </p>
                </div>
              </div>
              <Button
                variant={notifications ? "default" : "outline"}
                size="sm"
                onClick={() => setNotifications(!notifications)}
              >
                {notifications ? "On" : "Off"}
              </Button>
            </div>

            <Separator />

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4" />
                Language
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              <Label>Unit System</Label>
              <Select defaultValue="metric">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                  <SelectItem value="imperial">Imperial (lb, in)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://github.com/moto3-training" target="_blank" rel="noopener noreferrer">
                📚 Training Documentation
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/chat">
                💬 AI Coach Assistant
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="mailto:support@moto3training.com">
                📧 Contact Support
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-red-500">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Version Info */}
        <div className="text-center mt-8 pb-4">
          <p className="text-xs text-muted-foreground">
            Moto3 Training Pro v0.0.7
          </p>
          <p className="text-xs text-muted-foreground">
            © 2025 - Built for champions
          </p>
        </div>
      </div>
    </div>
  );
}
