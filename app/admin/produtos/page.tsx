import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import FormProdutoModal from "@/components/FormProdutoModal"

export default async function AdminProdutosPage() {
  // 1. Bloqueio de Segurança no Servidor
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/")
  }

  // 2. Busca produtos e categorias em paralelo no PostgreSQL
  const [produtos, categorias] = await Promise.all([
    prisma.produto.findMany({
      include: { Categoria: true },
      orderBy: { id: "desc" },
    }),
    prisma.categoria.findMany({
      orderBy: { nome: "asc" },
    }),
  ])

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col md:flex-row">
      {/* SIDEBAR REPLICADA */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 flex-shrink-0">
        <div className="mb-8">
          <p className="text-xl font-black text-indigo-400 tracking-tight">PAINEL ADMIN</p>
          <p className="text-xs text-gray-400 mt-1">Gerenciamento Geral</p>
        </div>
        <nav className="space-y-2">
          <Link href="/admin" className="block hover:bg-gray-800 text-gray-300 hover:text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-all">
            📊 Visão Geral
          </Link>
          <Link href="/admin/produtos" className="block bg-indigo-600 font-semibold px-4 py-2.5 rounded-lg text-sm transition-all shadow-md shadow-indigo-900">
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

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-10">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Gerenciamento de Produtos</h1>
            <p className="text-sm text-gray-500 mt-1">Visualize, edite ou adicione novos produtos ao catálogo.</p>
          </div>
          {/* Modal do formulário de criação passadas as categorias do banco */}
          <FormProdutoModal categorias={categorias} />
        </header>

        {/* TABELA DE PRODUTOS */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Produto</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4 text-right">Preço</th>
                  <th className="p-4 pr-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {produtos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                      Nenhum produto cadastrado no banco.
                    </td>
                  </tr>
                ) : (
                  produtos.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 font-mono text-xs text-gray-400">#{prod.id}</td>
                      <td className="p-4 font-semibold text-gray-800">{prod.nome}</td>
                      <td className="p-4">
                        <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md">
                          {prod.Categoria.nome}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-gray-900">
                        {prod.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <Link href={`/produto/${prod.id}`} target="_blank" className="text-xs text-indigo-600 font-semibold hover:underline">
                          Visualizar na Loja
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
