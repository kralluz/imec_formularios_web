"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuestion } from "@/contexts/question-context";
import type { Question, QuestionType, QuestionOption } from "@/types/question";
import { message } from "antd";

interface QuestionFormProps {
  questionnaireId: string;
  parentQuestionId?: string | null;
  defaultIndex: number;
  initialValues: Partial<Question>;
  onCancel: () => void;
  onSuccess: () => void;
  getNextIndex: (parentId?: string) => number;
}

export default function QuestionForm({
  questionnaireId,
  parentQuestionId = null,
  defaultIndex,
  initialValues,
  onCancel,
  onSuccess,
  getNextIndex,
}: QuestionFormProps) {
  const { createQuestion, updateQuestion } = useQuestion();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados do formulário
  const [text, setText] = useState("");
  const [type, setType] = useState<QuestionType>("text");
  const [orderIndex, setOrderIndex] = useState(defaultIndex);
  const [triggerValue, setTriggerValue] = useState<string | null>(null);
  const [options, setOptions] = useState<Omit<QuestionOption, "id" | "questionId" | "createdAt">[]>([]);

  // Carregar dados da questão se estiver editando
  useEffect(() => {
    if (initialValues && initialValues.id) {
      setText(initialValues.text || "");
      setType(initialValues.type || "text");
      setOrderIndex(initialValues.orderIndex || defaultIndex);
      setTriggerValue(initialValues.triggerValue ?? null);
      if (initialValues.options && initialValues.options.length > 0) {
        setOptions(
          initialValues.options.map((opt) => ({
            label: opt.label,
            value: opt.value,
          }))
        );
      } else {
        setOptions([]);
      }
    } else {
      setText("");
      setType("text");
      setOrderIndex(defaultIndex);
      setTriggerValue(null);
      setOptions([]);
    }
  }, [initialValues, defaultIndex]);

  // Adicionar uma nova opção
  const addOption = () => {
    setOptions([...options, { label: "", value: "" }]);
  };

  // Remover uma opção
  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  // Atualizar uma opção
  const updateOption = (index: number, field: "label" | "value", value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value,
    };
    setOptions(updatedOptions);
  };

  // Verificar se o tipo de questão requer opções
  const requiresOptions = (type: QuestionType): boolean => {
    return ["radio", "checkbox", "select"].includes(type);
  };

  // Enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!text.trim()) {
        message.error("O texto da questão é obrigatório");
        setIsSubmitting(false);
        return;
      }
      if (requiresOptions(type) && options.length === 0) {
        message.error(`Questões do tipo ${type} precisam ter pelo menos uma opção`);
        setIsSubmitting(false);
        return;
      }
      if (requiresOptions(type)) {
        for (const option of options) {
          if (!option.label.trim() || !option.value.trim()) {
            message.error("Todas as opções precisam ter rótulo e valor");
            setIsSubmitting(false);
            return;
          }
        }
      }

      if (initialValues && initialValues.id) {
        await updateQuestion(initialValues.id, {
          text,
          type,
          orderIndex,
          triggerValue,
          options: requiresOptions(type) ? options : [],
        });
      } else {
        await createQuestion({
          questionnaireId,
          parentQuestionId,
          text,
          type,
          orderIndex,
          triggerValue,
          options: requiresOptions(type) ? options : [],
        });
      }
      message.success(
        initialValues && initialValues.id
          ? "A questão foi atualizada com sucesso"
          : "A questão foi criada com sucesso"
      );
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar questão:", error);
      message.error("Ocorreu um erro ao salvar a questão");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Removemos o título duplicado (CardHeader sem CardTitle) pois o Modal já exibe o título.
    <Card className="border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-800">
      <CardHeader className="pb-2"></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text" className="text-gray-700 dark:text-gray-300">
              Texto da Questão
            </Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite o texto da questão"
              className="border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-gray-700 dark:text-gray-300">
                Tipo de Questão
              </Label>
              <Select value={type} onValueChange={(value) => setType(value as QuestionType)}>
                <SelectTrigger
                  id="type"
                  className="border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500"
                >
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent style={{ zIndex: 9999 }}>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="textarea">Área de Texto</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="radio">Múltipla Escolha (Radio)</SelectItem>
                  <SelectItem value="checkbox">Caixas de Seleção (Checkbox)</SelectItem>
                  <SelectItem value="select">Lista Suspensa (Select)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderIndex" className="text-gray-700 dark:text-gray-300">
                Ordem
              </Label>
              <Input
                id="orderIndex"
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number.parseInt(e.target.value) || 0)}
                className="border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500"
                min={0}
              />
            </div>
          </div>

          {parentQuestionId && (
            <div className="space-y-2">
              <Label htmlFor="triggerValue" className="text-gray-700 dark:text-gray-300">
                Valor Gatilho (opcional)
              </Label>
              <Input
                id="triggerValue"
                value={triggerValue || ""}
                onChange={(e) => setTriggerValue(e.target.value || null)}
                placeholder="Valor que ativa esta questão (ex: 'yes')"
                className="border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Se preenchido, esta questão só será exibida quando a questão pai tiver este valor selecionado.
              </p>
            </div>
          )}

          {requiresOptions(type) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700 dark:text-gray-300">Opções</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="text-purple-600 border-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-purple-900/20"
                >
                  <FaPlus className="mr-1 h-3 w-3" /> Adicionar Opção
                </Button>
              </div>
              {options.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Nenhuma opção adicionada. Clique em "Adicionar Opção" para incluir opções.
                </p>
              ) : (
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          value={option.label}
                          onChange={(e) => updateOption(index, "label", e.target.value)}
                          placeholder="Rótulo (ex: Sim)"
                          className="border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          value={option.value}
                          onChange={(e) => updateOption(index, "value", e.target.value)}
                          placeholder="Valor (ex: yes)"
                          className="border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="h-8 w-8 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <FaTrash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <FaTimes className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700"
            >
              <FaSave className="mr-2 h-4 w-4" /> {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
