export const dynamic = 'force-dynamic';


import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET: Busca os detalhes de um único produto
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const produtoId = Number(id)

    if (isNaN(produtoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const produto = await prisma.produto.findUnique({
      where: { id: produtoId },
      include: { Categoria: true }
    })

    if (!produto) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    return NextResponse.json(produto, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar produto" }, { status: 500 })
  }
}

// PUT: Atualiza um produto existente (Apenas ADMIN)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    const { id } = await params
    const produtoId = Number(id)
    const body = await request.json()

    const { nome, preco, categoriaId, descricao, imagem } = body

    const produtoAtualizado = await prisma.produto.update({
      where: { id: produtoId },
      data: {
        nome,
        preco: preco ? Number(preco) : undefined,
        categoriaId: categoriaId ? Number(categoriaId) : undefined,
        descricao,
        imagem
      }
    })

    return NextResponse.json(produtoAtualizado, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 })
  }
}

// DELETE: Remove um produto (Apenas ADMIN)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    const { id } = await params
    const produtoId = Number(id)

    await prisma.produto.delete({
      where: { id: produtoId }
    })

    return NextResponse.json({ message: "Produto deletado com sucesso" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar produto ou produto inexistente" }, { status: 500 })
  }
}
