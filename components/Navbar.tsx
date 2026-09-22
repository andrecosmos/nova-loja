'use client'

import Link from "next/link"
import { useCarrinho } from "@/context/CarrinhoContext"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { totalItens } = useCarrinho()
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-wrap items-center justify-between gap-y-2">
        
        {/* LOGO */}
        <Link href="/" className="shrink-0 text-xl sm:text-2xl font-black text-indigo-600 tracking-tight">
          MINHA<span className="text-gray-900">LOJA</span>
        </Link>

        {/* LINKS E STATUS DE AUTENTICAÇÃO */}
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-6">
          
          {/* BOTÃO DO CARRINHO */}
          <Link href="/carrinho" className="relative shrink-0 p-2 text-gray-700 hover:text-indigo-600 transition-colors">
            <span className="whitespace-nowrap text-sm font-semibold">🛒 Carrinho</span>
            {totalItens > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                {totalItens}
              </span>
            )}
          </Link>

          {/* MONITOR DE SESSÃO */}
          {status === "loading" ? (
            <span className="basis-full text-right text-xs text-gray-400 sm:basis-auto">Carregando...</span>
          ) : session ? (
            <div className="basis-full flex flex-wrap items-center justify-end gap-2 sm:basis-auto sm:flex-nowrap sm:gap-4">
              <div className="order-3 basis-full min-w-0 text-left sm:order-none sm:basis-auto sm:text-right">
                <p className="text-xs font-bold text-gray-900">Olá, {session.user?.name}</p>
                <div className="flex flex-col items-end gap-0.5 mt-0.5">
                  <Link href="/pedidos" className="text-[11px] text-indigo-600 font-bold hover:underline">
                    📋 Meus Pedidos
                  </Link>
                  
                  {/* LINK VISUAL PRO PAINEL (APENAS PARA ADMIN) */}
                  {(session.user as any).role === "ADMIN" && (
                    <Link href="/admin" className="text-[11px] text-amber-600 font-black hover:underline">
                      🛡️ Painel Admin
                    </Link>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="shrink-0 text-xs font-bold bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 px-2 sm:px-3 py-2 rounded-lg transition-all border border-transparent hover:border-red-100"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="basis-full text-center text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-md shadow-indigo-100 sm:basis-auto"
            >
              Entrar / Criar Conta
            </Link>
          )}

        </div>
      </div>
    </header>
  )
}
