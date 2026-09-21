'use client'

import { useCarrinho } from "@/context/CarrinhoContext"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface BotaoAdicionarProps {
  produtoId: number
  nome: string
  preco: number
  imagem: string | null
}

export default function BotaoAdicionar({ produtoId, nome, preco, imagem }: BotaoAdicionarProps) {
  const { adicionarAoCarrinho } = useCarrinho()
  const [adicionado, setAdicionado] = useState(false)
  const router = useRouter()

  const handleAdicionar = () => {
    adicionarAoCarrinho({
      produtoId,
      nome,
      preco,
      imagem,
    })

    setAdicionado(true)

    // Reseta o texto do botão após 2 segundos
    setTimeout(() => {
      setAdicionado(false)
      // Opcional: Redireciona o usuário direto para a página do carrinho
      router.push('/carrinho')
    }, 1000)
  }

  return (
    <button
      onClick={handleAdicionar}
      className={`w-full font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-center block ${
        adicionado
          ? "bg-green-600 text-white shadow-green-100"
          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
      }`}
    >
      {adicionado ? "✓ Adicionado!" : "Adicionar ao Carrinho"}
    </button>
  )
}
