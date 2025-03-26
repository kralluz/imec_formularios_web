"use client";

import { useState } from "react";
import { FaDownload, FaSearch } from "react-icons/fa";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, notification } from "antd";

const mockPdfs = [
  {
    id: "1",
    patientName: "Maria Silva",
    formName: "Anamnese",
    date: "2023-05-15",
    fileUrl: "#",
  },
  {
    id: "2",
    patientName: "João Santos",
    formName: "Avaliação Física",
    date: "2023-05-16",
    fileUrl: "#",
  },
  {
    id: "3",
    patientName: "Ana Oliveira",
    formName: "Exame Clínico",
    date: "2023-05-17",
    fileUrl: "#",
  },
  {
    id: "4",
    patientName: "Carlos Pereira",
    formName: "Prescrição Médica",
    date: "2023-05-18",
    fileUrl: "#",
  },
  {
    id: "5",
    patientName: "Lúcia Ferreira",
    formName: "Anamnese",
    date: "2023-05-19",
    fileUrl: "#",
  },
];

export function PdfList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pdfs, setPdfs] = useState(mockPdfs);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredPdfs = pdfs.filter(
    (pdf) =>
      pdf.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.formName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const handleDownload = (
    id: string,
    patientName: string,
    formName: string
  ) => {
    setDownloadingId(id);

    setTimeout(() => {
      notification.success({
        message: "Download concluído",
        description: `${formName} - ${patientName}`,
      });
      setDownloadingId(null);
    }, 1500);
  };

  return (
    <Card className="overflow-hidden border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-800 animate-scale-in opacity-0">
      <div className="p-4">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <FaSearch />
          </div>
          <Input
            type="text"
            placeholder="Buscar por paciente ou tipo de formulário..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="pl-10 border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500 transition-all"
            onFocus={(e) =>
              e.target.parentElement?.classList.add("animate-shimmer")
            }
            onBlur={(e) =>
              e.target.parentElement?.classList.remove("animate-shimmer")
            }
          />
        </div>
        <div className="rounded-md border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader className="bg-gray-100 dark:bg-gray-800">
              <TableRow>
                <TableHead className="text-gray-700 dark:text-gray-300">
                  Nome do Paciente
                </TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">
                  Formulário
                </TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">
                  Data
                </TableHead>
                <TableHead className="text-right text-gray-700 dark:text-gray-300">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPdfs.length > 0 ? (
                filteredPdfs.map((pdf, index) => (
                  <TableRow
                    key={pdf.id}
                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all animate-slide-up opacity-0`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TableCell className="font-medium text-gray-800 dark:text-gray-300">
                      {pdf.patientName}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-400">
                      {pdf.formName}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-400">
                      {formatDate(pdf.date)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="default"
                        variant="outlined"
                        onClick={() =>
                          handleDownload(pdf.id, pdf.patientName, pdf.formName)
                        }
                        disabled={downloadingId === pdf.id}
                        className={`text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover-lift ${
                          downloadingId === pdf.id ? "animate-pulse-purple" : ""
                        }`}
                      >
                        <FaDownload
                          className={`mr-2 ${
                            downloadingId === pdf.id
                              ? "text-purple-500 dark:text-purple-400"
                              : "text-purple-600 dark:text-purple-400"
                          }`}
                        />
                        {downloadingId === pdf.id ? "Baixando..." : "Download"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-gray-700 dark:text-gray-400"
                  >
                    {searchTerm ? (
                      <>Nenhum formulário encontrado para "{searchTerm}".</>
                    ) : (
                      <>Nenhum formulário encontrado.</>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
