'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Estrutura de um item do carrinho
export interface CartItem {
  produtoId: number
  nome: string
  preco: number
  imagem: string | null
  quantidade: number
}

interface CarrinhoContextType {
  itens: CartItem[]
  adicionarAoCarrinho: (produto: Omit<CartItem, 'quantidade'>) => void
  removerDoCarrinho: (produtoId: number) => void
  atualizarQuantidade: (produtoId: number, quantidade: number) => void
  limparCarrinho: () => void
  totalItens: number
  valorTotal: number
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined)

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<CartItem[]>([])

  // Carrega os dados do LocalStorage ao montar o componente no cliente
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('minhaloja:carrinho')
    if (carrinhoSalvo) {
      try {
        setItens(JSON.parse(carrinhoSalvo))
      } catch (e) {
        console.error("Erro ao ler carrinho do localStorage")
      }
    }
  }, [])

  // Salva no LocalStorage sempre que a lista de itens mudar
  useEffect(() => {
    localStorage.setItem('minhaloja:carrinho', JSON.stringify(itens))
  }, [itens])

  const adicionarAoCarrinho = (novoProduto: Omit<CartItem, 'quantidade'>) => {
    setItens((itensAtuais) => {
      const itemExiste = itensAtuais.find((item) => item.produtoId === novoProduto.produtoId)

      if (itemExiste) {
        return itensAtuais.map((item) =>
          item.produtoId === novoProduto.produtoId
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      }

      return [...itensAtuais, { ...novoProduto, quantidade: 1 }]
    })
  }

  const removerDoCarrinho = (produtoId: number) => {
    setItens((itensAtuais) => itensAtuais.filter((item) => item.produtoId !== produtoId))
  }

  const atualizarQuantidade = (produtoId: number, quantidade: number) => {
    if (quantidade <= 0) {
      removerDoCarrinho(produtoId)
      return
    }
    setItens((itensAtuais) =>
      itensAtuais.map((item) =>
        item.produtoId === produtoId ? { ...item, quantidade } : item
      )
    )
  }

  const limparCarrinho = () => setItens([])

  const totalItens = itens.reduce((soma, item) => soma + item.quantidade, 0)
  const valorTotal = itens.reduce((soma, item) => soma + item.quantidade * item.preco, 0)

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidade,
        limparCarrinho,
        totalItens,
        valorTotal,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  )
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext)
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider')
  }
  return context
}
