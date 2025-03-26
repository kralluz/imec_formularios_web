"use client";

import type React from "react";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser, FaEnvelope } from "react-icons/fa";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await register({ name, email, password });

      setSuccess(true);

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        router.push("/admin/users");
      }, 2000);
    } catch (error: any) {
      setIsLoading(false);
      setSuccess(false);
    }
  }

  return (
    <Card
      className={`border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-800 hover-lift ${
        success ? "success-animation" : ""
      }`}
    >
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-gray-800 dark:text-white">
          Criar Usuário
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Preencha os dados abaixo para criar um novo usuário no sistema
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
              Nome
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                <FaUser />
              </div>
              <Input
                id="name"
                name="name"
                placeholder="Digite o nome completo"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500 transition-all"
                onFocus={(e) =>
                  e.target.parentElement?.classList.add("animate-shimmer")
                }
                onBlur={(e) =>
                  e.target.parentElement?.classList.remove("animate-shimmer")
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                <FaEnvelope />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Digite o email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500 transition-all"
                onFocus={(e) =>
                  e.target.parentElement?.classList.add("animate-shimmer")
                }
                onBlur={(e) =>
                  e.target.parentElement?.classList.remove("animate-shimmer")
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-gray-700 dark:text-gray-300"
            >
              Senha
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                <FaLock />
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite a senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500 transition-all"
                onFocus={(e) =>
                  e.target.parentElement?.classList.add("animate-shimmer")
                }
                onBlur={(e) =>
                  e.target.parentElement?.classList.remove("animate-shimmer")
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all hover-lift"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <FaEyeSlash className="animate-bounce-in" />
                ) : (
                  <FaEye />
                )}
                <span className="sr-only">
                  {showPassword ? "Esconder senha" : "Mostrar senha"}
                </span>
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/users")}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-all hover-lift"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700 transition-all hover-lift"
            disabled={isLoading || success}
          >
            {isLoading
              ? "Registrando..."
              : success
              ? "Sucesso!"
              : "Criar Usuário"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
