import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { CheckIcon, XIcon, UsersIcon, ClockIcon } from "lucide-react";

interface Group {
  id: string;
  name: string;
  projectId: string;
  leaderId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface GroupManagementPanelProps {
  projectId?: string;
}

export default function GroupManagementPanel({ projectId }: GroupManagementPanelProps) {
  const auth = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: groups = [] } = useQuery<Group[]>({
    queryKey: projectId ? ["/api/projects", projectId, "groups"] : ["/api/groups"],
  });

  const updateGroupStatusMutation = useMutation({
    mutationFn: async ({ groupId, status }: { groupId: string; status: "approved" | "rejected" }) => {
      const response = await fetch(`/api/groups/${groupId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error("Falha ao atualizar status do grupo");
      }
      return response.json();
    },
    onSuccess: (_, { status }) => {
      toast({
        title: status === "approved" ? "Grupo aprovado!" : "Grupo rejeitado!",
        description: status === "approved" 
          ? "O grupo foi aprovado e pode começar a trabalhar no projeto."
          : "O grupo foi rejeitado e precisa revisar sua proposta.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "groups"] });
      }
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar status do grupo. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handleApprove = (groupId: string) => {
    updateGroupStatusMutation.mutate({ groupId, status: "approved" });
  };

  const handleReject = (groupId: string) => {
    updateGroupStatusMutation.mutate({ groupId, status: "rejected" });
  };

  const getStatusBadge = (status: Group["status"]) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" data-testid={`status-approved`}>Aprovado</Badge>;
      case "rejected":
        return <Badge variant="destructive" data-testid={`status-rejected`}>Rejeitado</Badge>;
      default:
        return <Badge variant="secondary" data-testid={`status-pending`}>Pendente</Badge>;
    }
  };

  const getStatusIcon = (status: Group["status"]) => {
    switch (status) {
      case "approved":
        return <CheckIcon className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XIcon className="w-4 h-4 text-red-600" />;
      default:
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
    }
  };

  if (groups.length === 0) {
    return (
      <Card data-testid="no-groups-message">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <UsersIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum grupo encontrado</p>
            {!projectId && (
              <p className="text-sm">Os grupos aparecerão aqui quando os estudantes se cadastrarem.</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="group-management-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersIcon className="w-5 h-5" />
          Gerenciamento de Grupos
        </CardTitle>
        <CardDescription>
          {auth.user?.type === "professor" 
            ? "Aprove ou rejeite os grupos que se candidataram aos projetos."
            : "Grupos cadastrados nos projetos."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groups.map((group) => (
            <div 
              key={group.id} 
              className="flex items-center justify-between p-4 border rounded-lg"
              data-testid={`group-card-${group.id}`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(group.status)}
                <div>
                  <h4 className="font-medium" data-testid={`group-name-${group.id}`}>
                    {group.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Criado em {new Date(group.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(group.status)}
                
                {auth.user?.type === "professor" && group.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprove(group.id)}
                      disabled={updateGroupStatusMutation.isPending}
                      data-testid={`button-approve-${group.id}`}
                    >
                      <CheckIcon className="w-4 h-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(group.id)}
                      disabled={updateGroupStatusMutation.isPending}
                      data-testid={`button-reject-${group.id}`}
                    >
                      <XIcon className="w-4 h-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}