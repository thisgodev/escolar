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
import { PlusCircle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { InviteForm } from "@/components/InviteForm";

type User = { id: number; name: string; email: string; role: string };

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isInviteFormOpen, setIsInviteFormOpen] = useState(false);

  const fetchUsers = () => api.get("/users").then((res) => setUsers(res.data));
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
        <Dialog open={isInviteFormOpen} onOpenChange={setIsInviteFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Convidar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar Novo Usuário</DialogTitle>
              <DialogDescription>
                Envie um convite por email para um novo responsável, motorista
                ou monitor.
              </DialogDescription>
            </DialogHeader>
            <InviteForm
              onInviteSent={() => setIsInviteFormOpen(false)}
              closeDialog={() => setIsInviteFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Papel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className="capitalize">{user.role}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
