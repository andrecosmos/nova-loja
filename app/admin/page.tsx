import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminDashboardPage() {
  // 1. Bloqueio de Segurança Rígido no Servidor
  const session = await auth()

  if (!session || (session.user as any).role !== "ADMIN") {
    // Se não estiver logado ou não for ADMIN, expulsa de volta para a Home
    redirect("/")
  }

  // 2. Busca dados estatísticos consolidados direto do seu banco PostgreSQL
  const totalProdutos = await prisma.produto.count()
  const totalCategorias = await prisma.categoria.count()
  const totalPedidos = await prisma.pedido.count()
  
  // Soma o faturamento total apenas de pedidos que já foram pagos, enviados ou entregues
  const faturamentoAgregado = await prisma.pedido.aggregate({
    _sum: {
      total: true,
    },
    where: {
      status: {
        in: ["PAGO", "ENVIADO", "ENTREGUE"],
      },
    },
  })

  const faturamentoTotal = faturamentoAgregado._sum.total || 0

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col md:flex-row">
      
      {/* MENU LATERAL ESQUERDO (SIDEBAR) */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 flex-shrink-0">
        <div className="mb-8">
          <p className="text-xl font-black text-indigo-400 tracking-tight">PAINEL ADMIN</p>
          <p className="text-xs text-gray-400 mt-1">Gerenciamento Geral</p>
        </div>
        
        <nav className="space-y-2">
          <Link href="/admin" className="block bg-indigo-600 font-semibold px-4 py-2.5 rounded-lg text-sm transition-all shadow-md shadow-indigo-900">
            📊 Visão Geral
          </Link>
          <Link href="/admin/produtos" className="block hover:bg-gray-800 text-gray-300 hover:text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-all">
            📦 Gerenciar Produtos
          </Link>
          <Link href="/admin/pedidos" className="block hover:bg-gray-800 text-gray-300 hover:text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-all">
            📋 Gerenciar Pedidos
          </Link>
          <hr className="border-gray-800 my-4" />
          <Link href="/" className="block text-xs font-bold text-gray-400 hover:text-white transition-colors">
            ← Voltar para a Loja
          </Link>
        </nav>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Visão Geral do Sistema</h1>
          <p className="text-sm text-gray-500 mt-1">Bem-vindo de volta, {session.user?.name}. Aqui está o resumo da sua loja:</p>
        </header>

        {/* CARDS COM MÉTRICAS DO BANCO DE DADOS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Card Faturamento */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Faturamento Confirmado</span>
            <p className="text-2xl font-black text-indigo-600 mt-2">
              {faturamentoTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </div>

          {/* Card Pedidos */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total de Pedidos</span>
            <p className="text-3xl font-black text-gray-900 mt-2">{totalPedidos}</p>
          </div>

          {/* Card Produtos */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Produtos Cadastrados</span>
            <p className="text-3xl font-black text-gray-900 mt-2">{totalProdutos}</p>
          </div>

          {/* Card Categorias */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categorias Ativas</span>
            <p className="text-3xl font-black text-gray-900 mt-2">{totalCategorias}</p>
          </div>

        </section>
      </main>

    </div>
  )
}
