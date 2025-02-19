"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CampoSelecao } from "@/components/ui/dropdown";
import { useEffect } from "react";
import { FaPlus, FaTrash } from 'react-icons/fa';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Calendar from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  UpdateFormularioParams,
  DeleteFormularioParams,
  InsertFormularioParams,
  UpdateFormularioItem,
  JsonFormulario
} from "../../../../service/ppgls/types";
import { useInsertFormulario } from "../../../../service/ppgls/formulario/queries";

const formSchema = z.object({
  nome_espec: z.string(),
  centro: z.string(),
  categoria_profissional: z.string(),
  data_pren: z.coerce.date(),
  data_ini: z.coerce.date(),
  data_ter: z.coerce.date(),
  vagasOfertadas: z.coerce.number().min(0, "O número de vagas ofertadas deve ser maior ou igual a 0."),
  vagasPreenchidas: z.coerce.number().min(0, "O número de vagas preenchidas deve ser maior ou igual a 0."),
  r1: z.coerce.number().min(0),
  r2: z.coerce.number().min(0),
  r3: z.coerce.number().min(0),
  especialista: z.coerce.number().min(0),
  nome_coord: z.string(),
  carg_hor_coord: z.coerce.number().min(0),
  cod_masp_coord: z.coerce.number().min(0),
  cod_masp_prof: z.coerce.number().min(0),
  nome_cor: z.string(),
  nome_prof: z.string(),
  titulacao: z.string(),
  vinculo: z.string(),
  carga_hor_tot: z.coerce.number().min(0),
  carga_hor_JE: z.coerce.number().min(0),
  carga_hor_PE: z.coerce.number().min(0),
  carga_hor_PP: z.coerce.number().min(0),

});

const opcoesCentro = [
  { valor: "CCET", rotulo: "CCET" },
  { valor: "CCBS", rotulo: "CCBS" },
  { valor: "CCH", rotulo: "CCH" },
  { valor: "CCSA", rotulo: "CCSA" },
];

const opcoesVinculo = [
  { valor: "EFETIVO COM DE", rotulo: "Efetivo com DE" },
  { valor: "EFETIVO SEM DE", rotulo: "Efetivo sem DE" },
  { valor: "DESIGNADO", rotulo: "Designado" },
  { valor: "CONTRATADO", rotulo: "Contratado" },
];

