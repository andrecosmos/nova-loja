import prisma from "@/lib/prisma"
import Link from "next/link"

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // 1. Aguarda a resolução dos parâmetros de busca da URL de forma segura
  const resolvedSearchParams = await searchParams
  const categoriaFiltro = typeof resolvedSearchParams.categoria === "string" ? resolvedSearchParams.categoria : undefined

  // 2. Busca todas as categorias existentes no banco para montar o menu de filtros
  const categorias = await prisma.categoria.findMany({
    orderBy: { nome: "asc" },
  })

  // 3. Busca os produtos aplicando o filtro se houver uma categoria selecionada
  const produtos = await prisma.produto.findMany({
    where: categoriaFiltro
      ? {
          Categoria: {
            nome: categoriaFiltro,
          },
        }
      : {},
    include: {
      Categoria: true,
    },
    orderBy: { id: "desc" },
  })

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SESSÃO DE FILTROS POR CATEGORIA */}
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Filtrar por Categoria
          </h2>
          <div className="flex flex-wrap gap-2">
            {/* Botão para limpar o filtro (Ver Todos) */}
            <Link
              href="/"
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                !categoriaFiltro
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              Todos os Produtos
            </Link>

            {/* Mapeia as categorias reais do seu banco */}
            {categorias.map((cat) => {
              const isSelected = categoriaFiltro === cat.nome
              return (
                <Link
                  key={cat.id}
                  href={`/?categoria=${encodeURIComponent(cat.nome)}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    isSelected
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {cat.nome}
                </Link>
              )
            })}
          </div>
        </section>

        {/* VITRINE DE PRODUTOS (GRID) */}
        <section>
          {produtos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">Nenhum produto encontrado nesta categoria.</p>
              <Link href="/" className="mt-2 inline-block text-sm text-indigo-600 font-semibold hover:underline">
                Limpar filtros e voltar
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {produtos.map((produto) => (
                <article
                  key={produto.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Link na Imagem */}
                  <Link href={`/produto/${produto.id}`} className="relative aspect-square bg-gray-100 overflow-hidden block">
                    {produto.imagem ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        Sem Imagem
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-gray-700 px-2 py-1 rounded-md shadow-sm">
                      {produto.Categoria.nome}
                    </span>
                  </Link>

                  {/* Detalhes / Textos */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <Link href={`/produto/${produto.id}`}>
                        <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {produto.nome}
                        </h3>
                      </Link>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2 min-h-[32px]">
                        {produto.descricao}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-lg font-black text-gray-900">
                        {produto.preco.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <Link
                        href={`/produto/${produto.id}`}
                        className="bg-gray-900 hover:bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
