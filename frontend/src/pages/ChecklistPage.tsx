import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { UserCheck, UserX } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

// --- Tipos de Dados ---
type RouteInfo = {
  id: number;
  name: string;
  estimated_duration_seconds?: number;
};

type Check = {
  leg: "ida" | "volta";
  status: "presente" | "ausente" | "justificado";
};

type ChecklistStudent = {
  id: number;
  name: string;
  trip_type: string;
  pickup_order: number | null;
  address: { logradouro: string; numero: string };
  checks_today: Check[] | null;
};

type ChecklistResponse = {
  routeInfo: RouteInfo;
  students: ChecklistStudent[];
};

export function ChecklistPage() {
  const [myRoutes, setMyRoutes] = useState<RouteInfo[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");
  const [checklistData, setChecklistData] = useState<ChecklistResponse | null>(
    null
  );
  const [loading, setLoading] = useState({ routes: true, checklist: false });
  const [dialogData, setDialogData] = useState<{
    student: ChecklistStudent;
    leg: "ida" | "volta";
    status: "presente" | "ausente";
  } | null>(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    api
      .get("/routes")
      .then((res) => setMyRoutes(res.data))
      .catch((error) => console.error("Falha ao buscar rotas", error))
      .finally(() => setLoading((prev) => ({ ...prev, routes: false })));
  }, []);

  const fetchChecklist = useCallback(
    (routeId: string) => {
      if (!routeId) return;
      setLoading((prev) => ({ ...prev, checklist: true }));
      api
        .get(`/routes/${routeId}/checklist?date=${today}`)
        .then((res) => setChecklistData(res.data))
        .catch((error) => {
          console.error("Falha ao buscar checklist", error);
          setChecklistData(null); // Limpa dados em caso de erro
        })
        .finally(() => setLoading((prev) => ({ ...prev, checklist: false })));
    },
    [today]
  );

  const handleRouteChange = (routeId: string) => {
    setSelectedRouteId(routeId);
    fetchChecklist(routeId);
  };

  const handleCheck = async () => {
    if (!dialogData || !selectedRouteId) return;
    const { student, leg, status } = dialogData;
    const payload = {
      route_id: selectedRouteId,
      student_id: student.id,
      check_date: today,
      trip_leg: leg,
      status: status,
    };
    try {
      await api.post("/routes/checklist", payload);
      fetchChecklist(selectedRouteId);
    } catch (error) {
      console.error("Falha ao registrar check", error);
    } finally {
      setDialogData(null);
    }
  };

  const getStudentStatusForLeg = (
    student: ChecklistStudent,
    leg: "ida" | "volta"
  ) => {
    return student.checks_today?.find((check) => check.leg === leg)?.status;
  };

  const renderCheckStatus = (
    student: ChecklistStudent,
    leg: "ida" | "volta"
  ) => {
    const status = getStudentStatusForLeg(student, leg);
    if (status) {
      const isPresent = status === "presente";
      return (
        <div
          className={`flex items-center gap-2 font-bold ${
            isPresent ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPresent ? <UserCheck size={20} /> : <UserX size={20} />}
          <span className="capitalize">{status}</span>
        </div>
      );
    }
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => setDialogData({ student, leg, status: "presente" })}
        >
          P
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setDialogData({ student, leg, status: "ausente" })}
        >
          A
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/dashboard">
        <Button variant="ghost" className="mb-6">
          &larr; Voltar
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Checklist Diário</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="w-full md:w-1/3">
          <Select
            value={selectedRouteId}
            onValueChange={handleRouteChange}
            disabled={loading.routes}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione sua rota..." />
            </SelectTrigger>
            <SelectContent>
              {myRoutes.map((route) => (
                <SelectItem key={route.id} value={String(route.id)}>
                  {route.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading.checklist && (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {!loading.checklist && selectedRouteId && checklistData && (
        <>
          <Card className="bg-primary/10 border-primary/20 mb-6">
            <CardContent className="p-4 flex justify-between items-center text-primary font-semibold">
              <p>Paradas: {checklistData.students?.length || 0}</p>
              {checklistData.routeInfo?.estimated_duration_seconds && (
                <p>
                  Tempo Estimado:{" "}
                  {Math.round(
                    checklistData.routeInfo.estimated_duration_seconds / 60
                  )}{" "}
                  min
                </p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-3">
            {checklistData.students.length > 0 ? (
              checklistData.students.map((student, index) => (
                <Card
                  key={student.id}
                  className="overflow-hidden shadow-sm border-border"
                >
                  <CardContent className="p-4 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-foreground font-bold text-lg">
                        {student.pickup_order || index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-bold text-lg">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.address?.logradouro},{" "}
                          {student.address?.numero}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pl-12">
                      {(student.trip_type === "ida_e_volta" ||
                        student.trip_type === "apenas_ida") && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold w-12 text-muted-foreground">
                            IDA:
                          </span>
                          {renderCheckStatus(student, "ida")}
                        </div>
                      )}
                      {(student.trip_type === "ida_e_volta" ||
                        student.trip_type === "apenas_volta") && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold w-12 text-muted-foreground">
                            VOLTA:
                          </span>
                          {renderCheckStatus(student, "volta")}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-10">
                Nenhum aluno nesta rota.
              </p>
            )}
          </div>
        </>
      )}

      <AlertDialog open={!!dialogData} onOpenChange={() => setDialogData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Ação</AlertDialogTitle>
            <AlertDialogDescription>
              Confirmar que <strong>{dialogData?.student.name}</strong> está{" "}
              <strong>{dialogData?.status}</strong> no trecho de{" "}
              <strong>{dialogData?.leg.toUpperCase()}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCheck}
              className={
                dialogData?.status === "presente"
                  ? "bg-green-600 hover:bg-green-700"
                  : ""
              }
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