export const MyForm = () => {

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_espec: "",
      centro: "",
      categoria_profissional: "",
      data_pren: new Date(),
      data_ini: new Date(),
      data_ter: new Date(),
      vagasOfertadas: 0,
      vagasPreenchidas: 0,
      r1:0,
      r2:0,
      r3:0,
      especialista:0,
      nome_coord: "",
      carg_hor_coord:0,
      cod_masp_coord:0,
      cod_masp_prof:0,
      nome_cor:"",
      nome_prof:"",
      titulacao:"",
      vinculo:"",
      carga_hor_tot:0,
      carga_hor_JE:0,
      carga_hor_PE:0,
      carga_hor_PP:0,
    },
  });

  const [professores, setProfessores] = useState([]);
  const [dadosTabela, setDadosTabela] = useState<FormValues[]>([]);
  const [linhaSelecionada, setLinhaSelecionada] = useState(null);
  const isFormValid = form.formState.isValid && dadosTabela.length > 0;

  const handleSelecionarLinha = (index) => {
    setLinhaSelecionada(index === linhaSelecionada ? null : index);
  };
  

  const handleExcluir = () => {
    if (linhaSelecionada !== null) {
      const novaTabela = dadosTabela.filter((_, index) => index !== linhaSelecionada);
      setDadosTabela(novaTabela);
      setLinhaSelecionada(null); // Resetar a seleção
    }
  };

  type FormValues = z.infer<typeof formSchema>;

  // Inicialize o item com um valor vazio, mas do tipo correto
  const [item, setItem] = useState<InsertFormularioParams | null>(null);

  // Passando o item para o hook
  const { data, isLoading, error } = useInsertFormulario({
    item: item as InsertFormularioParams, // Passa o item somente se for válido
  });

  async function onSubmit() {
    try {
      const valoresFormulario = form.getValues();

      const dataInicioISO = valoresFormulario.data_ini instanceof Date 
        ? valoresFormulario.data_ini.toISOString() 
        : new Date(valoresFormulario.data_ini).toISOString();

      const dataTerminoISO = valoresFormulario.data_ter instanceof Date 
        ? valoresFormulario.data_ter.toISOString() 
        : new Date(valoresFormulario.data_ter).toISOString();

      const jsonFormulario: JsonFormulario = {
        data_preenchimento: new Date().toISOString(),
        coordenador: {
          coordenador_masp: valoresFormulario.cod_masp_coord,
          coordenador_nome: valoresFormulario.nome_cor,
          carga_horaria: valoresFormulario.carg_hor_coord,
        },
        residencia_especializacao: {
          id: 0,
          nome: valoresFormulario.nome_espec,
          data_inicio: dataInicioISO,
          data_termino: dataTerminoISO,
          vagas_ofertadas: valoresFormulario.vagasOfertadas,
          vagas_preenchidas: valoresFormulario.vagasPreenchidas,
          categoria_profissional: valoresFormulario.categoria_profissional,
          centro: valoresFormulario.centro,
          r1: valoresFormulario.r1,
          r2: valoresFormulario.r2,
          r3: valoresFormulario.r3,
          especialista: valoresFormulario.especialista,
        },
        professores: dadosTabela.map((prof, index) => ({
          id: index + 1,
          nome: prof.nome_prof,
          vinculo: prof.vinculo,
          titulacao: prof.titulacao,
          carga_horaria_jornada_extendida: prof.carga_hor_JE,
          carga_horaria_projeto_extencao: prof.carga_hor_PE,
          carga_horaria_projeto_pesquisa: prof.carga_hor_PP,
          carga_horaria_total: prof.carga_hor_tot,
        })),
      };

      // Atualiza o item com os dados estruturados
      setItem({ item: { nome: valoresFormulario.nome_espec, json: jsonFormulario } });

      const { data, isLoading, error } = useInsertFormulario({ item: jsonFormulario });

      if (error) {
        console.error("Erro ao inserir formulário:", error);
        alert("Erro ao inserir o formulário");
      }
  
      if (isLoading) {
        console.log("Enviando formulário...");
      }
  
      if (data) {
        console.log("Dados enviados com sucesso:", data);
        // Aqui você pode tratar a resposta ou dar um feedback ao usuário
      }

    } catch (error) {
      alert("Erro ao submeter o formulário.");
      console.error("Erro no envio do formulário", error);
    }
  }

  
  
  const handleIncluir = () => {
    const valoresAtuais = form.getValues(); // Obtém os valores dos campos
    
    // Verifica se os campos obrigatórios estão preenchidos
    if (!valoresAtuais.cod_masp_prof || !valoresAtuais.nome_prof || !valoresAtuais.titulacao) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
  
    setDadosTabela(prevState => [...prevState, valoresAtuais]); // Adiciona a nova linha na tabela
    localStorage.setItem("formData", JSON.stringify(valoresAtuais)); // Salva os dados no localStorage

    
  };

  const handleSaveData = () => {
    const formData = form.getValues();
    console.log("Salvando no localStorage:", formData);
    localStorage.setItem("formData", JSON.stringify(formData));
  };

  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      const data = JSON.parse(savedData); // Fazer o parse uma única vez
  
      console.log("Recuperando do localStorage:", data); // Verificar os dados recuperados
  
      form.setValue("nome_espec", data.nome_espec || "");
      form.setValue("centro", data.centro || ""); // Garantir que um valor seja atribuído corretamente
      form.setValue("categoria_profissional", data.categoria_profissional || "");
      form.setValue("data_ini", data.data_ini || null);
      form.setValue("data_ter", data.data_ter || null);
      form.setValue("vagasOfertadas", data.vagasOfertadas || "");
      form.setValue("vagasPreenchidas", data.vagasPreenchidas || "");
      form.setValue("r1", data.r1 || "");
      form.setValue("r2", data.r2 || "");
      form.setValue("r3", data.r3 || "");
      form.setValue("especialista", data.especialista || "");
      form.setValue("nome_coord", data.nome_coord || "");
      form.setValue("carg_hor_coord", data.carg_hor_coord || "");
      form.setValue("cod_masp_prof", data.cod_masp_prof || "");
      form.setValue("cod_masp_coord", data.cod_masp_coord || "");
      form.setValue("nome_cor", data.nome_cor || "");
      form.setValue("nome_prof", data.nome_prof || "");
      form.setValue("titulacao", data.titulacao || "");
      form.setValue("vinculo", data.vinculo || "");
      form.setValue("carga_hor_tot", data.carga_hor_tot || "");
      form.setValue("carga_hor_JE", data.carga_hor_JE || "");
      form.setValue("carga_hor_PE", data.carga_hor_PE || "");
      form.setValue("carga_hor_PP", data.carga_hor_PP || "");
    }
  }, [form]); // Dependência adicionada para garantir a execução correta
  

  const saveToLocalStorage = (values) => {
    localStorage.setItem("formData", JSON.stringify(values));
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      saveToLocalStorage(value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleLinhaClick = (index) => {
    setLinhaSelecionada(index);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
        <div className="flex items-center justify-center space-x-4 text-center mb-16">
          <img
            src="/images/logo_unimonetes.png"
            alt="Logo Unimonetes"
            className="w-26 h-14 object-contain"
          />
          <div className="space-y-1">
            <h1 className="text-base">Universidade Estadual de Montes Claros - UNIMONTES</h1>
            <h2 className="text-base">Pró-Reitoria de Pós-Graduação</h2>
            <h3 className="text-base">Coordenadoria de Pós Graduação</h3>
          </div>
        </div>
        <p className="text-sm font-medium -mb-2">Expecialização ou Residência</p>
        <div className="border border-gray-300 p-6 rounded-md space-y-6 !mt-0">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-6 flex flex-col">
              <FormField
                control={form.control}
                name="nome_espec"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Insira o nome da residência" 
                        {...field} 
                        required
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.nome_espec && (
                        <span className="text-red-500">Este campo é obrigatório</span>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6 flex flex-col">
              <FormField
                control={form.control}
                name="data_pren"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de preenchimento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                              "text-gray-500 cursor-not-allowed" 
                            )}
                            disabled 
                          >
                            {field.value
                              ? new Date(field.value).toLocaleDateString("pt-BR")
                              : "Selecione uma data"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50 bg-white" align="start">
                        <Calendar
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 flex flex-col">
              <FormField
                control={form.control}
                name="data_ini"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de início</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(new Date(field.value), "dd/MM/yyyy") : <span>Selecione uma data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50 bg-white" align="start">
                        <Calendar
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4 flex flex-col">
              <FormField
                control={form.control}
                name="data_ter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de término</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(new Date(field.value), "dd/MM/yyyy") : <span>Selecione uma data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4 flex flex-col">
              <FormField
              control={form.control}
              name="categoria_profissional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria profissional</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 flex flex-col">
              <FormField
                control={form.control}
                name="vagasOfertadas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vagas ofertadas</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0" // Garantir que o valor seja positivo
                        step="1" // Evitar valores decimais
                        value={field.value === 0 ? "" : field.value}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4 flex flex-col">
              <FormField
                control={form.control}
                name="vagasPreenchidas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vagas preenchidas</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0" // Garantir que o valor seja positivo
                        step="1" // Evitar valores decimais
                        value={field.value === 0 ? "" : field.value}
                        required
  
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4 flex flex-col">
              <FormField
                control={form.control}
                name="centro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Centro</FormLabel>
                    <FormControl>
                      <CampoSelecao
                        options={opcoesCentro}
                        value={field.value}
                        onChange={(valorSelecionado) => {
                          console.log("🔹 Selecionado:", valorSelecionado);
                          field.onChange(valorSelecionado);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <p className="text-sm font-medium -mb-2">Número atual de residentes/especialista</p>
          <div className="border border-gray-300 p-6 rounded-md space-y-6 !mt-0">
            {/* Linha 1 com r1 e r2 lado a lado */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="r1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>R1</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="0" 
                          step="1" 
                          value={field.value === 0 ? "" : field.value} 
                          required 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="r2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>R2</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          min="0" 
                          step="1" 
                          required 
                          value={field.value === 0 ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Linha 2 com r3 e especialista lado a lado */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="r3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>R3</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="0" 
                          step="1" 
                          required 
                          value={field.value === 0 ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="especialista"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialista</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="0" 
                          step="1" 
                          required 
                          value={field.value === 0 ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm font-medium -mb-0">Coordenador</p>
        <div className="border border-gray-300 p-6 rounded-md space-y-6 !mt-0">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-6 flex flex-col">

            <FormField
              control={form.control}
              name="cod_masp_coord"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código MASP</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={field.value === 0 ? "" : field.value}
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        if (input.value.length < 6) {
                          input.setCustomValidity("O Código MASP deve ter pelo menos 6 dígitos");
                        } else {
                          input.setCustomValidity("");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
    
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-6 flex flex-col">
                <FormField
                  control={form.control}
                  name="nome_cor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do coordenador</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Insira o nome do coordenador" 
                          {...field} 
                          required
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.nome_cor && (
                          <span className="text-red-500">Este campo é obrigatório</span>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 flex flex-col">
                <FormField
                  control={form.control}
                  name="carg_hor_coord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carga horária</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0" 
                          step="1" 
                          value={field.value === 0 ? "" : field.value} // Se for 0, deixa vazio
                          onChange={(e) => {
                            const value = e.target.value === "" ? undefined : Number(e.target.value);
                            field.onChange(value);
                          }}
                          required
                          
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
          </div>
        </div>
        <p className="text-sm font-medium -mb-0">Professor</p>
        <div className="border border-gray-300 p-6 rounded-md space-y-6 !mt-0">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-6 flex flex-col">

            <FormField
              control={form.control}
              name="cod_masp_prof"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código MASP</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={field.value === 0 ? "" : field.value}
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        if (input.value.length < 6) {
                          input.setCustomValidity("O Código MASP deve ter pelo menos 6 dígitos");
                        } else {
                          input.setCustomValidity("");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
    
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-6 flex flex-col">
                <FormField
                  control={form.control}
                  name="nome_prof"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do professor</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Insira o nome do professor" 
                          {...field} 
                          required
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.nome_prof && (
                          <span className="text-red-500">Este campo é obrigatório</span>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4 flex flex-col">
              <FormField
              control={form.control}
              name="titulacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titulação</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
              
          </div>
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-4 flex flex-col">
                <FormField
                  control={form.control}
                  name="vinculo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vínculo</FormLabel>
                      <FormControl>
                        <CampoSelecao
                          options={opcoesVinculo}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </div>
          <p className="text-sm font-medium -mb-2">Carga horária</p>
          <div className="border border-gray-300 p-6 rounded-md space-y-6 !mt-0">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-6 flex flex-col">
                <FormField
                  control={form.control}
                  name="carga_hor_tot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carga horária total</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          step="1"
                          required
                          value={field.value === 0 ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex space-x-4">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="carga_hor_JE"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Em Jornada Extendida</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="0" 
                            step="1" 
                            value={field.value === 0 ? "" : field.value} 
                            required 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="carga_hor_PE"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Em Projeto de Extenção</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number"
                            min="0" 
                            step="1" 
                            required 
                            value={field.value === 0 ? "" : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="carga_hor_PP"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Em Projeto de Pesquisa</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number"
                            min="0" 
                            step="1" 
                            required 
                            value={field.value === 0 ? "" : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

            </div>
            <div className="flex justify-end space-x-2 mt-2">
              <button type="button" onClick={handleIncluir} className="bg-green-500 text-white px-4 py-2 text-sm rounded-md flex items-center space-x-2">
                <FaPlus className="text-white" />
                <span>Incluir</span>
              </button>
              <button type="button" className="bg-red-500 text-white px-4 py-2 text-sm rounded-md flex items-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed" onClick={handleExcluir} disabled={linhaSelecionada === null}>
                <FaTrash className="text-white" />
                <span>Excluir</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-xs w-[50px]">Código MASP</th>
                    <th className="border px-4 py-2 text-xs w-[50px]">Nome do Professor</th>
                    <th className="border px-4 py-2 text-xs w-[50px]">Vínculo</th>
                    <th className="border px-4 py-2 text-xs w-[50px]">Titulação</th>
                    <th className="border px-4 py-2 text-xs w-[50px]">Carga Horária Total</th>
                    <th className="border px-4 py-2 text-xs w-[50px]">Carga Horária Jornada Extendida</th>
                    <th className="border px-4 py-2 text-xs w-[50px]">Carga Horária Projeto Extenção</th>
                    <th className="border px-4 py-2 text-xs w-[50px]">Carga Horária Projeto de Pesquisa</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosTabela.map((prof, index) => (
                    <tr 
                      key={index} 
                      className={`cursor-pointer ${linhaSelecionada === index ? "bg-blue-100" : ""}`} // Destacar a linha selecionada
                      onClick={() => handleSelecionarLinha(index)} // Definir a linha como selecionada
                    >
                      <td className="border px-4 py-2 text-xs text-center w-[50px] overflow-auto whitespace-nowrap max-w-[100px]">{prof.cod_masp_prof}</td>
                      <td className="border px-4 py-2 text-xs text-center w-[50px] overflow-auto whitespace-nowrap max-w-[100px]">{prof.nome_prof}</td>
                      <td className="border px-4 py-2 text-xs text-center w-[50px] overflow-auto whitespace-nowrap max-w-[100px]">{prof.vinculo}</td>
                      <td className="border px-4 py-2 text-xs text-center w-[50px] overflow-auto whitespace-nowrap max-w-[100px]">{prof.titulacao}</td>
                      <td className="border px-4 py-2 text-xs text-center w-[50px] overflow-auto whitespace-nowrap max-w-[100px]">{prof.carga_hor_tot}</td>
                      <td className="border px-4 py-2 text-xs text-center w-[50px] overflow-auto whitespace-nowrap max-w-[100px]">{prof.carga_hor_JE}</td>
                      <td className="border px-4 py-2 text-xs text-center w-[50px] overflow-auto whitespace-nowrap max-w-[100px]">{prof.carga_hor_PE}</td>
                      <td className="border px-4 py-2 text-xs text-center w-[50px] overflow-auto whitespace-nowrap max-w-[100px]">{prof.carga_hor_PP}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
        
        <Button type="submit" disabled={!isFormValid}>
          Enviar
        </Button>
      </form>
    </Form>
  );
};

export default MyForm;
  