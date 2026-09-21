import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

// 1. GET: Qualquer usuário (ou visitante) pode ver as categorias
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nome: "asc" }
    })
    return NextResponse.json(categorias, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar categorias" }, { status: 500 })
  }
}

// 2. POST: Apenas usuários autenticados como ADMIN podem criar novas categorias
export async function POST(request: Request) {
  try {
    // Verifica a sessão atual através do cookie seguro
    const session = await auth()

    // Bloqueia se não estiver logado ou se não for ADMIN
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado. Acesso restrito a administradores." }, { status: 403 })
    }

    const body = await request.json()
    const { nome } = body

    if (!nome) {
      return NextResponse.json({ error: "O nome da categoria é obrigatório" }, { status: 400 })
    }

    // Verifica se já existe
    const categoriaExiste = await prisma.categoria.findUnique({
      where: { nome }
    })

    if (categoriaExiste) {
      return NextResponse.json({ error: "Esta categoria já está cadastrada" }, { status: 400 })
    }

    const novaCategoria = await prisma.categoria.create({
      data: { nome }
    })

    return NextResponse.json(novaCategoria, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro interno ao criar categoria" }, { status: 500 })
  }
}
