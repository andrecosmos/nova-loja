export const dynamic = 'force-dynamic';


import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

interface RouteParams {
  params: Promise<{ id: string }>
}

// PATCH: Atualiza o status de um pedido específico (Apenas ADMIN)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 })
    }

    const { id } = await params
    const pedidoId = Number(id)
    const body = await request.json()
    const { status } = body // Espera um valor do Enum: PENDENTE, PAGO, ENVIADO, ENTREGUE, CANCELADO

    if (!status) {
      return NextResponse.json({ error: "O campo status é obrigatório" }, { status: 400 })
    }

    const pedidoAtualizado = await prisma.pedido.update({
      where: { id: pedidoId },
      data: { status }
    })

    return NextResponse.json(pedidoAtualizado, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar status do pedido." }, { status: 500 })
  }
}
