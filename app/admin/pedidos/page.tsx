import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import StatusSelector from "@/components/StatusSelector"

export default async function AdminPedidosPage() {
  // 1. Bloqueio de segurança
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/")
  }

  // 2. Busca todos os pedidos do banco de dados (Global)
  const pedidos = await prisma.pedido.findMany({
    include: {
      user: {
        select: { name: true, email: true }
      },
      itens: {
        include: { produto: true }
      }
    },
    orderBy: { dataCriacao: "desc" }
  })

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 flex-shrink-0">
        <div className="mb-8">
          <p className="text-xl font-black text-indigo-400 tracking-tight">PAINEL ADMIN</p>
          <p className="text-xs text-gray-400 mt-1">Gerenciamento Geral</p>
        </div>
        <nav className="space-y-2">
          <Link href="/admin" className="block hover:bg-gray-800 text-gray-300 hover:text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-all">
            📊 Visão Geral
          </Link>
          <Link href="/admin/produtos" className="block hover:bg-gray-800 text-gray-300 hover:text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-all">
            📦 Gerenciar Produtos
          </Link>
          <Link href="/admin/pedidos" className="block bg-indigo-600 font-semibold px-4 py-2.5 rounded-lg text-sm transition-all shadow-md shadow-indigo-900">
            📋 Gerenciar Pedidos
          </Link>
          <hr className="border-gray-800 my-4" />
          <Link href="/" className="block text-xs font-bold text-gray-400 hover:text-white transition-colors">
            ← Voltar para a Loja
          </Link>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Gerenciamento de Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">Controle o fluxo de vendas e altere o status das entregas.</p>
        </header>

        <div className="space-y-6">
          {pedidos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 text-gray-400 font-medium shadow-sm">
              Nenhum pedido foi realizado na loja ainda.
            </div>
          ) : (
            pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col">
                
                {/* TOPO DO CARD */}
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex gap-6 text-gray-500">
                    <div>
                      <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider block">ID do Pedido</span>
                      <span className="font-mono text-gray-800 font-medium">#{pedido.id}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider block">Data</span>
                      <span className="text-gray-800 font-medium">{new Date(pedido.dataCriacao).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider block">Cliente</span>
                      <span className="text-gray-800 font-bold">{pedido.user.name} ({pedido.user.email})</span>
                    </div>
                  </div>

                  {/* SELECT INTERATIVO DO STATUS (CLIENT COMPONENT) */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Alterar Status:</span>
                    <StatusSelector pedidoId={pedido.id} statusAtual={pedido.status} />
                  </div>
                </div>

                {/* LISTA DE PRODUTOS COMPRADOS NESTE PEDIDO */}
                <div className="p-4 divide-y divide-gray-50 flex-1">
                  {pedido.itens.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">
                          {item.quantidade}x
                        </span>
                        <p className="font-medium text-gray-800">{item.produto.nome}</p>
                      </div>
                      <p className="font-semibold text-gray-600">
                        {item.precoFixo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  ))}
                </div>

                {/* RODAPÉ DO CARD */}
                <div className="bg-gray-50/50 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total do Pedido:</span>
                  <span className="text-lg font-black text-indigo-600">
                    {pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
