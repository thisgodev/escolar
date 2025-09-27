import { useState } from "react";
import axios from "axios";
import { UseFormSetValue } from "react-hook-form";

interface ViaCEPResponse {
  logradouro: string;
  bairro: string;
  localidade: string; // Cidade
  uf: string; // Estado
  erro?: boolean;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export const useViaCEP = (setValue: UseFormSetValue<any>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca o endereço pelo CEP.
   * @param cep - O CEP a ser buscado.
   * @param fieldPrefix - (Opcional) O prefixo para os nomes dos campos (ex: 'addressData.').
   */
  const fetchAddressByCEP = async (cep: string, fieldPrefix = "") => {
    const cleanedCep = cep?.replace(/\D/g, "");
    if (!cleanedCep || cleanedCep.length !== 8) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get<ViaCEPResponse>(
        `https://viacep.com.br/ws/${cleanedCep}/json/`
      );

      if (data.erro) {
        setError("CEP não encontrado.");
      } else {
        // Usa o prefixo para montar o nome completo do campo
        setValue(`${fieldPrefix}logradouro`, data.logradouro);
        setValue(`${fieldPrefix}bairro`, data.bairro);
        setValue(`${fieldPrefix}cidade`, data.localidade);
        setValue(`${fieldPrefix}estado`, data.uf);
      }
    } catch (e) {
      setError(`Não foi possível buscar o CEP. ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return { fetchAddressByCEP, loading, error };
};
