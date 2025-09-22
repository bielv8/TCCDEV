import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { GithubIcon, LogInIcon, UserPlusIcon } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const auth = useAuth();

  // Professor login state
  const [professorCredentials, setProfessorCredentials] = useState({
    username: "",
    password: ""
  });

  // Student registration state
  const [studentData, setStudentData] = useState({
    name: "",
    githubProfile: ""
  });

  const professorLoginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      auth.login(data.user);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${data.user.name}!`
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Erro no login",
        description: "Credenciais inválidas. Verifique seu usuário e senha.",
        variant: "destructive"
      });
    }
  });

  const studentRegisterMutation = useMutation({
    mutationFn: async (studentInfo: { name: string; githubProfile: string }) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentInfo)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      auth.login(data.user);
      toast({
        title: "Cadastro realizado com sucesso!",
        description: `Bem-vindo, ${data.user.name}!`
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Erro ao cadastrar estudante. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const handleProfessorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    professorLoginMutation.mutate(professorCredentials);
  };

  const handleStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive"
      });
      return;
    }
    studentRegisterMutation.mutate(studentData);
  };

  // If already logged in, redirect
  if (auth.user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sistema de Projetos</CardTitle>
          <CardDescription>
            Acesse como professor ou cadastre-se como estudante
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="professor" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="professor" data-testid="tab-professor">
                <LogInIcon className="w-4 h-4 mr-2" />
                Professor
              </TabsTrigger>
              <TabsTrigger value="student" data-testid="tab-student">
                <UserPlusIcon className="w-4 h-4 mr-2" />
                Estudante
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="professor" className="space-y-4">
              <form onSubmit={handleProfessorLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="professor-username">Usuário</Label>
                  <Input
                    id="professor-username"
                    data-testid="input-professor-username"
                    type="text"
                    placeholder="professor"
                    value={professorCredentials.username}
                    onChange={(e) => setProfessorCredentials(prev => ({
                      ...prev,
                      username: e.target.value
                    }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="professor-password">Senha</Label>
                  <Input
                    id="professor-password"
                    data-testid="input-professor-password"
                    type="password"
                    placeholder="••••••••"
                    value={professorCredentials.password}
                    onChange={(e) => setProfessorCredentials(prev => ({
                      ...prev,
                      password: e.target.value
                    }))}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  data-testid="button-professor-login"
                  disabled={professorLoginMutation.isPending}
                >
                  {professorLoginMutation.isPending ? "Entrando..." : "Entrar como Professor"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="student" className="space-y-4">
              <form onSubmit={handleStudentRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Nome Completo</Label>
                  <Input
                    id="student-name"
                    data-testid="input-student-name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={studentData.name}
                    onChange={(e) => setStudentData(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-github">Perfil do GitHub</Label>
                  <div className="relative">
                    <GithubIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="student-github"
                      data-testid="input-student-github"
                      type="url"
                      placeholder="https://github.com/seuusuario"
                      className="pl-10"
                      value={studentData.githubProfile}
                      onChange={(e) => setStudentData(prev => ({
                        ...prev,
                        githubProfile: e.target.value
                      }))}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  data-testid="button-student-register"
                  disabled={studentRegisterMutation.isPending}
                >
                  {studentRegisterMutation.isPending ? "Cadastrando..." : "Cadastrar como Estudante"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}