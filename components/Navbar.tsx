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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tight">
          MINHA<span className="text-gray-900">LOJA</span>
        </Link>

        {/* LINKS E STATUS DE AUTENTICAÇÃO */}
        <div className="flex items-center gap-6">
          
          {/* BOTÃO DO CARRINHO */}
          <Link href="/carrinho" className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors">
            <span className="text-sm font-semibold">🛒 Carrinho</span>
            {totalItens > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                {totalItens}
              </span>
            )}
          </Link>

          {/* MONITOR DE SESSÃO */}
          {status === "loading" ? (
            <span className="text-xs text-gray-400">Carregando...</span>
          ) : session ? (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
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
                className="text-xs font-bold bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 px-3 py-2 rounded-lg transition-all border border-transparent hover:border-red-100"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-md shadow-indigo-100"
            >
              Entrar / Criar Conta
            </Link>
          )}

        </div>
      </div>
    </header>
  )
}
