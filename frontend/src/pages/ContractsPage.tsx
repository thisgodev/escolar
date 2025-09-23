import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { ContractForm } from "../components/ContractForm";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, PlusCircle } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../components/ui/tooltip";
import { StatusBadge } from "@/components/StatusBadge";
import { InstallmentStatus } from "@/types";

type Contract = {
  id: number;
  guardian_name: string;
  student_name: string;
  installment_value: number;
  current_month_status: InstallmentStatus;
  has_past_due_installments: boolean;
};

export function ContractsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const statusFilter = searchParams.get("status");

  const fetchContracts = () => {
    api.get("/contracts").then((res) => setContracts(res.data));
  };

  useEffect(() => {
    api
      .get(`/contracts${statusFilter ? `?status=${statusFilter}` : ""}`)
      .then((res) => setContracts(res.data));
  }, [statusFilter]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/dashboard">
        <Button variant="ghost" className="mb-6">
          &larr; Voltar
        </Button>
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Contratos</h1>
        <div className="flex gap-2 mb-4">
          <Button
            variant={!statusFilter ? "secondary" : "outline"}
            onClick={() => setSearchParams({})}
          >
            Todos
          </Button>
          <Button
            variant={statusFilter === "pending" ? "secondary" : "outline"}
            onClick={() => setSearchParams({ status: "pending" })}
          >
            Pendentes/Vencidos
          </Button>
          <Button
            variant={statusFilter === "paid" ? "secondary" : "outline"}
            onClick={() => setSearchParams({ status: "paid" })}
          >
            Pagos
          </Button>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Criar Novo Contrato
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Contrato</DialogTitle>
              <DialogDescription>
                Preencha as informações abaixo para criar um novo contrato no
                sistema.
              </DialogDescription>
            </DialogHeader>
            <ContractForm
              onContractCreated={fetchContracts}
              closeDialog={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
        <TooltipProvider>
          {" "}
          {/* Provedor para os tooltips */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Responsável</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead>Valor Mensal</TableHead>
                <TableHead>Status (Mês Atual)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow
                  key={contract.id}
                  onClick={() => navigate(`/contracts/${contract.id}`)}
                  className="cursor-pointer transition-colors hover:bg-accent/50"
                >
                  <TableCell>{contract.guardian_name}</TableCell>
                  <TableCell>{contract.student_name}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(contract.installment_value)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Badge para o status do MÊS ATUAL */}
                      <StatusBadge status={contract.current_month_status} />

                      {/* "Balãozinho" de AVISO para pendências passadas */}
                      {contract.has_past_due_installments && (
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Este contrato possui pendências de meses
                              anteriores.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>
    </div>
  );
}
