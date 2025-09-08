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
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Badge } from "../components/ui/badge";

type Contract = {
  id: number;
  guardian_name: string;
  student_name: string;
  status: "active" | "finished" | "cancelled";
  installment_value: number;
};

export function ContractsPage() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchContracts = () => {
    api.get("/contracts").then((res) => setContracts(res.data));
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/dashboard">
        <Button variant="ghost" className="mb-6">
          &larr; Voltar
        </Button>
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Contratos</h1>
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
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Responsável</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Valor Mensal</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.length > 0 ? (
              contracts.map((contract) => (
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
                    <Badge
                      variant={
                        contract.status === "active" ? "default" : "secondary"
                      }
                      className="capitalize"
                    >
                      {contract.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  Nenhum contrato cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
