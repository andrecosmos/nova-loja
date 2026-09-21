export const dynamic = 'force-dynamic';


import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

// GET: Lista todos os produtos com suas respectivas categorias
export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        Categoria: {
          select: { nome: true }
        }
      },
      orderBy: { id: "desc" }
    })
    return NextResponse.json(produtos, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
}

// POST: Cria um novo produto (Apenas ADMIN)
export async function POST(request: Request) {
  try {
    const session = await auth()

    // Proteção de rota para administradores
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }

    const body = await request.json()
    const { nome, preco, categoriaId, descricao, imagem } = body

    // Validação de campos obrigatórios
    if (!nome || !preco || !categoriaId || !descricao) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
    }

    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        preco: Number(preco),
        categoriaId: Number(categoriaId),
        descricao,
        imagem: imagem || null // Se não enviar, salva como nulo
      }
    })

    return NextResponse.json(novoProduto, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 })
  }
}
