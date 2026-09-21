import prisma from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import BotaoAdicionar from "@/components/BotaoAdicionar"

interface ProdutoPageProps {
  params: Promise<{ id: string }>
}

export default async function ProdutoDetailPage({ params }: ProdutoPageProps) {
  // 1. Captura o ID vindo da URL de forma assíncrona
  const { id } = await params
  const produtoId = Number(id)

  if (isNaN(produtoId)) {
    return notFound()
  }

  // 2. Busca o produto diretamente no banco PostgreSQL com a categoria vinculada
  const produto = await prisma.produto.findUnique({
    where: { id: produtoId },
    include: { Categoria: true },
  })

  // Se o produto não existir no banco ativo, exibe a tela de 404
  if (!produto) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      

      {/* CONTEÚDO DO PRODUTO */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          
          {/* Coluna da Imagem */}
          <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
            {produto.imagem ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">Imagem não disponível</span>
            )}
          </div>

          {/* Coluna das Informações */}
          <div className="flex flex-col justify-between py-2">
            <div>
              {/* Categoria */}
              <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-4">
                {produto.Categoria.nome}
              </span>
              
              {/* Título */}
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                {produto.nome}
              </h1>
              
              {/* Preço */}
              <p className="text-2xl font-black text-indigo-600 mb-6">
                {produto.preco.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>

              {/* Descrição */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Descrição do Produto
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {produto.descricao}
                </p>
              </div>
            </div>

            {/* Ações (Injeção do Componente Cliente Interativo) */}
            <div className="border-t border-gray-100 pt-6 mt-8">
              <BotaoAdicionar 
                produtoId={produto.id}
                nome={produto.nome}
                preco={produto.preco}
                imagem={produto.imagem}
              />
              <p className="text-center text-xs text-gray-400 mt-3">
                Disponibilidade imediata • Entrega para todo o Brasil
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
