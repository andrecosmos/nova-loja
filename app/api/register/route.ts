export const dynamic = 'force-dynamic';



import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" }, 
        { status: 400 }
      )
    }

    const userExists = await prisma.user.findUnique({
      where: { email },
    })

    if (userExists) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado" }, 
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "CLIENTE",
      },
    })

    return NextResponse.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }, { status: 201 })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro interno no servidor" }, 
      { status: 500 }
    )
  }
}
