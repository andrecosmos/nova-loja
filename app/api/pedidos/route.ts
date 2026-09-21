export const dynamic = 'force-dynamic';


import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

// 1. POST: Criação do Pedido (Checkout do Carrinho)
export async function POST(request: Request) {
  try {
    const session = await auth()

    // Bloqueia se o usuário não estiver logado
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Acesso negado. Faça login para continuar." }, { status: 401 })
    }

    const body = await request.json()
    const { itens } = body // Espera um array: [{ produtoId: 1, quantidade: 2, precoFixo: 29.90 }]

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return NextResponse.json({ error: "O carrinho não possui itens válidos." }, { status: 400 })
    }

    const userId = Number(session.user.id)

    // Calcula o valor total geral somando quantidade * preço de cada item
    const totalPedido = itens.reduce((soma, item) => {
      return soma + (Number(item.quantidade) * Number(item.precoFixo))
    }, 0)

    // Executa uma transação atômica no banco de dados existente
    const novoPedido = await prisma.$transaction(async (tx) => {
      // Cria a linha do Pedido principal
      const pedido = await tx.pedido.create({
        data: {
          userId,
          total: totalPedido,
          status: "PENDENTE", // Valor inicial do seu Enum StatusPedido
        }
      })

      // Prepara os dados para inserir todos os subitens de uma vez vinculados ao ID do pedido criado
      const itensFormatados = itens.map((item) => ({
        pedidoId: pedido.id,
        produtoId: Number(item.produtoId),
        quantidade: Number(item.quantidade),
        precoFixo: Number(item.precoFixo)
      }))

      // Cria as linhas na tabela ItemPedido
      await tx.itemPedido.createMany({
        data: itensFormatados
      })

      return pedido
    })

    return NextResponse.json(novoPedido, { status: 201 })
  } catch (error) {
    console.error("Erro no checkout:", error)
    return NextResponse.json({ error: "Erro interno ao processar o pedido." }, { status: 500 })
  }
}

// 2. GET: Listagem de histórico de pedidos
// Se for CLIENTE, vê apenas os próprios pedidos. Se for ADMIN, vê todos os pedidos da loja.
export async function GET() {
  try {
    const session = await auth()

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number(session.user.id)
    const userRole = (session.user as any).role

    let pedidos

    if (userRole === "ADMIN") {
      // Administrador puxa os pedidos de todo mundo e inclui o nome do cliente
      pedidos = await prisma.pedido.findMany({
        include: {
          user: { select: { name: true, email: true } },
          itens: { include: { produto: true } }
        },
        orderBy: { dataCriacao: "desc" }
      })
    } else {
      // Cliente comum vê exclusivamente o seu histórico
      pedidos = await prisma.pedido.findMany({
        where: { userId },
        include: {
          itens: { include: { produto: true } }
        },
        orderBy: { dataCriacao: "desc" }
      })
    }

    return NextResponse.json(pedidos, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar histórico de pedidos" }, { status: 500 })
  }
}
