import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { RegisterPaymentForm } from "../components/RegisterPaymentForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Checkbox } from "../components/ui/checkbox";
import { Skeleton } from "../components/ui/skeleton";

// Tipos para os dados da página
type Installment = {
  id: number;
  installment_number: number;
  due_date: string;
  base_value: number;
  status: "pending" | "paid" | "overdue" | "cancelled";
  payment_date: string | null;
};
type ContractDetails = {
  id: number;
  guardian_name: string;
  student_name: string;
  installments: Installment[];
};

export function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<ContractDetails | null>(null);
  const [paymentModalData, setPaymentModalData] = useState<Installment | null>(
    null
  );
  const [undoAlertData, setUndoAlertData] = useState<Installment | null>(null);
  const [selectedInstallments, setSelectedInstallments] = useState<number[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchContractDetails = useCallback(() => {
    if (id) {
      api.get(`/contracts/${id}`).then((res) => setContract(res.data));
    }
  }, [id]);

  useEffect(() => {
    fetchContractDetails();
  }, [fetchContractDetails]);

  const handleSelectionChange = (installmentId: number) => {
    setSelectedInstallments((prev) =>
      prev.includes(installmentId)
        ? prev.filter((id) => id !== installmentId)
        : [...prev, installmentId]
    );
  };

  const handleBulkPay = async () => {
    setIsLoading(true);
    const promise = api.post("/contracts/installments/bulk-pay", {
      installmentIds: selectedInstallments,
      paymentDate: new Date().toISOString().split("T")[0],
    });

    toast.promise(promise, {
      loading: "Registrando pagamentos em lote...",
      success: () => {
        setSelectedInstallments([]);
        fetchContractDetails();
        return `${selectedInstallments.length} parcelas quitadas com sucesso!`;
      },
      error: "Falha ao quitar parcelas. Tente novamente.",
    });

    promise.finally(() => setIsLoading(false));
  };

  const handleUndoPayment = async () => {
    if (!undoAlertData) return;
    setIsLoading(true);

    const promise = api.patch(
      `/contracts/installments/${undoAlertData.id}/undo`
    );

    toast.promise(promise, {
      loading: "Desfazendo pagamento...",
      success: () => {
        fetchContractDetails();
        return "Pagamento desfeito com sucesso!";
      },
      error: "Falha ao desfazer o pagamento.",
    });

    promise.finally(() => {
      setIsLoading(false);
      setUndoAlertData(null);
    });
  };

  if (!contract) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-10 w-1/2 mb-6" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/contracts">
        <Button variant="ghost" className="mb-6">
          &larr; Voltar para Contratos
        </Button>
      </Link>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Detalhes do Contrato #{contract.id}
        </h1>
        <p className="text-muted-foreground">
          Responsável: {contract.guardian_name} | Aluno: {contract.student_name}
        </p>
      </div>

      {selectedInstallments.length > 0 && (
        <div className="mb-4 flex items-center gap-4 bg-card border rounded-lg p-4">
          <p className="text-sm font-medium flex-1">
            {selectedInstallments.length} parcelas selecionadas.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? "Quitando..." : "Quitar Selecionados"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Quitação em Lote</AlertDialogTitle>
                <AlertDialogDescription>
                  Você tem certeza que deseja registrar o pagamento para as{" "}
                  {selectedInstallments.length} parcelas selecionadas?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleBulkPay}>
                  Sim, quitar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Parcela</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contract.installments.map((installment) => (
              <TableRow
                key={installment.id}
                data-state={
                  selectedInstallments.includes(installment.id)
                    ? "selected"
                    : undefined
                }
              >
                <TableCell>
                  {installment.status === "pending" && (
                    <Checkbox
                      checked={selectedInstallments.includes(installment.id)}
                      onCheckedChange={() =>
                        handleSelectionChange(installment.id)
                      }
                    />
                  )}
                </TableCell>
                <TableCell>{installment.installment_number}</TableCell>
                <TableCell>
                  {new Date(installment.due_date).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(installment.base_value)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      installment.status === "paid"
                        ? "default"
                        : installment.status === "overdue"
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {installment.status === "paid"
                      ? `Pago em ${new Date(
                          installment.payment_date!
                        ).toLocaleDateString("pt-BR", { timeZone: "UTC" })}`
                      : "Pendente"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {installment.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => setPaymentModalData(installment)}
                    >
                      Registrar Pagamento
                    </Button>
                  )}
                  {installment.status === "paid" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-yellow-500 hover:text-yellow-600"
                      onClick={() => setUndoAlertData(installment)}
                    >
                      Desfazer
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!paymentModalData}
        onOpenChange={(isOpen) => !isOpen && setPaymentModalData(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Registrar Pagamento - Parcela #
              {paymentModalData?.installment_number}
            </DialogTitle>
            <DialogDescription>
              Insira os detalhes do pagamento para confirmar.
            </DialogDescription>
          </DialogHeader>
          {paymentModalData && (
            <RegisterPaymentForm
              installmentId={paymentModalData.id}
              baseValue={paymentModalData.base_value}
              onPaymentRegistered={() => {
                fetchContractDetails();
                setPaymentModalData(null);
              }}
              closeDialog={() => setPaymentModalData(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!undoAlertData}
        onOpenChange={() => setUndoAlertData(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação reverterá o pagamento da parcela #
              {undoAlertData?.installment_number} para "Pendente".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUndoPayment}
              disabled={isLoading}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {isLoading ? "Aguarde..." : "Sim, desfazer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
