import { useState } from "react";
import axios from "axios";
import { UseFormSetValue } from "react-hook-form";

// Interface para a resposta da API ViaCEP
interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // Cidade
  uf: string; // Estado
  erro?: boolean;
}

/**
 * Hook customizado para buscar e preencher endereços a partir de um CEP.
 * @param setValue - A função 'setValue' do react-hook-form.
 * @returns {object} - Funções e estados para interagir com a API.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const useViaCEP = (setValue: UseFormSetValue<any>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca o endereço pelo CEP e preenche os campos do formulário.
   * @param cep - O CEP a ser buscado.
   * @param index - (Opcional) O índice do campo em um array de formulário (useFieldArray).
   */
  const fetchAddressByCEP = async (cep: string, index?: number) => {
    const cleanedCep = cep?.replace(/\D/g, "");

    if (!cleanedCep || cleanedCep.length !== 8) {
      setError(cleanedCep ? "CEP inválido. Deve conter 8 dígitos." : null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get<ViaCEPResponse>(
        `https://viacep.com.br/ws/${cleanedCep}/json/`
      );

      // Define o prefixo do nome do campo. Será '' para formulários simples
      // ou 'addresses.0.' para formulários com arrays.
      const prefix = index !== undefined ? `addresses.${index}.` : "";

      if (data.erro) {
        setError("CEP não encontrado.");
        setValue(`${prefix}logradouro`, "");
        setValue(`${prefix}bairro`, "");
        setValue(`${prefix}cidade`, "");
        setValue(`${prefix}estado`, "");
      } else {
        // Preenche os campos do formulário usando o prefixo.
        setValue(`${prefix}logradouro`, data.logradouro, {
          shouldValidate: true,
        });
        setValue(`${prefix}bairro`, data.bairro, { shouldValidate: true });
        setValue(`${prefix}cidade`, data.localidade, { shouldValidate: true });
        setValue(`${prefix}estado`, data.uf, { shouldValidate: true });
      }
    } catch (e) {
      setError("Não foi possível buscar o CEP. Tente novamente.");
      console.error("Erro ao buscar CEP:", e);
    } finally {
      setLoading(false);
    }
  };

  return { fetchAddressByCEP, loading, error };
};
