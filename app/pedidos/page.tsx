'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

// Interface baseada nos enums e tabelas do seu schema.prisma
interface ItemPedido {
  id: number
  quantidade: number
  precoFixo: number
  produto: {
    nome: string
    imagem: string | null
  }
}

interface Pedido {
  id: number
  dataCriacao: string
  status: "PENDENTE" | "PAGO" | "ENVIADO" | "ENTREGUE" | "CANCELADO"
  total: number
  itens: ItemPedido[]
}

export default function MeusPedidosPage() {
  const { data: session, status: sessionStatus } = useSession()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Só faz a busca quando a sessão terminar de carregar e o usuário estiver logado
    if (sessionStatus === "authenticated") {
      fetch("/api/pedidos")
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar histórico de pedidos.")
          return res.json()
        })
        .then((data) => {
          setPedidos(data)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    } else if (sessionStatus === "unauthenticated") {
      setLoading(false)
    }
  }, [sessionStatus])

  // Cores personalizadas do Tailwind para cada status do seu Enum
  const badgeCores = {
    PENDENTE: "bg-amber-50 text-amber-700 border-amber-200",
    PAGO: "bg-green-50 text-green-700 border-green-200",
    ENVIADO: "bg-blue-50 text-blue-700 border-blue-200",
    ENTREGUE: "bg-purple-50 text-purple-700 border-purple-200",
    CANCELADO: "bg-red-50 text-red-700 border-red-200",
  }

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium animate-pulse">Carregando seus pedidos...</p>
      </div>
    )
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md">
          <p className="text-gray-500 font-medium mb-4">Você precisa estar conectado para ver seus pedidos.</p>
          <Link href="/login" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100">
            Fazer Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Seus Pedidos</h1>
            <p className="text-sm text-gray-500 mt-1">Histórico completo de compras de {session?.user?.name}</p>
          </div>
          <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">
            Voltar para a loja →
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200 text-sm font-medium text-red-800 text-center">
            {error}
          </div>
        )}

        {pedidos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">Você ainda não realizou nenhuma compra.</p>
            <Link href="/" className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-2 rounded-xl transition-colors">
              Começar a comprar
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* CABEÇALHO DO CARD DO PEDIDO */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-6 text-xs text-gray-500">
                    <div>
                      <p className="font-bold uppercase tracking-wider text-[10px] text-gray-400">Pedido Realizado</p>
                      <p className="font-medium mt-0.5">{new Date(pedido.dataCriacao).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-wider text-[10px] text-gray-400">Identificador</p>
                      <p className="font-medium mt-0.5">#{pedido.id}</p>
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-wider text-[10px] text-gray-400">Total Pago</p>
                      <p className="font-black text-gray-900 mt-0.5">
                        {pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  </div>

                  {/* BADGE DE STATUS DINÂMICO */}
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${badgeCores[pedido.status]}`}>
                    {pedido.status}
                  </span>
                </div>

                {/* LISTA DE ITENS DO PEDIDO */}
                <div className="divide-y divide-gray-100">
                  {pedido.itens.map((item) => (
                    <div key={item.id} className="p-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.produto.imagem ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.produto.imagem} alt={item.produto.nome} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-gray-400">Sem Foto</span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800">{item.produto.nome}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">Quantidade: {item.quantidade}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-700">
                        {item.precoFixo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
