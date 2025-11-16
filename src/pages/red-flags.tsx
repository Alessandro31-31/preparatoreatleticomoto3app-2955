import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  ArrowLeft,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

const flagCategories = [
  { value: "injury", label: "Injury", color: "destructive" },
  { value: "fatigue", label: "Extreme Fatigue", color: "destructive" },
  { value: "hrv", label: "HRV Drop", color: "secondary" },
  { value: "soreness", label: "Persistent Soreness", color: "secondary" },
  { value: "sleep", label: "Sleep Issues", color: "secondary" },
  { value: "illness", label: "Illness/Infection", color: "destructive" },
  { value: "mental", label: "Mental Fatigue", color: "secondary" },
  { value: "overtraining", label: "Overtraining Signs", color: "destructive" },
];

const severityLevels = [
  { value: "low", label: "Low - Monitor", icon: AlertCircle, color: "text-yellow-500" },
  { value: "medium", label: "Medium - Modify Training", icon: AlertTriangle, color: "text-orange-500" },
  { value: "high", label: "High - Rest Required", icon: XCircle, color: "text-red-500" },
];

const recommendedActions = {
  injury: "Stop training. Consult medical professional. Ice/rest affected area.",
  fatigue: "Reduce training volume 50%. Increase sleep. Check nutrition.",
  hrv: "Light training only. Monitor daily. Address sleep/stress.",
  soreness: "Foam roll. Light stretching. Reduce eccentric load.",
  sleep: "Sleep hygiene protocol. Reduce evening screen time. Earlier bedtime.",
  illness: "Rest completely. Hydrate. Medical consultation if persists.",
  mental: "Reduce training stress. Active recovery days. Mental skills work.",
  overtraining: "Deload week. Sleep focus. Medical/coach consultation.",
};

export default function RedFlags() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showNewFlag, setShowNewFlag] = useState(false);
  const [newFlag, setNewFlag] = useState({
    category: "",
    severity: "",
    description: "",
    action: "",
  });

  const { data: flagsData, isLoading } = useQuery({
    queryKey: ["flags-all"],
    queryFn: async () => {
      const res = await apiClient.flags.all.$get();
      return res.json();
    },
  });

  const createFlagMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.flags.$post({
        json: {
          ...data,
          date: new Date().toISOString().split("T")[0],
        },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags-all"] });
      queryClient.invalidateQueries({ queryKey: ["flags-active"] });
      setShowNewFlag(false);
      setNewFlag({ category: "", severity: "", description: "", action: "" });
    },
  });

  const resolveFlagMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      const res = await apiClient.flags[":id"].resolve.$post({
        param: { id: id.toString() },
        json: { resolvedNotes: notes },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags-all"] });
      queryClient.invalidateQueries({ queryKey: ["flags-active"] });
    },
  });

  const activeFlags = flagsData?.flags?.filter((f: any) => !f.resolved) || [];
  const resolvedFlags = flagsData?.flags?.filter((f: any) => f.resolved) || [];

  const handleCategoryChange = (category: string) => {
    setNewFlag({
      ...newFlag,
      category,
      action: recommendedActions[category as keyof typeof recommendedActions] || "",
    });
  };

  const handleCreateFlag = () => {
    if (newFlag.category && newFlag.severity && newFlag.description) {
      createFlagMutation.mutate(newFlag);
    }
  };

  const getSeverityInfo = (severity: string) => {
    return severityLevels.find((s) => s.value === severity) || severityLevels[0];
  };

  const getCategoryInfo = (category: string) => {
    return flagCategories.find((c) => c.value === category);
  };

  return (
    <div className="min-h-screen bg-background py-4 md:py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
                Red Flag System
              </h1>
              <p className="text-sm text-muted-foreground">
                Monitor warning signs and prevent overtraining
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowNewFlag(true)}
            className="bg-red-500 hover:bg-red-600"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span className="hidden md:inline">New Flag</span>
          </Button>
        </div>

        {/* Active Flags Alert */}
        {activeFlags.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">
              {activeFlags.length} Active Warning{activeFlags.length > 1 ? "s" : ""}
            </AlertTitle>
            <AlertDescription className="text-sm">
              Review and address all red flags before resuming normal training intensity.
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{activeFlags.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{resolvedFlags.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{flagsData?.flags?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Flags */}
        {activeFlags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Active Red Flags
            </h2>
            <div className="space-y-3">
              {activeFlags.map((flag: any) => {
                const severityInfo = getSeverityInfo(flag.severity);
                const categoryInfo = getCategoryInfo(flag.category);
                const SeverityIcon = severityInfo.icon;

                return (
                  <Card key={flag.id} className="border-red-500/30 bg-red-500/5">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <SeverityIcon className={`w-5 h-5 ${severityInfo.color}`} />
                            <CardTitle className="text-base">
                              {categoryInfo?.label || flag.category}
                            </CardTitle>
                            <Badge variant="outline" className={severityInfo.color}>
                              {severityInfo.label.split(" - ")[0]}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            {new Date(flag.date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Description:</p>
                        <p className="text-sm text-muted-foreground">{flag.description}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Recommended Action:</p>
                        <p className="text-sm text-muted-foreground">{flag.action}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const notes = prompt("Resolution notes:");
                          if (notes) {
                            resolveFlagMutation.mutate({ id: flag.id, notes });
                          }
                        }}
                        className="w-full"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark as Resolved
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Resolved Flags */}
        {resolvedFlags.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Resolved Flags
            </h2>
            <div className="space-y-3">
              {resolvedFlags.slice(0, 5).map((flag: any) => {
                const categoryInfo = getCategoryInfo(flag.category);
                return (
                  <Card key={flag.id} className="border-green-500/20 bg-green-500/5">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-sm">
                            {categoryInfo?.label || flag.category}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {new Date(flag.date).toLocaleDateString()} →{" "}
                            {flag.resolvedDate &&
                              new Date(flag.resolvedDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                    </CardHeader>
                    {flag.resolvedNotes && (
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground">
                          Resolution: {flag.resolvedNotes}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && flagsData?.flags?.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Red Flags</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Great! No warning signs detected. Keep up the good work!
              </p>
              <Button onClick={() => setShowNewFlag(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Report a Concern
              </Button>
            </CardContent>
          </Card>
        )}

        {/* New Flag Dialog */}
        <Dialog open={showNewFlag} onOpenChange={setShowNewFlag}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Red Flag</DialogTitle>
              <DialogDescription>
                Document warning signs to prevent injury and overtraining
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={newFlag.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {flagCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Severity</label>
                <Select
                  value={newFlag.severity}
                  onValueChange={(val) => setNewFlag({ ...newFlag, severity: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Describe the issue..."
                  value={newFlag.description}
                  onChange={(e) =>
                    setNewFlag({ ...newFlag, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Recommended Action
                </label>
                <Textarea
                  placeholder="What action to take..."
                  value={newFlag.action}
                  onChange={(e) => setNewFlag({ ...newFlag, action: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewFlag(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateFlag}
                disabled={
                  !newFlag.category ||
                  !newFlag.severity ||
                  !newFlag.description ||
                  createFlagMutation.isPending
                }
                className="bg-red-500 hover:bg-red-600"
              >
                {createFlagMutation.isPending ? "Creating..." : "Create Flag"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
