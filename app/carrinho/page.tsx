'use client'

import { useCarrinho } from "@/context/CarrinhoContext"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CarrinhoPage() {
  const { itens, atualizarQuantidade, removerDoCarrinho, valorTotal, limparCarrinho } = useCarrinho()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true)
    setError('')

    try {
      // Formata os itens para o padrão exigido pela nossa API de pedidos
      const itensFormatados = itens.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoFixo: item.preco
      }))

      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itens: itensFormatados }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Você precisa estar logado para finalizar a compra.')
        }
        throw new Error(data.error || 'Erro ao processar seu pedido.')
      }

      // Sucesso! Limpa o carrinho local e manda para uma página de sucesso
      limparCarrinho()
      alert('Pedido realizado com sucesso!')
      router.push('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">Seu Carrinho</h1>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200 text-sm font-medium text-red-800 text-center">
            {error}{' '}
            {error.includes('logado') && (
              <Link href="/login" className="underline font-bold text-indigo-600 hover:text-indigo-700">
                Fazer Login
              </Link>
            )}
          </div>
        )}

        {itens.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">Seu carrinho está vazio.</p>
            <Link href="/" className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-2 rounded-xl transition-colors shadow-lg shadow-indigo-100">
              Ver Produtos
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* LISTA DE ITENS */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
              {itens.map((item) => (
                <div key={item.produtoId} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.imagem ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-gray-400">Sem Foto</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.nome}</h3>
                      <p className="text-sm font-black text-indigo-600 mt-0.5">
                        {item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  </div>

                  {/* Seleção de quantidade e remoção */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                      <button
                        onClick={() => atualizarQuantidade(item.produtoId, item.quantidade - 1)}
                        className="px-3 py-1 text-gray-500 hover:text-gray-700 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 text-sm font-semibold w-8 text-center">{item.quantidade}</span>
                      <button
                        onClick={() => atualizarQuantidade(item.produtoId, item.quantidade + 1)}
                        className="px-3 py-1 text-gray-500 hover:text-gray-700 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removerDoCarrinho(item.produtoId)}
                      className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CARD DE RESUMO E FECHAMENTO */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">Valor Total</span>
                <p className="text-3xl font-black text-gray-900 mt-1">
                  {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 text-center"
              >
                {loading ? 'Finalizando...' : 'Finalizar Compra'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
