import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Plus,
  X,
  Activity,
  Heart,
  Zap,
  TrendingDown,
} from "lucide-react";

interface RedFlag {
  id: number;
  date: string;
  category: string;
  severity: string;
  description: string;
  action: string;
  resolved: number;
  resolvedDate?: string;
  resolvedNotes?: string;
}

const flagCategories = [
  { value: "hrv", label: "HRV Basso", icon: Heart },
  { value: "load", label: "Carico Eccessivo", icon: Zap },
  { value: "readiness", label: "Prontezza Scarsa", icon: Activity },
  { value: "injury", label: "Infortunio/Dolore", icon: AlertTriangle },
  { value: "sleep", label: "Sonno Insufficiente", icon: TrendingDown },
  { value: "other", label: "Altro", icon: Info },
];

const severityLevels = [
  { value: "low", label: "Bassa", color: "bg-yellow-500", textColor: "text-yellow-500" },
  { value: "medium", label: "Media", color: "bg-orange-500", textColor: "text-orange-500" },
  { value: "high", label: "Alta", color: "bg-red-500", textColor: "text-red-500" },
  { value: "critical", label: "Critica", color: "bg-red-900", textColor: "text-red-900" },
];

export default function RedFlags() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<RedFlag | null>(null);
  const [showResolved, setShowResolved] = useState(false);

  const [newFlag, setNewFlag] = useState({
    category: "",
    severity: "",
    description: "",
    action: "",
  });

  const [resolveNotes, setResolveNotes] = useState("");

  const { data: flags } = useQuery({
    queryKey: ["flags", showResolved],
    queryFn: async () => {
      const res = await apiClient.flags.$get({
        query: showResolved ? {} : { resolved: "0" },
      });
      return res.json();
    },
  });

  const addFlagMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.flags.$post({
        json: {
          date: new Date().toISOString().split("T")[0],
          ...newFlag,
        },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
      queryClient.invalidateQueries({ queryKey: ["flags-active"] });
      setShowAddDialog(false);
      setNewFlag({ category: "", severity: "", description: "", action: "" });
    },
  });

  const resolveFlagMutation = useMutation({
    mutationFn: async (flagId: number) => {
      const res = await apiClient.flags[":id"].resolve.$put({
        param: { id: flagId.toString() },
        json: { resolvedNotes: resolveNotes },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
      queryClient.invalidateQueries({ queryKey: ["flags-active"] });
      setShowResolveDialog(false);
      setResolveNotes("");
      setSelectedFlag(null);
    },
  });

  const getSeverityInfo = (severity: string) => {
    return severityLevels.find((s) => s.value === severity) || severityLevels[0];
  };

  const getSeverityBorderClass = (severity: string) => {
    const borderClasses: Record<string, string> = {
      low: "border-l-yellow-500",
      medium: "border-l-orange-500",
      high: "border-l-red-500",
      critical: "border-l-red-900",
    };
    return borderClasses[severity] || "border-l-yellow-500";
  };

  const getCategoryIcon = (category: string) => {
    const cat = flagCategories.find((c) => c.value === category);
    return cat ? cat.icon : Info;
  };

  const activeFlags = flags?.flags?.filter((f: RedFlag) => !f.resolved) || [];
  const resolvedFlags = flags?.flags?.filter((f: RedFlag) => f.resolved) || [];
  const displayFlags = showResolved ? resolvedFlags : activeFlags;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-5xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                  Sistema Bandiera Rossa
                </CardTitle>
                <CardDescription>
                  Monitora e gestisci alert per prevenire infortuni e sovrallenamento
                </CardDescription>
              </div>
              <Button onClick={() => setShowAddDialog(true)} size="lg" variant="destructive">
                <Plus className="w-4 h-4 mr-2" />
                Nuova Bandiera
              </Button>
            </div>
          </CardHeader>
        </Card>

        {activeFlags.length > 0 && !showResolved && (
          <Alert variant="destructive" className="mb-6 border-2 border-red-500">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">
              {activeFlags.length} Bandiera{activeFlags.length > 1 ? "e" : ""} Rossa Attiva{activeFlags.length > 1 ? "e" : ""}
            </AlertTitle>
            <AlertDescription>
              <p className="mt-2">
                Sono presenti delle situazioni che richiedono attenzione. Rivedi i parametri di
                allenamento e recupero.
              </p>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bandiere Attive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{activeFlags.length}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Risolte (Totale)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{resolvedFlags.length}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Critiche Attive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {activeFlags.filter((f: RedFlag) => f.severity === "critical" || f.severity === "high").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button
              variant={!showResolved ? "default" : "outline"}
              onClick={() => setShowResolved(false)}
            >
              Attive ({activeFlags.length})
            </Button>
            <Button
              variant={showResolved ? "default" : "outline"}
              onClick={() => setShowResolved(true)}
            >
              Risolte ({resolvedFlags.length})
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {displayFlags.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {showResolved ? "Nessuna bandiera risolta" : "Tutto OK!"}
                </h3>
                <p className="text-muted-foreground">
                  {showResolved
                    ? "Non ci sono bandiere risolte da mostrare."
                    : "Non ci sono bandiere rosse attive. Continua così!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            displayFlags.map((flag: RedFlag) => {
              const severityInfo = getSeverityInfo(flag.severity);
              const CategoryIcon = getCategoryIcon(flag.category);

              return (
                <Card
                  key={flag.id}
                  className={`border-l-4 ${
                    flag.resolved ? "border-l-green-500" : getSeverityBorderClass(flag.severity)
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CategoryIcon className={`w-5 h-5 ${flag.resolved ? "text-green-500" : severityInfo.textColor}`} />
                          <CardTitle className="text-lg">
                            {flagCategories.find((c) => c.value === flag.category)?.label || flag.category}
                          </CardTitle>
                          <Badge
                            variant={flag.resolved ? "default" : "destructive"}
                            className={flag.resolved ? "bg-green-500" : severityInfo.color}
                          >
                            {flag.resolved ? "Risolta" : severityInfo.label}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <span>{new Date(flag.date).toLocaleDateString("it-IT")}</span>
                          {flag.resolvedDate && (
                            <>
                              <span>•</span>
                              <span>Risolta il {new Date(flag.resolvedDate).toLocaleDateString("it-IT")}</span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                      {!flag.resolved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedFlag(flag);
                            setShowResolveDialog(true);
                          }}
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Risolvi
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Descrizione:</h4>
                      <p className="text-sm text-muted-foreground">{flag.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Azione Raccomandata:</h4>
                      <p className="text-sm text-muted-foreground">{flag.action}</p>
                    </div>
                    {flag.resolvedNotes && (
                      <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                        <h4 className="text-sm font-semibold mb-1 text-green-700">Note di Risoluzione:</h4>
                        <p className="text-sm text-muted-foreground">{flag.resolvedNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Add Flag Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Aggiungi Nuova Bandiera Rossa</DialogTitle>
              <DialogDescription>
                Registra una situazione che richiede attenzione o modifiche al programma
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={newFlag.category} onValueChange={(v) => setNewFlag({ ...newFlag, category: v })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleziona categoria" />
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
                <Label htmlFor="severity">Gravità</Label>
                <Select value={newFlag.severity} onValueChange={(v) => setNewFlag({ ...newFlag, severity: v })}>
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Seleziona gravità" />
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
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  value={newFlag.description}
                  onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                  placeholder="Descrivi la situazione..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="action">Azione Raccomandata</Label>
                <Textarea
                  id="action"
                  value={newFlag.action}
                  onChange={(e) => setNewFlag({ ...newFlag, action: e.target.value })}
                  placeholder="Cosa fare per risolvere..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Annulla
              </Button>
              <Button
                onClick={() => addFlagMutation.mutate()}
                disabled={!newFlag.category || !newFlag.severity || !newFlag.description || !newFlag.action}
                variant="destructive"
              >
                Aggiungi Bandiera
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Resolve Flag Dialog */}
        <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Risolvi Bandiera Rossa</DialogTitle>
              <DialogDescription>
                Segna questa bandiera come risolta e aggiungi eventuali note
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedFlag && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium">{selectedFlag.description}</p>
                </div>
              )}
              <div>
                <Label htmlFor="resolveNotes">Note di Risoluzione (opzionale)</Label>
                <Textarea
                  id="resolveNotes"
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                  placeholder="Cosa hai fatto per risolvere il problema..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResolveDialog(false)}>
                Annulla
              </Button>
              <Button
                onClick={() => selectedFlag && resolveFlagMutation.mutate(selectedFlag.id)}
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Segna come Risolta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
